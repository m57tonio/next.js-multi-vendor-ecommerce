import type { OrderStatus, PaymentStatus } from "@prisma/client";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { deriveOrderStatus } from "@/lib/shop/tracking";
import {
  bucketIndex,
  bucketLabels,
  LOW_STOCK_THRESHOLD,
  PLATFORM_COMMISSION_RATE,
  type ReportRange,
} from "@/lib/vendor/reports";

/**
 * Admin (platform-wide) reporting layer — READ-ONLY analytics COMPUTED on read
 * across ALL vendors/orders/products. No scoping, no new tables, no stored
 * aggregates, no mutations. Reuses the vendor reports' date-range + bucketing
 * helpers and the SAME `PLATFORM_COMMISSION_RATE` (single source of truth), so
 * platform commission reconciles exactly with the vendor earnings.
 *
 * Money is Decimal end-to-end (accumulate as Prisma.Decimal, return fixed-2
 * strings); Number() only for chart series (display-only).
 *
 * SCOPE HONESTY: some mock columns describe features this marketplace doesn't
 * have (in-house/own-store sales, deliveryman incentives, wallet payouts). Those
 * are surfaced as explicit TODO/null — never fabricated. Everything returned here
 * is derived from real Order/SubOrder/OrderItem/Product/Vendor data.
 */

const ZERO = new Prisma.Decimal(0);
const D = (v: Prisma.Decimal | string | number | null | undefined) =>
  v == null ? ZERO : new Prisma.Decimal(v);
const money = (d: Prisma.Decimal) => d.toFixed(2);
const toNum = (d: Prisma.Decimal) => Number(d.toFixed(2));

const COMPLETED_STATUSES: OrderStatus[] = ["DELIVERED"];
const CANCELED_STATUSES: OrderStatus[] = ["CANCELED", "RETURNED", "FAILED_TO_DELIVER"];

function emptyStatusRecord(): Record<OrderStatus, number> {
  return {
    PENDING: 0,
    CONFIRMED: 0,
    PACKAGING: 0,
    OUT_FOR_DELIVERY: 0,
    DELIVERED: 0,
    CANCELED: 0,
    RETURNED: 0,
    FAILED_TO_DELIVER: 0,
  };
}

type ChartSeries = { labels: string[]; data: number[]; label: string; money: boolean };

const rangeWhere = (range: ReportRange) => ({ gte: range.from, lt: range.to });

// ===========================================================================
// EARNINGS — platform commission (sale × rate) across all vendors
// ===========================================================================

export type AdminEarningVendorRow = {
  vendorId: string;
  storeName: string;
  orders: number; // sub-orders for this vendor in range
  grossSales: string; // Σ sub.total
  commission: string; // platform's cut
  vendorEarning: string; // gross − commission
};

export type AdminEarnings = {
  range: ReportRange;
  commissionRatePct: number;
  summary: {
    grossSales: string; // Σ sub.total across all vendors (merchandise value)
    platformCommission: string; // Σ (sub.total × rate) — the platform's earning
    vendorEarnings: string; // gross − commission
    completedPayments: string; // Σ order.grandTotal where PAID
    shippingCollected: string; // Σ order.shipping (order-level, counted once)
    taxCollected: string; // Σ order.tax
    discountGiven: string; // Σ order.discount
    totalOrders: number;
    totalVendors: number; // "shops"
    totalProducts: number;
  };
  chart: ChartSeries; // platform commission over time
  paymentSplit: { paid: string; unpaid: string }; // for the donut
  byVendor: AdminEarningVendorRow[]; // commission breakdown per vendor
  /** Marketplace has no in-house store or deliveryman program — labeled, not faked. */
  todo: { inHouseEarning: null; deliverymanIncentive: null; walletPayouts: string };
};

