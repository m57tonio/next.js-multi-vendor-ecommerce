"use client";

import { useEffect, useRef } from "react";

/**
 * Isolated polling primitive — the ONLY place the "refetch on an interval"
 * behaviour lives. The chat UI calls this to re-fetch the open thread + the
 * conversation list; nothing else in the UI knows about intervals.
 *
 * TODO(realtime): to move off polling, replace the body of this hook with a
 * realtime subscription (Pusher/Ably/Supabase channel keyed on the conversation)
 * that invokes `callback` on each pushed event. The call sites and data model do
 * not change — only this hook.
 */
export function usePolling(
  callback: () => void,
  { intervalMs = 4000, enabled = true }: { intervalMs?: number; enabled?: boolean } = {},
) {
  const saved = useRef(callback);
  useEffect(() => {
    saved.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!enabled) return;
    const tick = () => {
      // Pause polling while the tab is hidden — cheap + avoids wasted requests.
      if (typeof document !== "undefined" && document.hidden) return;
      saved.current();
    };
    const timer = window.setInterval(tick, intervalMs);
    return () => window.clearInterval(timer);
  }, [intervalMs, enabled]);
}
