import type { Metadata } from "next";
import Link from "next/link";
import { requireRole } from "@/lib/guard";
import { Icon } from "@/components/dashboard/Icon";
import {
  getAdminStockReport,
  ADMIN_STOCK_PAGE_SIZE,
  type AdminStockRow,
  type StockStatus,
} from "@/lib/admin/reports";
import { AdminOrderSearch } from "@/components/admin-orders/AdminOrderSearch";
import { ReportExportButton } from "@/components/vendor-reports/ReportExportButton";
import { StockFilters } from "@/components/admin-reports/StockFilters";

export const metadata: Metadata = { title: "Product Stock Report — Covet Admin" };
export const dynamic = "force-dynamic";

const DATE_FMT = new Intl.DateTimeFormat("en-US", { day: "2-digit", month: "short", year: "numeric" });
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
const ROW = "grid grid-cols-[50px_1.8fr_1.3fr_130px_110px_140px] items-center gap-3";

const STATUS_META: Record<StockStatus, { label: string; cls: string }> = {
  IN_STOCK: { label: "In-Stock", cls: "bg-success-bg text-success" },
  SOON_OUT: { label: "Soon Stock Out", cls: "bg-warning-bg text-warning" },
  OUT_OF_STOCK: { label: "Out of Stock", cls: "bg-error-bg text-error" },
};

