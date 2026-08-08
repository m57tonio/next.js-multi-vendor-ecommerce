"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Icon } from "@/components/dashboard/Icon";
import { usePolling } from "@/components/chat/usePolling";
import { getConversations, getMessages, markRead, sendMessage } from "@/lib/chat/actions";
import type { ChatSide, ConversationListItem, ThreadResult } from "@/lib/chat/types";

const TIME_FMT = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" });

function listTime(iso: string): string {
  const d = new Date(iso);
  const now = Date.now();
  const diff = now - d.getTime();
  if (diff < 60_000) return "now";
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m`;
  if (diff < 86_400_000) return TIME_FMT.format(d);
  return new Intl.DateTimeFormat("en-US", { day: "2-digit", month: "short" }).format(d);
}

/**
 * The ONE shared conversation console, used by both the customer inbox and the
 * vendor chat box. `side` only changes copy; all data is participant-scoped on
 * the server. Realtime is polling (see usePolling) — swappable later without
 * touching this component.
 */
export function ChatConsole({
  side,
  initialConversations,
  initialConversationId,
}: {
  side: ChatSide;
  initialConversations: ConversationListItem[];
  initialConversationId?: string;
}) {
  const [conversations, setConversations] = useState<ConversationListItem[]>(initialConversations);
  const [activeId, setActiveId] = useState<string | null>(
    initialConversationId && initialConversations.some((c) => c.id === initialConversationId)
      ? initialConversationId
      : initialConversations[0]?.id ?? null,
  );
  const [thread, setThread] = useState<ThreadResult | null>(null);
  const [draft, setDraft] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const fileRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const otherLabel = side === "CUSTOMER" ? "vendors" : "customers";

  // Refetch the list (+ the open thread, marking it read). Isolated so both the
  // interval and post-send flows share one code path.
  const refresh = useCallback(async () => {
    const list = await getConversations();
    if (list) setConversations(list.conversations);
    if (activeId) {
      const t = await getMessages(activeId);
      setThread(t);
      if (t) void markRead(activeId);
    }
  }, [activeId]);

  // Open the active thread whenever it changes.
  useEffect(() => {
    let alive = true;
    if (!activeId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- reset thread when nothing is selected
      setThread(null);
      return;
    }
    (async () => {
      const t = await getMessages(activeId);
      if (!alive) return;
      setThread(t);
      if (t) {
        void markRead(activeId);
        const list = await getConversations();
        if (alive && list) setConversations(list.conversations);
      }
    })();
    return () => {
      alive = false;
    };
  }, [activeId]);

  usePolling(refresh, { intervalMs: 4000 });

  // Keep the thread pinned to the newest message.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [thread?.messages.length, activeId]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!activeId || sending) return;
    const text = draft.trim();
    if (!text && !file) return;

    setSending(true);
    setError(null);
    const fd = new FormData();
    fd.set("conversationId", activeId);
    if (text) fd.set("text", text);
    if (file) fd.set("image", file);

    const res = await sendMessage(fd);
    setSending(false);
    if (res.ok) {
      setDraft("");
      setFile(null);
      if (fileRef.current) fileRef.current.value = "";
      await refresh();
    } else {
      setError(res.error);
    }
  }

  const filtered = query.trim()
    ? conversations.filter(
        (c) =>
          c.name.toLowerCase().includes(query.toLowerCase()) ||
          c.preview.toLowerCase().includes(query.toLowerCase()),
      )
    : conversations;

  // Empty state — no conversations at all.
  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-2xl border border-line-soft bg-surface px-8 py-16 text-center">
        <span className="mb-5 flex size-[78px] items-center justify-center rounded-[22px] bg-iris-50 text-iris-400">
          <Icon name="chat" size={34} strokeWidth={1.6} />
        </span>
        <div className="font-display text-[20px] font-bold text-ink">No messages yet</div>
        <p className="mx-auto mt-3 max-w-[360px] font-sans text-sm leading-[1.5] text-muted">
          {side === "CUSTOMER"
            ? "Open any product and use “Chat with Vendor” to start a conversation. Your chats with vendors will appear here."
            : "When customers message you about your products, their conversations show up here."}
        </p>
      </div>
    );
  }

  return (
    <div className="grid h-[560px] grid-cols-1 overflow-hidden rounded-2xl border border-line-soft bg-surface sm:grid-cols-[300px_1fr]">
      {/* Conversation list */}
      <div className="flex min-h-0 flex-col border-b border-line-soft sm:border-b-0 sm:border-r">
        <div className="p-4 pb-3">
          <div className="flex h-11 items-center gap-2 rounded-[10px] border border-line bg-field px-3 focus-within:border-iris-500 focus-within:shadow-[0_0_0_3px_var(--color-iris-100)]">
            <Icon name="search" size={15} strokeWidth={2} className="flex-none text-muted-soft" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Search ${otherLabel}`}
              className="min-w-0 flex-1 bg-transparent font-sans text-[13px] text-ink outline-none placeholder:text-muted-soft"
            />
          </div>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-2.5 pb-3">
          {filtered.map((c) => {
            const active = c.id === activeId;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setActiveId(c.id)}
                className={`flex w-full items-center gap-3 rounded-xl px-2.5 py-2.5 text-left transition-colors ${
                  active ? "bg-iris-50" : "hover:bg-bg-subtle"
                }`}
              >
                <Avatar image={c.avatarImage} initial={c.avatarInitial} size={44} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate font-display text-[13.5px] font-bold text-ink">{c.name}</span>
                    <span className="flex-none font-sans text-[11px] text-muted-soft">{listTime(c.lastAt)}</span>
                  </div>
                  <div className="mt-1 flex items-center justify-between gap-2">
                    <span className="truncate font-sans text-[12.5px] text-muted">{c.preview}</span>
                    {c.unread > 0 && (
                      <span className="flex h-[18px] min-w-[18px] flex-none items-center justify-center rounded-full bg-iris-500 px-1.5 font-sans text-[10.5px] font-bold text-white">
                        {c.unread}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
          {filtered.length === 0 && (
            <div className="px-3 py-8 text-center font-sans text-[12.5px] text-muted-soft">No matches.</div>
          )}
        </div>
      </div>

      {/* Thread */}
      <div className="flex min-h-0 flex-col bg-bg-subtle">
        {thread ? (
          <>
            <div className="flex items-center gap-3 border-b border-line-soft bg-surface px-5 py-3.5">
              <Avatar image={thread.header.avatarImage} initial={thread.header.avatarInitial} size={42} />
              <div className="min-w-0 flex-1">
                <div className="truncate font-display text-[15px] font-bold text-ink">{thread.header.name}</div>
                <div className="mt-0.5 font-sans text-[11.5px] text-muted-soft">
                  {side === "CUSTOMER" ? "Vendor" : "Customer"}
                </div>
              </div>
              {thread.header.context && (
                <span className="hidden items-center gap-1.5 rounded-full bg-iris-50 px-3 py-1.5 font-sans text-[11px] font-semibold text-iris-600 sm:inline-flex">
                  <Icon name="box" size={13} strokeWidth={2} />
                  <span className="max-w-[180px] truncate">{thread.header.context}</span>
                </span>
              )}
            </div>

            <div ref={scrollRef} className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-5">
              {thread.messages.length === 0 ? (
                <div className="m-auto text-center font-sans text-[13px] text-muted-soft">
                  Say hello — send the first message.
                </div>
              ) : (
                thread.messages.map((m) => (
                  <div key={m.id} className={`flex ${m.mine ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[78%] rounded-2xl px-3.5 py-2.5 ${
                        m.mine
                          ? "rounded-br-md bg-iris-500 text-white"
                          : "rounded-bl-md border border-line-soft bg-surface text-ink"
                      }`}
                    >
                      {m.image && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={m.image}
                          alt="Shared photo"
                          className="mb-1.5 max-h-60 rounded-xl object-cover"
                        />
                      )}
                      {m.text && (
                        <p className="whitespace-pre-wrap break-words font-sans text-[13.5px] leading-[1.45]">
                          {m.text}
                        </p>
                      )}
                      <div
                        className={`mt-1 text-right font-sans text-[10px] ${
                          m.mine ? "text-white/70" : "text-muted-soft"
                        }`}
                      >
                        {TIME_FMT.format(new Date(m.createdAt))}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={handleSend} className="border-t border-line-soft bg-surface p-3.5">
              {file && (
                <div className="mb-2 flex items-center gap-2 rounded-lg bg-iris-50 px-3 py-2 font-sans text-[12px] text-iris-600">
                  <Icon name="image" size={14} strokeWidth={2} />
                  <span className="truncate">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setFile(null);
                      if (fileRef.current) fileRef.current.value = "";
                    }}
                    className="ml-auto flex-none text-muted hover:text-error"
                    aria-label="Remove image"
                  >
                    <Icon name="x" size={14} strokeWidth={2.4} />
                  </button>
                </div>
              )}
              {error && <div className="mb-2 font-sans text-[12px] text-error">{error}</div>}
              <div className="flex items-center gap-2 rounded-[14px] border border-line bg-field py-1.5 pl-3 pr-1.5 focus-within:border-iris-500 focus-within:shadow-[0_0_0_3px_var(--color-iris-100)]">
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  aria-label="Attach image"
                  className="flex-none text-muted transition-colors hover:text-iris-500"
                >
                  <Icon name="image" size={20} strokeWidth={1.9} />
                </button>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                />
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Write your message here…"
                  className="h-10 min-w-0 flex-1 bg-transparent px-1 font-sans text-[14px] text-ink outline-none placeholder:text-muted-soft"
                />
                <button
                  type="submit"
                  disabled={sending || (!draft.trim() && !file)}
                  aria-label="Send"
                  className="flex size-11 flex-none items-center justify-center rounded-[11px] bg-iris-500 text-white transition-colors hover:bg-iris-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Icon name="send" size={18} strokeWidth={2} />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <span className="mb-4 flex size-14 items-center justify-center rounded-[18px] bg-iris-50 text-iris-400">
              <Icon name="chat" size={26} strokeWidth={1.7} />
            </span>
            <div className="font-sans text-[13.5px] text-muted">Select a conversation to start chatting.</div>
          </div>
        )}
      </div>
    </div>
  );
}

function Avatar({ image, initial, size }: { image: string | null; initial: string; size: number }) {
  return (
    <span
      className="flex flex-none items-center justify-center overflow-hidden rounded-xl bg-iris-50 font-display font-bold text-iris-500"
      style={{ width: size, height: size, fontSize: size / 2.6 }}
    >
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image} alt={initial} className="h-full w-full object-cover" />
      ) : (
        initial
      )}
    </span>
  );
}
