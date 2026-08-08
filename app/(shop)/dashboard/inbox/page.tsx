import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getConversations } from "@/lib/chat/actions";
import { ChatConsole } from "@/components/chat/ChatConsole";

export const metadata: Metadata = { title: "Inbox — Covet" };
export const dynamic = "force-dynamic";

export default async function InboxPage({
  searchParams,
}: {
  searchParams: Promise<{ c?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?next=/dashboard/inbox");
  // The customer inbox is the CUSTOMER side; route others to their own area.
  if (session.user.role === "VENDOR") redirect("/vendor/chat");
  if (session.user.role !== "CUSTOMER") redirect("/admin/dashboard");

  const sp = await searchParams;
  const data = await getConversations();

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-[22px] font-bold tracking-[-0.01em] text-ink">Inbox</h1>
        <div className="mt-3 h-[3px] w-11 rounded-full bg-iris-500" />
      </div>

      <ChatConsole
        side="CUSTOMER"
        initialConversations={data?.conversations ?? []}
        initialConversationId={sp.c}
      />
    </div>
  );
}