export async function getAdminEarnings(range: ReportRange): Promise<AdminEarnings> {
  const orderRange = { order: { createdAt: rangeWhere(range) } };

  const [subs, byVendorGroup, orderAgg, paidAgg, totalVendors, totalProducts] = await Promise.all([
    prisma.subOrder.findMany({
      where: orderRange,
      select: { total: true, order: { select: { createdAt: true } } },
    }),
    prisma.subOrder.groupBy({
      by: ["vendorId"],
      where: orderRange,
      _sum: { total: true },
      _count: { _all: true },
    }),
    prisma.order.aggregate({
      where: { createdAt: rangeWhere(range) },
      _sum: { grandTotal: true, shipping: true, tax: true, discount: true },
      _count: { _all: true },
    }),
    prisma.order.aggregate({
      where: { createdAt: rangeWhere(range), paymentStatus: "PAID" },
      _sum: { grandTotal: true },
    }),
    prisma.vendor.count(),
    prisma.product.count(),
  ]);

  // Gross + commission + time series from sub-orders.
  let grossSales = ZERO;
  const labels = bucketLabels(range);
  const series = new Array(labels.length).fill(0);
  for (const s of subs) {
    const total = D(s.total);
    grossSales = grossSales.add(total);
    const bi = bucketIndex(range, s.order.createdAt, labels.length);
    if (bi >= 0) series[bi] += toNum(total.mul(PLATFORM_COMMISSION_RATE));
  }
  const platformCommission = grossSales.mul(PLATFORM_COMMISSION_RATE);
  const vendorEarnings = grossSales.sub(platformCommission);

  // Per-vendor breakdown (names in a second scoped query).
  const vendorIds = byVendorGroup.map((g) => g.vendorId);
  const vendors = vendorIds.length
    ? await prisma.vendor.findMany({
        where: { id: { in: vendorIds } },
        select: { id: true, storeName: true },
      })
    : [];
  const nameById = new Map(vendors.map((v) => [v.id, v.storeName]));
  const byVendor: AdminEarningVendorRow[] = byVendorGroup
    .map((g) => {
      const gross = D(g._sum.total);
      const commission = gross.mul(PLATFORM_COMMISSION_RATE);
      return {
        vendorId: g.vendorId,
        storeName: nameById.get(g.vendorId) ?? "Unknown store",
        orders: g._count._all,
        grossSales: money(gross),
        commission: money(commission),
        vendorEarning: money(gross.sub(commission)),
      };
    })
    .sort((a, b) => Number(b.commission) - Number(a.commission));

  const completedPayments = D(paidAgg._sum.grandTotal);
  const grandTotalAll = D(orderAgg._sum.grandTotal);

  return {
    range,
    commissionRatePct: toNum(PLATFORM_COMMISSION_RATE.mul(100)),
    summary: {
      grossSales: money(grossSales),
      platformCommission: money(platformCommission),
      vendorEarnings: money(vendorEarnings),
      completedPayments: money(completedPayments),
      shippingCollected: money(D(orderAgg._sum.shipping)),
      taxCollected: money(D(orderAgg._sum.tax)),
      discountGiven: money(D(orderAgg._sum.discount)),
      totalOrders: orderAgg._count._all,
      totalVendors,
      totalProducts,
    },
    chart: { labels, data: series, label: "Commission", money: true },
    paymentSplit: {
      paid: money(completedPayments),
      unpaid: money(grandTotalAll.sub(completedPayments)),
    },
    byVendor,
    todo: {
      inHouseEarning: null,
      deliverymanIncentive: null,
      walletPayouts:
        "Vendor wallet payouts / withdrawals aren't built yet (payment is COD, settled per sub-order on delivery). Commission owed is shown above; a payout ledger appears here once the wallet flow exists.",
    },
  };
}

// ===========================================================================
// ORDER REPORT — all orders across all vendors
// ===========================================================================

export type AdminOrderReportRow = {
  orderNumber: string;
  createdAt: Date;
  customerName: string;
  storeNames: string[];
  grandTotal: string;
  discount: string;
  shipping: string;
  paymentStatus: PaymentStatus;
  status: OrderStatus; // derived from sub-orders
};