export default async function AdminStockReportPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  await requireRole("ADMIN", "/admin/login");

  const sp = await searchParams;
  const statusSlug = one(sp.status);
  const vendorId = one(sp.vendor) || undefined;
  const search = one(sp.search)?.trim() || undefined;
  const sort = one(sp.sort);
  const page = Math.max(1, Number(one(sp.page)) || 1);

  const { rows, total, totalPages, summary, vendors, status } = await getAdminStockReport({
    statusSlug,
    vendorId,
    search,
    sort,
    page,
  });

  const preserved = () => {
    const params = new URLSearchParams();
    if (vendorId) params.set("vendor", vendorId);
    if (search) params.set("search", search);
    if (sort) params.set("sort", sort);
    return params;
  };
  const filterHref = (slug?: string) => {
    const params = preserved();
    if (slug) params.set("status", slug);
    const qs = params.toString();
    return qs ? `/admin/reports/stock?${qs}` : "/admin/reports/stock";
  };
  const pageHref = (p: number) => {
    const params = preserved();
    if (statusSlug) params.set("status", statusSlug);
    if (p > 1) params.set("page", String(p));
    const qs = params.toString();
    return qs ? `/admin/reports/stock?${qs}` : "/admin/reports/stock";
  };

  const filters: { slug?: string; label: string; count: number }[] = [
    { label: "All", count: summary.all },
    { slug: "in-stock", label: "In-Stock", count: summary.inStock },
    { slug: "soon-out", label: "Soon Stock Out", count: summary.soonOut },
    { slug: "out-of-stock", label: "Out of Stock", count: summary.outOfStock },
  ];

  const exportRows = rows.map((r, i) => [
    (page - 1) * ADMIN_STOCK_PAGE_SIZE + i + 1,
    r.name,
    r.sellerName,
    r.categoryName,
    r.stock,
    STATUS_META[r.status].label,
    DATE_FMT.format(r.updatedAt),
  ]);

  return (
    <div>
      {/* Header */}
      <div className="mb-5 flex items-center gap-3">
        <span className="flex size-9 items-center justify-center rounded-[10px] bg-iris-50 text-iris-500">
          <Icon name="box" size={19} strokeWidth={1.9} />
        </span>
        <div>
          <h1 className="font-display text-[22px] font-bold tracking-[-0.01em] text-ink">Product Stock Report</h1>
          <p className="mt-1 font-sans text-[13px] text-muted">Live inventory across all vendors</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-[22px] flex gap-3">
        <Link
          href="/admin/reports/products"
          className="flex h-11 items-center rounded-full px-6 font-sans text-sm font-medium text-muted transition-colors hover:text-ink"
        >
          All Products
        </Link>
        <span className="flex h-11 items-center rounded-full bg-iris-500 px-6 font-sans text-sm font-semibold text-white">
          Product Stock
        </span>
      </div>

      <StockFilters vendors={vendors} />

      {/* Status filter pills */}
      <div className="mb-4 flex flex-wrap gap-2">
        {filters.map((f) => {
          const active = (f.slug ?? undefined) === (statusSlug ?? undefined);
          return (
            <Link
              key={f.label}
              href={filterHref(f.slug)}
              className={`flex h-9 items-center gap-2 rounded-full border px-4 font-sans text-[13px] font-semibold transition-colors ${
                active ? "border-iris-500 bg-iris-500 text-white" : "border-line bg-surface text-ink-soft hover:border-iris-300"
              }`}
            >
              {f.label}
              <span
                className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 font-display text-[11px] font-bold ${
                  active ? "bg-white/20 text-white" : "bg-line-soft text-muted"
                }`}
              >
                {f.count}
              </span>
            </Link>
          );
        })}
      </div>

      {/* List */}
      <div className="rounded-[18px] border border-line-soft bg-surface p-6 shadow-xs">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3.5">
          <div className="flex items-center gap-2.5">
            <span className="font-display text-[17px] font-bold text-ink">Product Stock</span>
            <span className="flex h-6 min-w-[26px] items-center justify-center rounded-full bg-line-soft px-2.5 font-display text-[12px] font-bold text-ink-soft">
              {total}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <AdminOrderSearch placeholder="Search product name" />
            <ReportExportButton
              filename="admin-stock-report.csv"
              headers={["SL", "Product", "Seller", "Category", "Current Stock", "Status", "Last Updated"]}
              rows={exportRows}
            />
          </div>
        </div>

        {rows.length > 0 ? (
          <>
            <div className="overflow-x-auto rounded-[14px] border border-line-soft">
              <div className="min-w-[820px]">
                <div className={`${ROW} bg-field px-[18px] py-3.5 font-sans text-[11px] font-semibold uppercase tracking-[0.04em] text-muted`}>
                  <span>SL</span>
                  <span>Product Name</span>
                  <span>Store / Category</span>
                  <span>Last Updated</span>
                  <span>Current Stock</span>
                  <span className="text-right">Status</span>
                </div>
                {rows.map((r, i) => (
                  <StockRow key={r.productId} row={r} sl={(page - 1) * ADMIN_STOCK_PAGE_SIZE + i + 1} />
                ))}
              </div>
            </div>

            {totalPages > 1 && (
              <nav className="mt-5 flex items-center justify-end gap-1.5" aria-label="Pagination">
                {page > 1 && (
                  <Link
                    href={pageHref(page - 1)}
                    className="flex h-9 items-center gap-1 rounded-lg border border-line px-3 font-sans text-[13px] font-medium text-ink-soft transition-colors hover:border-iris-500 hover:text-iris-500"
                  >
                    <Icon name="chevronLeft" size={14} strokeWidth={2.2} />
                    Prev
                  </Link>
                )}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <Link
                    key={p}
                    href={pageHref(p)}
                    aria-current={p === page ? "page" : undefined}
                    className={`flex h-9 min-w-9 items-center justify-center rounded-lg px-2 font-sans text-[13px] font-semibold transition-colors ${
                      p === page ? "bg-iris-500 text-white" : "bg-field text-ink-soft hover:text-iris-500"
                    }`}
                  >
                    {p}
                  </Link>
                ))}
                {page < totalPages && (
                  <Link
                    href={pageHref(page + 1)}
                    className="flex h-9 items-center gap-1 rounded-lg border border-line px-3 font-sans text-[13px] font-medium text-ink-soft transition-colors hover:border-iris-500 hover:text-iris-500"
                  >
                    Next
                    <Icon name="chevronRight" size={14} strokeWidth={2.2} />
                  </Link>
                )}
              </nav>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center px-8 py-16 text-center">
            <span className="mb-5 flex size-[78px] items-center justify-center rounded-[22px] bg-iris-50 text-iris-400">
              <Icon name="box" size={34} strokeWidth={1.6} />
            </span>
            <div className="font-display text-[19px] font-bold text-ink">
              {status || vendorId || search ? "No products match these filters" : "No products yet"}
            </div>
            <p className="mx-auto mt-2.5 max-w-[360px] font-sans text-sm leading-[1.5] text-muted">
              {status || vendorId || search
                ? "Try a different store or stock status, or clear the search."
                : "Products across the marketplace will appear here with live stock levels."}
            </p>
            {(status || vendorId || search) && (
              <Link
                href="/admin/reports/stock"
                className="mt-6 flex h-11 items-center rounded-xl bg-iris-500 px-6 font-sans text-[13.5px] font-semibold text-white transition-colors hover:bg-iris-600"
              >
                Clear filters
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function StockRow({ row, sl }: { row: AdminStockRow; sl: number }) {
  const meta = STATUS_META[row.status];
  return (
    <div className={`${ROW} border-t border-line-soft px-[18px] py-3.5 font-sans text-[13px] text-ink-soft transition-colors hover:bg-bg-subtle`}>
      <span className="text-muted-soft">{sl}</span>
      <Link
        href={`/products/${row.slug}`}
        className="line-clamp-1 font-sans text-[13px] font-semibold text-ink hover:text-iris-500"
      >
        {row.name}
      </Link>
      <div className="min-w-0">
        <div className="truncate font-sans text-[12.5px] text-iris-500">{row.sellerName}</div>
        <div className="mt-0.5 truncate font-sans text-[11px] text-muted-soft">{row.categoryName}</div>
      </div>
      <span className="font-sans text-[12.5px] text-muted">{DATE_FMT.format(row.updatedAt)}</span>
      <span className="font-display text-[15px] font-extrabold text-ink">{row.stock}</span>
      <span className="justify-self-end">
        <span className={`inline-flex items-center rounded-full px-2.5 py-1 font-sans text-[11px] font-semibold ${meta.cls}`}>
          {meta.label}
        </span>
      </span>
    </div>
  );
}
