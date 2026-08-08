import type { Metadata } from "next";
import Link from "next/link";
import { requireRole } from "@/lib/guard";
import { formatMoney } from "@/lib/shop/pricing";
import { Icon } from "@/components/dashboard/Icon";
import { AreaChart, DonutChart, CHART } from "@/components/dashboard/Charts";
import { OrderStatusBadge } from "@/components/dashboard/orders/OrderStatusBadge";
import { getAdminOrderReport } from "@/lib/admin/reports";
import { parseReportRange } from "@/lib/vendor/reports";
import { ReportRangeFilter } from "@/components/vendor-reports/ReportRangeFilter";
import { ReportSearch } from "@/components/vendor-reports/ReportSearch";
import { ReportExportButton } from "@/components/vendor-reports/ReportExportButton";

export const metadata: Metadata = { title: "Order Report — Covet Admin" };
export const dynamic = "force-dynamic";

const DATE_FMT = new Intl.DateTimeFormat("en-US", { day: "2-digit", month: "short", year: "numeric" });
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
const ROW = "grid grid-cols-[46px_120px_130px_1.2fr_1fr_1fr_1fr_1fr_120px] items-center gap-3";

export default async function AdminOrderReportPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  await requireRole("ADMIN", "/admin/login");

  const sp = await searchParams;
  const range = parseReportRange({ range: one(sp.range) });
  const report = await getAdminOrderReport(range);
  const { summary, chart } = report;

  const q = one(sp.q)?.trim().toLowerCase() ?? "";
  const rows = q
    ? report.rows.filter(
        (r) => r.orderNumber.toLowerCase().includes(q) || r.customerName.toLowerCase().includes(q),
      )
    : report.rows;

  const due = (r: (typeof rows)[number]) => (r.paymentStatus === "PAID" ? "0.00" : r.grandTotal);

  const exportRows = rows.map((r, i) => [
    i + 1,
    r.orderNumber,
    DATE_FMT.format(r.createdAt),
    r.customerName,
    r.grandTotal,
    r.discount,
    r.shipping,
    due(r),
    r.paymentStatus,
    r.status,
  ]);

  const split = [
    { label: "Canceled", value: summary.canceled, cls: "text-error" },
    { label: "Ongoing", value: summary.ongoing, cls: "text-warning" },
    { label: "Completed", value: summary.completed, cls: "text-success" },
  ];
  const donutSegments = [
    { label: "Completed", value: summary.completed, color: CHART.green },
    { label: "Ongoing", value: summary.ongoing, color: CHART.amber },
    { label: "Canceled", value: summary.canceled, color: CHART.iris },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-[22px] flex items-center gap-3">
        <span className="flex size-9 items-center justify-center rounded-[10px] bg-iris-50 text-iris-500">
          <Icon name="chart" size={19} strokeWidth={1.9} />
        </span>
        <div>
          <h1 className="font-display text-[22px] font-bold tracking-[-0.01em] text-ink">Order Report</h1>
          <p className="mt-1 font-sans text-[13px] text-muted">
            {range.label} · orders &amp; sales across all vendors
          </p>
        </div>
      </div>

      <ReportRangeFilter />

      {/* Stats row */}
      <div className="mb-[22px] grid grid-cols-1 items-start gap-[22px] lg:grid-cols-[300px_1fr_300px]">
        <div className="flex flex-col gap-[22px]">
          <div className="rounded-[18px] border border-line-soft bg-surface p-6 shadow-xs">
            <div className="mb-5 flex items-center gap-3.5">
              <span className="flex size-12 items-center justify-center rounded-[14px] bg-iris-50 text-iris-500">
                <Icon name="order" size={24} strokeWidth={1.8} />
              </span>
              <div>
                <div className="font-display text-[26px] font-extrabold leading-none text-ink">
                  {summary.totalOrders}
                </div>
                <div className="mt-2 font-sans text-[12.5px] font-medium text-muted">Total Orders</div>
              </div>
            </div>
            <div className="flex justify-between border-t border-line-soft pt-4 text-center">
              {split.map((s) => (
                <div key={s.label}>
                  <div className={`font-display text-base font-extrabold ${s.cls}`}>{s.value}</div>
                  <div className="mt-1.5 font-sans text-[11px] text-muted">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3.5 rounded-[18px] border border-line-soft bg-surface p-6 shadow-xs">
            <span className="flex size-12 items-center justify-center rounded-[14px] bg-warning-bg text-warning">
              <Icon name="wallet" size={24} strokeWidth={1.8} />
            </span>
            <div>
              <div className="font-display text-[24px] font-extrabold leading-none text-ink">
                {formatMoney(summary.totalSales)}
              </div>
              <div className="mt-2 font-sans text-[12.5px] font-medium text-muted">Total Order Amount</div>
            </div>
          </div>
        </div>

        {/* Middle: chart */}
        <div className="rounded-[18px] border border-line-soft bg-surface p-6 shadow-xs">
          <div className="mb-4 font-display text-[17px] font-bold text-ink">Order Statistics</div>
          <AreaChart
            labels={chart.labels}
            series={[{ label: chart.label, color: CHART.iris, data: chart.data }]}
            height={340}
            yPrefix=""
          />
        </div>

        {/* Right: status donut */}
        <div className="rounded-[18px] border border-line-soft bg-surface p-6 shadow-xs">
          <div className="mb-4 text-center font-display text-base font-bold text-ink">Order Statistics</div>
          <div className="relative mx-auto mb-4 flex h-[170px] w-[170px] items-center justify-center">
            <DonutChart segments={donutSegments} size={170} thickness={20} />
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <div className="font-display text-[22px] font-extrabold text-ink">{summary.totalOrders}</div>
              <div className="mt-1 font-sans text-[10.5px] text-muted">Orders</div>
            </div>
          </div>
          <div className="flex flex-col gap-2.5">
            {donutSegments.map((s) => (
              <div key={s.label} className="flex items-center gap-2.5 font-sans text-[12.5px] text-ink-soft">
                <span className="size-2.5 flex-none rounded-full" style={{ background: s.color }} />
                <span className="flex-1">{s.label}</span>
                <span className="font-semibold text-ink">{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-[18px] border border-line-soft bg-surface p-6 shadow-xs">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3.5">
          <div className="flex items-center gap-2.5">
            <span className="font-display text-[17px] font-bold text-ink">Order List</span>
            <span className="flex h-6 min-w-[26px] items-center justify-center rounded-full bg-line-soft px-2.5 font-display text-[12px] font-bold text-ink-soft">
              {rows.length}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <ReportSearch placeholder="Search by order id or customer" />
            <ReportExportButton
              filename={`admin-order-report-${range.preset}.csv`}
              headers={["SL", "Order ID", "Date", "Customer", "Total Amount", "Coupon Discount", "Shipping", "Due", "Payment", "Status"]}
              rows={exportRows}
            />
          </div>
        </div>

        {rows.length > 0 ? (
          <>
            <div className="overflow-x-auto rounded-[14px] border border-line-soft">
              <div className="min-w-[1080px]">
                <div className={`${ROW} bg-field px-[18px] py-3.5 font-sans text-[11px] font-semibold uppercase tracking-[0.04em] text-muted`}>
                  <span>SL</span>
                  <span>Order ID</span>
                  <span>Date</span>
                  <span>Customer</span>
                  <span>Total Amount</span>
                  <span>Coupon Disc.</span>
                  <span>Shipping</span>
                  <span>Due</span>
                  <span>Status</span>
                </div>
                {rows.map((r, i) => (
                  <div
                    key={r.orderNumber}
                    className={`${ROW} border-t border-line-soft px-[18px] py-3.5 font-sans text-[13px] text-ink-soft transition-colors hover:bg-bg-subtle`}
                  >
                    <span className="text-muted-soft">{i + 1}</span>
                    <Link
                      href={`/admin/orders/${r.orderNumber}`}
                      className="font-display text-[13px] font-bold text-iris-500 hover:text-iris-600"
                    >
                      {r.orderNumber}
                    </Link>
                    <span className="text-muted">{DATE_FMT.format(r.createdAt)}</span>
                    <span className="truncate font-medium text-ink">{r.customerName}</span>
                    <span className="font-semibold text-ink">{formatMoney(r.grandTotal)}</span>
                    <span>{formatMoney(r.discount)}</span>
                    <span>{Number(r.shipping) === 0 ? "Free" : formatMoney(r.shipping)}</span>
                    <span className={Number(due(r)) > 0 ? "font-semibold text-warning" : "text-muted-soft"}>
                      {formatMoney(due(r))}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <OrderStatusBadge status={r.status} />
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <p className="mt-4 font-sans text-[11.5px] leading-[1.5] text-muted-soft">
              Due = unpaid grand total (from payment status). Order status is derived from every seller&apos;s
              sub-order (least-advanced). Product-discount and return-amount breakdowns aren&apos;t tracked
              per order, so those mock columns are omitted.
            </p>
          </>
        ) : (
          <div className="flex flex-col items-center px-8 py-16 text-center">
            <span className="mb-5 flex size-[78px] items-center justify-center rounded-[22px] bg-iris-50 text-iris-400">
              <Icon name="order" size={34} strokeWidth={1.6} />
            </span>
            <div className="font-display text-[19px] font-bold text-ink">
              {q ? "No orders match your search" : "No orders in this range"}
            </div>
            <p className="mx-auto mt-2.5 max-w-[360px] font-sans text-sm leading-[1.5] text-muted">
              {q
                ? "Try a different order id or customer, or clear the search."
                : `No orders were placed across the marketplace during ${range.label.toLowerCase()}. Try a wider date range.`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