export type AdminOrderReport = {
  range: ReportRange;
  summary: {
    totalOrders: number;
    completed: number;
    ongoing: number;
    canceled: number;
    byStatus: Record<OrderStatus, number>;
    totalSales: string;
    avgOrderValue: string;
    completedPayments: string;
  };
  chart: ChartSeries; // orders per time-bucket
  rows: AdminOrderReportRow[];
};

export async function getAdminOrderReport(range: ReportRange): Promise<AdminOrderReport> {
  const orders = await prisma.order.findMany({
    where: { createdAt: rangeWhere(range) },
    orderBy: { createdAt: "desc" },
    select: {
      orderNumber: true,
      createdAt: true,
      grandTotal: true,
      discount: true,
      shipping: true,
      paymentStatus: true,
      shipName: true,
      customer: { select: { name: true } },
      subOrders: { select: { status: true, vendor: { select: { storeName: true } } } },
    },
  });

  const byStatus = emptyStatusRecord();
  let totalSales = ZERO;
  let completedPayments = ZERO;
  const labels = bucketLabels(range);
  const series = new Array(labels.length).fill(0);

  const rows: AdminOrderReportRow[] = orders.map((o) => {
    const status = deriveOrderStatus(o.subOrders.map((s) => s.status));
    byStatus[status] += 1;
    const total = D(o.grandTotal);
    totalSales = totalSales.add(total);
    if (o.paymentStatus === "PAID") completedPayments = completedPayments.add(total);
    const bi = bucketIndex(range, o.createdAt, labels.length);
    if (bi >= 0) series[bi] += 1;
    return {
      orderNumber: o.orderNumber,
      createdAt: o.createdAt,
      customerName: o.customer?.name ?? o.shipName,
      storeNames: [...new Set(o.subOrders.map((s) => s.vendor.storeName))],
      grandTotal: money(total),
      discount: money(D(o.discount)),
      shipping: money(D(o.shipping)),
      paymentStatus: o.paymentStatus,
      status,
    };
  });

  const totalOrders = orders.length;
  const completed = COMPLETED_STATUSES.reduce((n, st) => n + byStatus[st], 0);
  const canceled = CANCELED_STATUSES.reduce((n, st) => n + byStatus[st], 0);
  const avg = totalOrders > 0 ? totalSales.div(totalOrders) : ZERO;

  return {
    range,
    summary: {
      totalOrders,
      completed,
      ongoing: totalOrders - completed - canceled,
      canceled,
      byStatus,
      totalSales: money(totalSales),
      avgOrderValue: money(avg),
      completedPayments: money(completedPayments),
    },
    chart: { labels, data: series, label: "Orders", money: false },
    rows,
  };
}

// ===========================================================================
// PRODUCT REPORT — top products platform-wide + by-vendor / by-category
// ===========================================================================

export type AdminProductReportRow = {
  sl: number;
  productId: string;
  name: string;
  slug: string;
  sellerName: string;
  categoryName: string;
  unitPrice: string;
  unitsSold: number;
  revenue: string;
  avgValue: string;
  stock: number;
};

export type AdminBreakdownRow = { name: string; revenue: string; unitsSold: number };

export type AdminProductReport = {
  range: ReportRange;
  summary: {
    totalProducts: number;
    totalUnitsSold: number;
    totalRevenue: string;
    totalDiscountGiven: string;
  };
  chart: ChartSeries; // units sold per time-bucket
  rows: AdminProductReportRow[];
  byVendor: AdminBreakdownRow[];
  byCategory: AdminBreakdownRow[];
};

