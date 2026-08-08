import type { Metadata } from "next";
import Link from "next/link";
import { requireRole } from "@/lib/guard";
import { formatMoney } from "@/lib/shop/pricing";
import { Icon } from "@/components/dashboard/Icon";
import { AreaChart, CHART } from "@/components/dashboard/Charts";
import { getAdminProductReport, type AdminBreakdownRow } from "@/lib/admin/reports";
import { parseReportRange } from "@/lib/vendor/reports";
import { ReportRangeFilter } from "@/components/vendor-reports/ReportRangeFilter";
import { ReportSearch } from "@/components/vendor-reports/ReportSearch";
import { ReportExportButton } from "@/components/vendor-reports/ReportExportButton";

export const metadata: Metadata = { title: "Product Report — Covet Admin" };
export const dynamic = "force-dynamic";

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
const ROW = "grid grid-cols-[50px_1.8fr_1fr_1fr_1fr_1fr_1.1fr] items-center gap-3";

export default async function AdminProductReportPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  await requireRole("ADMIN", "/admin/login");

  const sp = await searchParams;
  const range = parseReportRange({ range: one(sp.range) });
  const report = await getAdminProductReport(range);
  const { summary, chart } = report;

  const q = one(sp.q)?.trim().toLowerCase() ?? "";
  const rows = q ? report.rows.filter((r) => r.name.toLowerCase().includes(q)) : report.rows;

  const exportRows = rows.map((r, i) => [
    i + 1,
    r.name,
    r.sellerName,
    r.categoryName,
    r.unitPrice,
    r.revenue,
    r.unitsSold,
    r.avgValue,
    r.stock,
  ]);

  const tabs: { key: string; label: string; href: string; active: boolean }[] = [
    { key: "all", label: "All Products", href: "/admin/reports/products", active: true },
    { key: "stock", label: "Product Stock", href: "/admin/reports/stock", active: false },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-5 flex items-center gap-3">
        <span className="flex size-9 items-center justify-center rounded-[10px] bg-iris-50 text-iris-500">
          <Icon name="box" size={19} strokeWidth={1.9} />
        </span>
        <div>
          <h1 className="font-display text-[22px] font-bold tracking-[-0.01em] text-ink">Product Report</h1>
          <p className="mt-1 font-sans text-[13px] text-muted">
            {range.label} · best-selling products across all vendors
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-[22px] flex gap-3">
        {tabs.map((t) => (
          <Link
            key={t.key}
            href={t.href}
            className={`flex h-11 items-center rounded-full px-6 font-sans text-sm transition-colors ${
              t.active ? "bg-iris-500 font-semibold text-white" : "font-medium text-muted hover:text-ink"
            }`}
          >
            {t.label}
          </Link>
        ))}
      </div>

      <ReportRangeFilter />

      {/* Stat cards */}
      <div className="mb-[22px] grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard icon="box" tone="iris" value={summary.totalProducts.toLocaleString("en-US")} label="Total Products" />
        <StatCard icon="coins" tone="green" value={summary.totalUnitsSold.toLocaleString("en-US")} label="Total Product Sale" />
        <StatCard icon="wallet" tone="amber" value={formatMoney(summary.totalDiscountGiven)} label="Total Discount Given" />
      </div>

      {/* Chart */}
      <div className="mb-[22px] rounded-[18px] border border-line-soft bg-surface p-6 shadow-xs">
        <div className="mb-3.5 flex items-center justify-between">
          <div className="font-display text-base font-bold text-ink">Product Statistics</div>
          <div className="text-right">
            <div className="font-display text-[17px] font-extrabold text-ink">{formatMoney(summary.totalRevenue)}</div>
            <div className="font-sans text-[11px] text-muted">Total revenue</div>
          </div>
        </div>
        <AreaChart
          labels={chart.labels}
          series={[{ label: chart.label, color: CHART.iris, data: chart.data }]}
          height={300}
          yPrefix=""
        />
      </div>

      {/* By-vendor / by-category breakdowns */}
      <div className="mb-[22px] grid grid-cols-1 gap-[22px] lg:grid-cols-2">
        <BreakdownCard title="Revenue by Vendor" icon="store" rows={report.byVendor} />
        <BreakdownCard title="Revenue by Category" icon="layers" rows={report.byCategory} />
      </div>

      {/* Table */}
      <div className="rounded-[18px] border border-line-soft bg-surface p-6 shadow-xs">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3.5">
          <div className="flex items-center gap-2.5">
            <span className="font-display text-[17px] font-bold text-ink">Top Products</span>
            <span className="flex h-6 min-w-[26px] items-center justify-center rounded-full bg-line-soft px-2.5 font-display text-[12px] font-bold text-ink-soft">
              {rows.length}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <ReportSearch placeholder="Search product name" />
            <ReportExportButton
              filename={`admin-product-report-${range.preset}.csv`}
              headers={["SL", "Product", "Seller", "Category", "Unit Price", "Revenue", "Qty Sold", "Avg Value", "Stock"]}
              rows={exportRows}
            />
          </div>
        </div>

        {rows.length > 0 ? (
          <div className="overflow-x-auto rounded-[14px] border border-line-soft">
            <div className="min-w-[1000px]">
              <div className={`${ROW} bg-field px-[18px] py-3.5 font-sans text-[11px] font-semibold uppercase tracking-[0.04em] text-muted`}>
                <span>SL</span>
                <span>Product Name</span>
                <span>Unit Price</span>
                <span>Total Sold</span>
                <span>Qty Sold</span>
                <span>Avg Value</span>
                <span>Current Stock</span>
              </div>
              {rows.map((r, i) => (
                <div
                  key={r.productId}
                  className={`${ROW} border-t border-line-soft px-[18px] py-3.5 font-sans text-[13px] text-ink-soft transition-colors hover:bg-bg-subtle`}
                >
                  <span className="text-muted-soft">{i + 1}</span>
                  <div className="min-w-0">
                    <Link
                      href={`/products/${r.slug}`}
                      className="line-clamp-1 font-sans text-[13px] font-semibold text-ink hover:text-iris-500"
                    >
                      {r.name}
                    </Link>
                    <div className="mt-0.5 truncate font-sans text-[10.5px] text-iris-500">
                      {r.sellerName} · {r.categoryName}
                    </div>
                  </div>
                  <span>{formatMoney(r.unitPrice)}</span>
                  <span className="font-semibold text-ink">{formatMoney(r.revenue)}</span>
                  <span>{r.unitsSold}</span>
                  <span>{formatMoney(r.avgValue)}</span>
                  <span className="font-medium text-ink">{r.stock}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center px-8 py-16 text-center">
            <span className="mb-5 flex size-[78px] items-center justify-center rounded-[22px] bg-iris-50 text-iris-400">
              <Icon name="box" size={34} strokeWidth={1.6} />
            </span>
            <div className="font-display text-[19px] font-bold text-ink">
              {q ? "No products match your search" : "No product sales in this range"}
            </div>
            <p className="mx-auto mt-2.5 max-w-[360px] font-sans text-sm leading-[1.5] text-muted">
              {q
                ? "Try a different product name, or clear the search."
                : `No products sold across the marketplace during ${range.label.toLowerCase()}. Try a wider date range.`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  icon,
  tone,
  value,
  label,
}: {
  icon: "box" | "coins" | "wallet";
  tone: "iris" | "green" | "amber";
  value: string;
  label: string;
}) {
  const cls =
    tone === "iris" ? "bg-iris-50 text-iris-500" : tone === "green" ? "bg-success-bg text-success" : "bg-warning-bg text-warning";
  return (
    <div className="flex items-center gap-3.5 rounded-[18px] border border-line-soft bg-surface p-[22px] shadow-xs">
      <span className={`flex size-[46px] items-center justify-center rounded-xl ${cls}`}>
        <Icon name={icon} size={22} strokeWidth={1.8} />
      </span>
      <div>
        <div className="font-display text-[24px] font-extrabold leading-none text-ink">{value}</div>
        <div className="mt-1.5 font-sans text-[12px] font-medium text-muted">{label}</div>
      </div>
    </div>
  );
}

function BreakdownCard({
  title,
  icon,
  rows,
}: {
  title: string;
  icon: "store" | "layers";
  rows: AdminBreakdownRow[];
}) {
  const top = rows.slice(0, 6);
  return (
    <div className="rounded-[18px] border border-line-soft bg-surface p-6 shadow-xs">
      <div className="mb-4 flex items-center gap-2 font-display text-[15px] font-bold text-ink">
        <Icon name={icon} size={17} strokeWidth={2} className="text-iris-500" />
        {title}
      </div>
      {top.length > 0 ? (
        <div className="flex flex-col gap-3">
          {top.map((r) => (
            <div key={r.name} className="flex items-center justify-between gap-3 font-sans text-[13px]">
              <span className="min-w-0 flex-1 truncate text-ink-soft">{r.name}</span>
              <span className="font-sans text-[11.5px] text-muted-soft">{r.unitsSold} sold</span>
              <span className="w-20 text-right font-semibold text-ink">{formatMoney(r.revenue)}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="font-sans text-[13px] text-muted">No sales in this range.</p>
      )}
    </div>
  );
}
