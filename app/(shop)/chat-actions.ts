"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { findOrCreateConversation } from "@/lib/chat/conversations";

const schema = z.object({
  vendorId: z.string().min(1),
  productId: z.string().min(1).optional(),
  // Where to return the shopper after login (must be an in-app path).
  backTo: z.string().startsWith("/").default("/"),
});

/**
 * Start (or reopen) a chat with a vendor from the product page.
 * - Logged out → /login, returning to the product page afterwards.
 * - Vendor/admin → sent to their own area (only customers start chats).
 * - Customer → find-or-create the pair's conversation, open it in the inbox.
 */
export async function startConversationWithVendor(formData: FormData) {
  const parsed = schema.safeParse({
    vendorId: formData.get("vendorId"),
    productId: formData.get("productId") || undefined,
    backTo: formData.get("backTo") || "/",
  });
  if (!parsed.success) redirect("/");
  const { vendorId, productId, backTo } = parsed.data;

  const session = await auth();
  if (!session?.user?.id) {
    redirect(`/login?next=${encodeURIComponent(backTo)}`);
  }
  // Only customers initiate chats; route others sensibly instead of creating one.
  if (session.user.role === "VENDOR") redirect("/vendor/chat");
  if (session.user.role !== "CUSTOMER") redirect("/admin/dashboard");

  // Guard against a tampered vendorId (would otherwise hit an FK error).
  const vendor = await prisma.vendor.findUnique({ where: { id: vendorId }, select: { id: true } });
  if (!vendor) redirect(backTo);

  const convo = await findOrCreateConversation(session.user.id, vendorId, productId);
  redirect(`/dashboard/inbox?c=${convo.id}`);
}