export async function getAdminProductReport(range: ReportRange): Promise<AdminProductReport> {
  const itemRange = { subOrder: { order: { createdAt: rangeWhere(range) } } };

  const [sales, soldItems, discountAgg, totalProducts] = await Promise.all([
    prisma.orderItem.groupBy({
      by: ["productId"],
      where: itemRange,
      _sum: { qty: true, lineTotal: true },
    }),
    prisma.orderItem.findMany({
      where: itemRange,
      select: { qty: true, createdAt: true },
    }),
    prisma.subOrder.aggregate({
      where: { order: { createdAt: rangeWhere(range) } },
      _sum: { discount: true },
    }),
    prisma.product.count(),
  ]);

  const soldIds = sales.map((s) => s.productId);
  const products = soldIds.length
    ? await prisma.product.findMany({
        where: { id: { in: soldIds } },
        select: {
          id: true,
          name: true,
          slug: true,
          price: true,
          stock: true,
          vendor: { select: { storeName: true } },
          category: { select: { name: true } },
          variations: { select: { stock: true } },
        },
      })
    : [];
  const productById = new Map(products.map((p) => [p.id, p]));

  let totalUnitsSold = 0;
  let totalRevenue = ZERO;
  const vendorAgg = new Map<string, { revenue: Prisma.Decimal; units: number }>();
  const categoryAgg = new Map<string, { revenue: Prisma.Decimal; units: number }>();

  const unsorted = sales.map((s) => {
    const p = productById.get(s.productId);
    const unitsSold = s._sum.qty ?? 0;
    const revenue = D(s._sum.lineTotal);
    totalUnitsSold += unitsSold;
    totalRevenue = totalRevenue.add(revenue);

    const sellerName = p?.vendor.storeName ?? "Unknown store";
    const categoryName = p?.category.name ?? "Uncategorized";
    const v = vendorAgg.get(sellerName) ?? { revenue: ZERO, units: 0 };
    vendorAgg.set(sellerName, { revenue: v.revenue.add(revenue), units: v.units + unitsSold });
    const c = categoryAgg.get(categoryName) ?? { revenue: ZERO, units: 0 };
    categoryAgg.set(categoryName, { revenue: c.revenue.add(revenue), units: c.units + unitsSold });

    const stock = p
      ? p.variations.length > 0
        ? p.variations.reduce((n, x) => n + x.stock, 0)
        : p.stock
      : 0;
    const avg = unitsSold > 0 ? revenue.div(unitsSold) : ZERO;

    return {
      productId: s.productId,
      name: p?.name ?? "Deleted product",
      slug: p?.slug ?? "",
      sellerName,
      categoryName,
      unitPrice: money(D(p?.price)),
      unitsSold,
      revenue,
      avgValue: money(avg),
      stock,
    };
  });

  unsorted.sort((a, b) => b.revenue.comparedTo(a.revenue) || b.unitsSold - a.unitsSold);
  const rows: AdminProductReportRow[] = unsorted.map((r, i) => ({
    sl: i + 1,
    productId: r.productId,
    name: r.name,
    slug: r.slug,
    sellerName: r.sellerName,
    categoryName: r.categoryName,
    unitPrice: r.unitPrice,
    unitsSold: r.unitsSold,
    revenue: money(r.revenue),
    avgValue: r.avgValue,
    stock: r.stock,
  }));

  const toBreakdown = (m: Map<string, { revenue: Prisma.Decimal; units: number }>): AdminBreakdownRow[] =>
    [...m.entries()]
      .map(([name, v]) => ({ name, revenue: money(v.revenue), unitsSold: v.units }))
      .sort((a, b) => Number(b.revenue) - Number(a.revenue));

  const labels = bucketLabels(range);
  const series = new Array(labels.length).fill(0);
  for (const it of soldItems) {
    const bi = bucketIndex(range, it.createdAt, labels.length);
    if (bi >= 0) series[bi] += it.qty;
  }

  return {
    range,
    summary: {
      totalProducts,
      totalUnitsSold,
      totalRevenue: money(totalRevenue),
      totalDiscountGiven: money(D(discountAgg._sum.discount)),
    },
    chart: { labels, data: series, label: "Units Sold", money: false },
    rows,
    byVendor: toBreakdown(vendorAgg),
    byCategory: toBreakdown(categoryAgg),
  };
}

// ===========================================================================
// STOCK REPORT — live inventory across all vendors (current state, no range)
// ===========================================================================

export type StockStatus = "IN_STOCK" | "SOON_OUT" | "OUT_OF_STOCK";

