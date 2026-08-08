export default function AdminEarningsLoading() {
  return (
    <div>
      <div className="mb-[22px] h-9 w-56 animate-pulse rounded bg-line-soft" />
      <div className="mb-[22px] flex gap-3">
        <div className="h-11 w-36 animate-pulse rounded-full bg-line-soft" />
        <div className="h-11 w-36 animate-pulse rounded-full bg-line-soft" />
      </div>
      <div className="mb-[22px] h-[112px] animate-pulse rounded-[18px] bg-line-soft" />
      <div className="mb-[22px] grid grid-cols-1 gap-[22px] lg:grid-cols-[300px_1fr_300px]">
        <div className="flex flex-col gap-[22px]">
          <div className="h-[180px] animate-pulse rounded-[18px] bg-line-soft" />
          <div className="h-[96px] animate-pulse rounded-[18px] bg-line-soft" />
          <div className="h-[96px] animate-pulse rounded-[18px] bg-line-soft" />
        </div>
        <div className="h-[440px] animate-pulse rounded-[18px] bg-line-soft" />
        <div className="h-[440px] animate-pulse rounded-[18px] bg-line-soft" />
      </div>
      <div className="h-[220px] animate-pulse rounded-[18px] bg-line-soft" />
    </div>
  );
}
