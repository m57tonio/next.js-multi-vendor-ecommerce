export default function AdminStockReportLoading() {
  return (
    <div>
      <div className="mb-5 h-9 w-64 animate-pulse rounded bg-line-soft" />
      <div className="mb-[22px] flex gap-3">
        <div className="h-11 w-36 animate-pulse rounded-full bg-line-soft" />
        <div className="h-11 w-36 animate-pulse rounded-full bg-line-soft" />
      </div>
      <div className="mb-[22px] h-[104px] animate-pulse rounded-[18px] bg-line-soft" />
      <div className="mb-4 flex gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-9 w-32 animate-pulse rounded-full bg-line-soft" />
        ))}
      </div>
      <div className="rounded-[18px] border border-line-soft bg-surface p-6">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 border-b border-line-soft py-4 last:border-b-0">
            <div className="h-3 w-8 animate-pulse rounded bg-line-soft" />
            <div className="h-3 flex-1 animate-pulse rounded bg-line-soft" />
            <div className="h-3 w-12 animate-pulse rounded bg-line-soft" />
            <div className="h-6 w-24 animate-pulse rounded-full bg-line-soft" />
          </div>
        ))}
      </div>
    </div>
  );
}