/** Design thresholds: 0 → Out of Stock, 1..9 → Soon Stock Out, ≥10 → In-Stock. */
export function stockStatusOf(qty: number): StockStatus {
  if (qty <= 0) return "OUT_OF_STOCK";
  if (qty < LOW_STOCK_THRESHOLD) return "SOON_OUT";
  return "IN_STOCK";
}

const STOCK_STATUS_BY_SLUG: Record<string, StockStatus> = {
  "in-stock": "IN_STOCK",
  "soon-out": "SOON_OUT",
  "out-of-stock": "OUT_OF_STOCK",
};
export function stockStatusFromSlug(slug?: string): StockStatus | undefined {
  return slug ? STOCK_STATUS_BY_SLUG[slug] : undefined;
}

export const ADMIN_STOCK_PAGE_SIZE = 12;

export type AdminStockRow = {
  productId: string;
  name: string;
  slug: string;
  sellerName: string;
  categoryName: string;
  stock: number;
  updatedAt: Date;
  status: StockStatus;
};

export type AdminStockReport = {
  rows: AdminStockRow[];
  total: number;
  page: number;
  totalPages: number;
  summary: { all: number; inStock: number; soonOut: number; outOfStock: number };
  vendors: { id: string; storeName: string }[]; // for the vendor filter
  status?: StockStatus;
};

/**
 * Live inventory across all vendors. Vendor/search filters run in SQL; stock
 * status is variation-aware (Σ variation stock), so status filtering + sorting +
 * pagination happen in memory over the filtered set. Summary counts reflect the
 * vendor/search scope (before the status filter).
 */
export async function getAdminStockReport(
  opts: { statusSlug?: string; vendorId?: string; search?: string; sort?: string; page?: number } = {},
): Promise<AdminStockReport> {
  const page = Math.max(1, opts.page ?? 1);
  const status = stockStatusFromSlug(opts.statusSlug);
  const q = opts.search?.trim();
  const sortLowToHigh = opts.sort !== "high-to-low"; // default low→high (surfaces risk first)

  const where: Prisma.ProductWhereInput = {
    ...(opts.vendorId ? { vendorId: opts.vendorId } : {}),
    ...(q ? { name: { contains: q } } : {}),
  };

  const [products, vendors] = await Promise.all([
    prisma.product.findMany({
      where,
      select: {
        id: true,
        name: true,
        slug: true,
        stock: true,
        updatedAt: true,
        vendor: { select: { storeName: true } },
        category: { select: { name: true } },
        variations: { select: { stock: true } },
      },
    }),
    prisma.vendor.findMany({ orderBy: { storeName: "asc" }, select: { id: true, storeName: true } }),
  ]);

  const all: AdminStockRow[] = products.map((p) => {
    const stock = p.variations.length > 0 ? p.variations.reduce((n, v) => n + v.stock, 0) : p.stock;
    return {
      productId: p.id,
      name: p.name,
      slug: p.slug,
      sellerName: p.vendor.storeName,
      categoryName: p.category.name,
      stock,
      updatedAt: p.updatedAt,
      status: stockStatusOf(stock),
    };
  });

  const summary = {
    all: all.length,
    inStock: all.filter((r) => r.status === "IN_STOCK").length,
    soonOut: all.filter((r) => r.status === "SOON_OUT").length,
    outOfStock: all.filter((r) => r.status === "OUT_OF_STOCK").length,
  };

  const filtered = status ? all.filter((r) => r.status === status) : all;
  filtered.sort((a, b) => (sortLowToHigh ? a.stock - b.stock : b.stock - a.stock));

  const total = filtered.length;
  const rows = filtered.slice((page - 1) * ADMIN_STOCK_PAGE_SIZE, page * ADMIN_STOCK_PAGE_SIZE);

  return {
    rows,
    total,
    page,
    totalPages: Math.max(1, Math.ceil(total / ADMIN_STOCK_PAGE_SIZE)),
    summary,
    vendors,
    status,
  };
}
