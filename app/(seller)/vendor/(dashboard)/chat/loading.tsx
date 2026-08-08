export default function VendorChatLoading() {
  return (
    <div>
      <div className="mb-5 h-8 w-40 animate-pulse rounded bg-line-soft" />
      <div className="grid h-[560px] grid-cols-1 overflow-hidden rounded-2xl border border-line-soft bg-surface sm:grid-cols-[300px_1fr]">
        <div className="border-r border-line-soft p-4">
          <div className="mb-4 h-11 animate-pulse rounded-[10px] bg-line-soft" />
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="mb-3 flex items-center gap-3">
              <div className="size-11 flex-none animate-pulse rounded-xl bg-line-soft" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-2/3 animate-pulse rounded bg-line-soft" />
                <div className="h-2.5 w-4/5 animate-pulse rounded bg-line-soft" />
              </div>
            </div>
          ))}
        </div>
        <div className="bg-bg-subtle p-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className={`mb-4 h-11 w-1/2 animate-pulse rounded-2xl bg-line-soft ${i % 2 ? "ml-auto" : ""}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
