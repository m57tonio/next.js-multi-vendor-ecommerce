import type { Metadata } from "next";
import { requireRole } from "@/lib/guard";
import { getConversations } from "@/lib/chat/actions";
import { ChatConsole } from "@/components/chat/ChatConsole";

export const metadata: Metadata = { title: "Chat Box — Covet Seller" };
export const dynamic = "force-dynamic";

export default async function VendorChatPage({
  searchParams,
}: {
  searchParams: Promise<{ c?: string }>;
}) {
  await requireRole("VENDOR", "/vendor/login");

  const sp = await searchParams;
  const data = await getConversations();

  return (
    <div>
      <div className="mb-5">
        <h1 className="font-display text-[22px] font-bold tracking-[-0.01em] text-ink">Chat Box</h1>
        <p className="mt-1.5 font-sans text-[13px] text-muted">
          Conversations with customers about your products
        </p>
      </div>

      <ChatConsole
        side="VENDOR"
        initialConversations={data?.conversations ?? []}
        initialConversationId={sp.c}
      />
    </div>
  );
}
