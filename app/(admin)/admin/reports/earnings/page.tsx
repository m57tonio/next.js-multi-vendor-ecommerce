import type { Metadata } from "next";
import Link from "next/link";
import { requireRole } from "@/lib/guard";
import { formatMoney } from "@/lib/shop/pricing";
import { Icon } from "@/components/dashboard/Icon";
import { AreaChart, DonutChart, CHART } from "@/components/dashboard/Charts";
import { getAdminEarnings } from "@/lib/admin/reports";
import { parseReportRange } from "@/lib/vendor/reports";
import { ReportRangeFilter } from "@/components/vendor-reports/ReportRangeFilter";
import { ReportExportButton } from "@/components/vendor-reports/ReportExportButton";

export const metadata: Metadata = { title: "Earnings Report — Covet Admin" };
export const dynamic = "force-dynamic";

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
const ROW = "grid grid-cols-[50px_1.6fr_90px_1fr_1fr_1fr] items-center gap-3";

export default async function AdminEarningsReportPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  await requireRole("ADMIN", "/admin/login");

  const sp = await searchParams;
  const range = parseReportRange({ range: one(sp.range) });
  const view = one(sp.view) === "vendor" ? "vendor" : "admin";
  const report = await getAdminEarnings(range);
  const { summary, chart, paymentSplit, byVendor } = report;

  // Admin tab = the platform's commission; Vendor tab = payouts owed to sellers.
  const isAdmin = view === "admin";
  const rateFraction = report.commissionRatePct / 100;
  const vendorSeries = chart.data.map(
    (c) => Math.round((c * (1 - rateFraction)) / rateFraction * 100) / 100,
  );
  const headline = isAdmin
    ? { label: "Platform Commission", value: summary.platformCommission, data: chart.data, series: "Commission" }
    : { label: "Vendor Payouts Owed", value: summary.vendorEarnings, data: vendorSeries, series: "Vendor earnings" };

  const tabHref = (v: "admin" | "vendor") => {
    const params = new URLSearchParams();
    if (range.preset !== "this-year") params.set("range", range.preset);
    if (v === "vendor") params.set("view", "vendor");
    const qs = params.toString();
    return qs ? `/admin/reports/earnings?${qs}` : "/admin/reports/earnings";
  };

  const exportRows = byVendor.map((v, i) => [
    i + 1,
    v.storeName,
    v.orders,
    v.grossSales,
    v.commission,
    v.vendorEarning,
  ]);

  const split = [
    { label: "Commission", value: summary.platformCommission, cls: "text-error" },
    { label: "Vendor", value: summary.vendorEarnings, cls: "text-iris-500" },
    { label: "Shipping", value: summary.shippingCollected, cls: "text-success" },
  ];
  const donutSegments = [
    { label: "Paid", value: Number(paymentSplit.paid), color: CHART.green },
    { label: "Unpaid", value: Number(paymentSplit.unpaid), color: CHART.amber },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-[22px] flex items-center gap-3">
        <span className="flex size-9 items-center justify-center rounded-[10px] bg-iris-50 text-iris-500">
          <Icon name="wallet" size={19} strokeWidth={1.9} />
        </span>
        <div>
          <h1 className="font-display text-[22px] font-bold tracking-[-0.01em] text-ink">Earning Reports</h1>
          <p className="mt-1 font-sans text-[13px] text-muted">
            {range.label} · platform commission across all vendors
          </p>
        </div>
      </div>

      {/* Admin / Vendor tabs */}
      <div className="mb-[22px] flex gap-3">
        {(["admin", "vendor"] as const).map((v) => (
          <Link
            key={v}
            href={tabHref(v)}
            className={`flex h-11 items-center rounded-full px-6 font-sans text-sm transition-colors ${
              view === v ? "bg-iris-500 font-semibold text-white" : "font-medium text-muted hover:text-ink"
            }`}
          >
            {v === "admin" ? "Admin Earning" : "Vendor Earning"}
          </Link>
        ))}
      </div>

      <ReportRangeFilter />

      {/* Stats row */}
      <div className="mb-[22px] grid grid-cols-1 items-start gap-[22px] lg:grid-cols-[300px_1fr_300px]">
        {/* Left: totals */}
        <div className="flex flex-col gap-[22px]">
          <div className="rounded-[18px] border border-line-soft bg-surface p-6 shadow-xs">
            <div className="mb-[18px] flex items-center gap-3.5">
              <span className="flex size-[52px] items-center justify-center rounded-[14px] bg-iris-50 text-iris-500">
                <Icon name="coins" size={26} strokeWidth={1.8} />
              </span>
              <div>
                <div className="font-display text-[24px] font-extrabold leading-none text-ink">
                  {formatMoney(summary.grossSales)}
                </div>
                <div className="mt-1.5 font-sans text-[12.5px] font-medium text-muted">Gross Sales</div>
              </div>
            </div>
            <div className="flex justify-between border-t border-line-soft pt-4 text-center">
              {split.map((s) => (
                <div key={s.label}>
                  <div className={`font-display text-[15px] font-extrabold ${s.cls}`}>{formatMoney(s.value)}</div>
                  <div className="mt-1.5 font-sans text-[11px] text-muted">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <StatCard icon="store" tone="amber" value={String(summary.totalVendors)} label="Total Shops" />
          <StatCard icon="box" tone="green" value={String(summary.totalProducts)} label="Total Products" />
        </div>

        {/* Middle: earnings chart */}
        <div className="rounded-[18px] border border-line-soft bg-surface p-6 shadow-xs">
          <div className="mb-1 flex items-center justify-between">
            <div className="font-display text-[17px] font-bold text-ink">Earning Statistics</div>
            <div className="text-right">
              <div className="font-display text-[18px] font-extrabold text-ink">{formatMoney(headline.value)}</div>
              <div className="font-sans text-[11px] text-muted">{headline.label}</div>
            </div>
          </div>
          <AreaChart
            labels={chart.labels}
            series={[{ label: headline.series, color: CHART.iris, data: headline.data }]}
            height={340}
            yPrefix="$"
          />
        </div>

        {/* Right: payment donut */}
        <div className="rounded-[18px] border border-line-soft bg-surface p-6 shadow-xs">
          <div className="mb-4 text-center font-display text-base font-bold text-ink">Payment Statistics</div>
          <div className="relative mx-auto mb-4 flex h-[170px] w-[170px] items-center justify-center">
            <DonutChart segments={donutSegments} size={170} thickness={20} />
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <div className="font-display text-[18px] font-extrabold text-ink">
                {formatMoney(paymentSplit.paid)}
              </div>
              <div className="mt-1 font-sans text-[10.5px] text-muted">Payments</div>
            </div>
          </div>
          <div className="flex flex-col gap-2.5">
            {donutSegments.map((s) => (
              <div key={s.label} className="flex items-center gap-2.5 font-sans text-[12.5px] text-ink-soft">
                <span className="size-2.5 flex-none rounded-full" style={{ background: s.color }} />
                <span className="flex-1">{s.label}</span>
                <span className="font-semibold text-ink">{formatMoney(String(s.value))}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Payout TODO */}
      <div className="mb-[22px] flex items-start gap-3 rounded-[14px] border border-warning-bg bg-warning-bg/40 p-4">
        <Icon name="wallet" size={17} strokeWidth={2} className="mt-0.5 flex-none text-warning" />
        <div>
          <div className="font-sans text-[13px] font-semibold text-ink">
            Vendor payouts owed: {formatMoney(summary.vendorEarnings)}
          </div>
          <p className="mt-1 font-sans text-[12px] leading-[1.5] text-muted">{report.todo.walletPayouts}</p>
        </div>
      </div>

      {/* By-vendor table */}
      <div className="rounded-[18px] border border-line-soft bg-surface p-6 shadow-xs">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3.5">
          <div className="flex items-center gap-2.5">
            <span className="font-display text-[17px] font-bold text-ink">Earnings by Vendor</span>
            <span className="flex h-6 min-w-[26px] items-center justify-center rounded-full bg-line-soft px-2.5 font-display text-[12px] font-bold text-ink-soft">
              {byVendor.length}
            </span>
          </div>
          <ReportExportButton
            filename={`admin-earnings-${range.preset}.csv`}
            headers={["SL", "Store", "Orders", "Gross Sales", "Commission", "Vendor Earning"]}
            rows={exportRows}
          />
        </div>

        {byVendor.length > 0 ? (
          <>
            <div className="overflow-x-auto rounded-[14px] border border-line-soft">
              <div className="min-w-[820px]">
                <div className={`${ROW} bg-field px-[18px] py-3.5 font-sans text-[11px] font-semibold uppercase tracking-[0.04em] text-muted`}>
                  <span>SL</span>
                  <span>Store</span>
                  <span>Orders</span>
                  <span>Gross Sales</span>
                  <span>Commission</span>
                  <span>Vendor Earning</span>
                </div>
                {byVendor.map((v, i) => (
                  <div
                    key={v.vendorId}
                    className={`${ROW} border-t border-line-soft px-[18px] py-3.5 font-sans text-[13px] text-ink-soft transition-colors hover:bg-bg-subtle`}
                  >
                    <span className="text-muted-soft">{i + 1}</span>
                    <span className="truncate font-semibold text-ink">{v.storeName}</span>
                    <span>{v.orders}</span>
                    <span>{formatMoney(v.grossSales)}</span>
                    <span className="font-semibold text-error">−{formatMoney(v.commission)}</span>
                    <span className="font-semibold text-success">{formatMoney(v.vendorEarning)}</span>
                  </div>
                ))}
              </div>
            </div>
            <p className="mt-4 font-sans text-[11.5px] leading-[1.5] text-muted-soft">
              Commission is the platform fee ({report.commissionRatePct}% of each vendor&apos;s sales). In-house
              earning and deliveryman incentives aren&apos;t part of this marketplace, so those mock columns are
              omitted rather than shown as zero.
            </p>
          </>
        ) : (
          <div className="flex flex-col items-center px-8 py-16 text-center">
            <span className="mb-5 flex size-[78px] items-center justify-center rounded-[22px] bg-iris-50 text-iris-400">
              <Icon name="coins" size={34} strokeWidth={1.6} />
            </span>
            <div className="font-display text-[19px] font-bold text-ink">No earnings in this range</div>
            <p className="mx-auto mt-2.5 max-w-[360px] font-sans text-sm leading-[1.5] text-muted">
              No orders were placed across the marketplace during {range.label.toLowerCase()}. Try a wider date
              range.
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
  icon: "store" | "box";
  tone: "amber" | "green";
  value: string;
  label: string;
}) {
  const cls = tone === "amber" ? "bg-warning-bg text-warning" : "bg-success-bg text-success";
  return (
    <div className="flex items-center gap-3.5 rounded-[18px] border border-line-soft bg-surface p-6 shadow-xs">
      <span className={`flex size-[52px] items-center justify-center rounded-[14px] ${cls}`}>
        <Icon name={icon} size={26} strokeWidth={1.8} />
      </span>
      <div>
        <div className="font-display text-[24px] font-extrabold leading-none text-ink">{value}</div>
        <div className="mt-1.5 font-sans text-[12.5px] font-medium text-muted">{label}</div>
      </div>
    </div>
  );
}
