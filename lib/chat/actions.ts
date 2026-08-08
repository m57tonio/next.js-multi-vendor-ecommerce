"use server";

import { z } from "zod";
import type { ChatSenderRole } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { saveChatImage, ChatFileError } from "@/lib/chat/chat-upload";
import type {
  ChatSide,
  ConversationsResult,
  SendResult,
  ThreadResult,
} from "@/lib/chat/types";

// ─────────────────────────────────────────────────────────────────────────────
// Identity + participant scoping — EVERY chat action derives who's calling from
// the session (never trusts the client) and scopes to conversations they're in.
// ─────────────────────────────────────────────────────────────────────────────

type Identity =
  | { side: "CUSTOMER"; customerId: string }
  | { side: "VENDOR"; vendorId: string };

async function resolveIdentity(): Promise<Identity | null> {
  const session = await auth();
  if (!session?.user?.id) return null;
  if (session.user.role === "CUSTOMER") {
    return { side: "CUSTOMER", customerId: session.user.id };
  }
  if (session.user.role === "VENDOR") {
    const vendorId =
      session.user.vendorId ??
      (await prisma.vendor.findUnique({ where: { userId: session.user.id }, select: { id: true } }))?.id;
    if (!vendorId) return null;
    return { side: "VENDOR", vendorId };
  }
  return null; // admin/other are not chat participants
}

/** WHERE clause that limits conversations to this identity's own threads. */
function scopeWhere(id: Identity) {
  return id.side === "CUSTOMER" ? { customerId: id.customerId } : { vendorId: id.vendorId };
}

const otherRole = (side: ChatSide): ChatSenderRole => (side === "CUSTOMER" ? "VENDOR" : "CUSTOMER");

/** Loads the conversation ONLY if the caller participates in it; else null. */
async function assertParticipant(conversationId: string, id: Identity) {
  return prisma.conversation.findFirst({
    where: { id: conversationId, ...scopeWhere(id) },
    select: { id: true },
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Actions
// ─────────────────────────────────────────────────────────────────────────────

/** This caller's conversations, newest-activity first, with unread counts. */
export async function getConversations(): Promise<ConversationsResult | null> {
  const id = await resolveIdentity();
  if (!id) return null;

  const convos = await prisma.conversation.findMany({
    where: scopeWhere(id),
    orderBy: { lastMessageAt: "desc" },
    select: {
      id: true,
      lastMessageAt: true,
      customer: { select: { name: true, image: true } },
      vendor: { select: { storeName: true, logo: true } },
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: { text: true, image: true },
      },
    },
  });

  const ids = convos.map((c) => c.id);
  const unreadGroups = ids.length
    ? await prisma.message.groupBy({
        by: ["conversationId"],
        where: { conversationId: { in: ids }, senderRole: otherRole(id.side), readAt: null },
        _count: { _all: true },
      })
    : [];
  const unreadBy = new Map(unreadGroups.map((g) => [g.conversationId, g._count._all]));

  const isCust = id.side === "CUSTOMER";
  const conversations = convos.map((c) => {
    const name = isCust ? c.vendor.storeName : c.customer.name ?? "Customer";
    const last = c.messages[0];
    const preview = last ? (last.text ? last.text : "Sent a photo") : "No messages yet";
    return {
      id: c.id,
      name,
      avatarImage: isCust ? c.vendor.logo : c.customer.image,
      avatarInitial: (name.trim()[0] ?? "?").toUpperCase(),
      preview,
      lastAt: c.lastMessageAt.toISOString(),
      unread: unreadBy.get(c.id) ?? 0,
    };
  });

  return { side: id.side, conversations };
}

/** Messages for a conversation — ONLY when the caller is a participant, else null. */
export async function getMessages(conversationId: string): Promise<ThreadResult | null> {
  const id = await resolveIdentity();
  if (!id) return null;

  const convo = await prisma.conversation.findFirst({
    where: { id: conversationId, ...scopeWhere(id) },
    select: {
      id: true,
      customer: { select: { name: true, image: true } },
      vendor: { select: { storeName: true, logo: true } },
      product: { select: { name: true } },
      messages: {
        orderBy: { createdAt: "asc" },
        select: { id: true, senderRole: true, text: true, image: true, createdAt: true },
      },
    },
  });
  if (!convo) return null; // not a participant / not found

  const isCust = id.side === "CUSTOMER";
  const name = isCust ? convo.vendor.storeName : convo.customer.name ?? "Customer";
  const mineRole: ChatSenderRole = id.side;

  return {
    conversationId: convo.id,
    header: {
      name,
      avatarImage: isCust ? convo.vendor.logo : convo.customer.image,
      avatarInitial: (name.trim()[0] ?? "?").toUpperCase(),
      context: convo.product?.name ?? null,
    },
    messages: convo.messages.map((m) => ({
      id: m.id,
      mine: m.senderRole === mineRole,
      text: m.text,
      image: m.image,
      createdAt: m.createdAt.toISOString(),
    })),
  };
}

const sendSchema = z.object({
  conversationId: z.string().min(1),
  text: z.string().trim().max(4000).optional(),
});

/**
 * Send a message. FormData carries `conversationId`, optional `text`, and an
 * optional `image` File. senderRole is set from the SESSION (never the client);
 * the caller must be a participant; at least one of text/image is required.
 */
export async function sendMessage(formData: FormData): Promise<SendResult> {
  const id = await resolveIdentity();
  if (!id) return { ok: false, error: "You are not signed in." };

  const parsed = sendSchema.safeParse({
    conversationId: formData.get("conversationId"),
    text: ((formData.get("text") as string) ?? "").trim() || undefined,
  });
  if (!parsed.success) return { ok: false, error: "Invalid message." };
  const { conversationId, text } = parsed.data;

  const convo = await assertParticipant(conversationId, id);
  if (!convo) return { ok: false, error: "Conversation not found." };

  let imagePath: string | null = null;
  const file = formData.get("image");
  if (file instanceof File && file.size > 0) {
    try {
      imagePath = await saveChatImage(file);
    } catch (e) {
      return { ok: false, error: e instanceof ChatFileError ? e.message : "Couldn't upload the image." };
    }
  }

  if (!text && !imagePath) return { ok: false, error: "Type a message or attach an image." };

  await prisma.$transaction([
    prisma.message.create({
      data: { conversationId, senderRole: id.side, text: text ?? null, image: imagePath },
    }),
    prisma.conversation.update({
      where: { id: conversationId },
      data: { lastMessageAt: new Date() },
    }),
  ]);

  return { ok: true };
}

/** Mark the OTHER side's messages as read (clears this caller's unread count). */
export async function markRead(conversationId: string): Promise<{ ok: boolean }> {
  const id = await resolveIdentity();
  if (!id) return { ok: false };
  const convo = await assertParticipant(conversationId, id);
  if (!convo) return { ok: false };

  await prisma.message.updateMany({
    where: { conversationId, senderRole: otherRole(id.side), readAt: null },
    data: { readAt: new Date() },
  });
  return { ok: true };
}

/** Total unread messages for this caller — powers the inbox/sidebar badges. */
export async function getChatUnreadTotal(): Promise<number> {
  const id = await resolveIdentity();
  if (!id) return 0;
  return prisma.message.count({
    where: { conversation: scopeWhere(id), senderRole: otherRole(id.side), readAt: null },
  });
}
