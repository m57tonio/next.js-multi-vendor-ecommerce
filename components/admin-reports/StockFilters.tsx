"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Icon } from "@/components/dashboard/Icon";

/**
 * Vendor + stock-sort filters for the admin stock report. URL-driven (?vendor,
 * ?sort) so the view is shareable; preserves ?status/?search and resets ?page.
 */
export function StockFilters({ vendors }: { vendors: { id: string; storeName: string }[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const vendor = params.get("vendor") ?? "";
  const sort = params.get("sort") ?? "low-to-high";

  function set(key: string, value: string) {
    const sp = new URLSearchParams(params.toString());
    if (value) sp.set(key, value);
    else sp.delete(key);
    sp.delete("page");
    const qs = sp.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  }

  const selectCls =
    "h-12 w-full max-w-full appearance-none rounded-[11px] border border-line bg-field px-3.5 pr-10 font-sans text-[13.5px] text-ink outline-none focus:border-iris-500 focus:shadow-[0_0_0_3px_var(--color-iris-100)]";

  return (
    <div className="mb-[22px] rounded-[18px] border border-line-soft bg-surface p-6 shadow-xs">
      <div className="mb-4 font-display text-[15px] font-bold text-ink">Filter Data</div>
      <div className="flex flex-wrap items-center gap-3.5">
        <div className="relative w-[240px] max-w-full">
          <select
            aria-label="Store"
            value={vendor}
            onChange={(e) => set("vendor", e.target.value)}
            className={selectCls}
          >
            <option value="">All stores</option>
            {vendors.map((v) => (
              <option key={v.id} value={v.id}>
                {v.storeName}
              </option>
            ))}
          </select>
          <Icon name="chevronDown" size={16} strokeWidth={2} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted" />
        </div>
        <div className="relative w-[260px] max-w-full">
          <select
            aria-label="Sort by stock"
            value={sort}
            onChange={(e) => set("sort", e.target.value)}
            className={selectCls}
          >
            <option value="low-to-high">Stock sort by (low to high)</option>
            <option value="high-to-low">Stock sort by (high to low)</option>
          </select>
          <Icon name="chevronDown" size={16} strokeWidth={2} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted" />
        </div>
      </div>
    </div>
  );
}
