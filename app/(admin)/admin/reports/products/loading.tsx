export default function AdminProductReportLoading() {
  return (
    <div>
      <div className="mb-5 h-9 w-52 animate-pulse rounded bg-line-soft" />
      <div className="mb-[22px] flex gap-3">
        <div className="h-11 w-36 animate-pulse rounded-full bg-line-soft" />
        <div className="h-11 w-36 animate-pulse rounded-full bg-line-soft" />
      </div>
      <div className="mb-[22px] h-[112px] animate-pulse rounded-[18px] bg-line-soft" />
      <div className="mb-[22px] grid grid-cols-1 gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-[92px] animate-pulse rounded-[18px] bg-line-soft" />
        ))}
      </div>
      <div className="mb-[22px] h-[400px] animate-pulse rounded-[18px] bg-line-soft" />
      <div className="mb-[22px] grid grid-cols-1 gap-[22px] lg:grid-cols-2">
        <div className="h-[240px] animate-pulse rounded-[18px] bg-line-soft" />
        <div className="h-[240px] animate-pulse rounded-[18px] bg-line-soft" />
      </div>
      <div className="rounded-[18px] border border-line-soft bg-surface p-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 border-b border-line-soft py-4 last:border-b-0">
            <div className="h-3 w-8 animate-pulse rounded bg-line-soft" />
            <div className="h-3 flex-1 animate-pulse rounded bg-line-soft" />
            <div className="h-3 w-16 animate-pulse rounded bg-line-soft" />
            <div className="h-3 w-16 animate-pulse rounded bg-line-soft" />
          </div>
        ))}
      </div>
    </div>
  );
}
