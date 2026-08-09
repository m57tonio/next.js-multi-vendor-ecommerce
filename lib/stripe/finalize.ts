import "server-only";
import type Stripe from "stripe";
import type { PaymentStatus } from "@prisma/client";
import { stripe } from "@/lib/stripe/server";
import { prisma } from "@/lib/prisma";

/**
 * Idempotent, race-safe PAID flip (order + its sub-orders). The atomic conditional
 * update on Order is the lock — only the FIRST caller flips it; concurrent/duplicate
 * calls see count 0 and no-op. Returns true only when THIS call did the flip.
 * Stock/coupons are NOT touched here (reserved at order placement, like COD).
 * Shared by the webhook AND the confirmation-page server verification.
 */
export async function markStripeOrderPaid(orderId: string, paymentIntentId: string): Promise<boolean> {
  const flipped = await prisma.order.updateMany({
    where: { id: orderId, paymentStatus: { not: "PAID" } },
    data: { paymentStatus: "PAID", stripePaymentIntentId: paymentIntentId },
  });
  if (flipped.count === 0) return false;
  await prisma.subOrder.updateMany({
    where: { orderId },
    data: { paymentStatus: "PAID", paidAt: new Date() },
  });
  return true;
}

/** WEBHOOK path: given a verified PaymentIntent, find its order and mark it paid. */
export async function finalizeFromPaymentIntent(pi: Stripe.PaymentIntent): Promise<void> {
  const metaOrderId = typeof pi.metadata?.orderId === "string" ? pi.metadata.orderId : null;
  const order = await prisma.order.findFirst({
    where: { OR: [{ stripePaymentIntentId: pi.id }, ...(metaOrderId ? [{ id: metaOrderId }] : [])] },
    select: { id: true },
  });
  if (!order) return; // unknown PaymentIntent — ignore
  await markStripeOrderPaid(order.id, pi.id);
}

/**
 * CONFIRMATION-PAGE path — server-side verification. Re-reads the order's
 * PaymentIntent DIRECTLY from Stripe (authoritative, secret key; the browser's
 * redirect is NEVER trusted) and marks the order PAID only if Stripe itself reports
 * `succeeded`. Idempotent. Complements the webhook so payment resolves even when the
 * webhook isn't delivered (e.g. local dev without `stripe listen`). Scoped to the
 * owning customer, so one shopper can't touch another's order.
 */
export async function syncStripeOrderPayment(
  orderNumber: string,
  customerId: string,
): Promise<PaymentStatus | null> {
  const order = await prisma.order.findFirst({
    where: { orderNumber, customerId },
    select: { id: true, paymentMethod: true, paymentStatus: true, stripePaymentIntentId: true },
  });
  if (!order) return null;
  // Only STRIPE orders still awaiting payment need a Stripe round-trip.
  if (order.paymentStatus !== "UNPAID" || order.paymentMethod !== "STRIPE" || !order.stripePaymentIntentId) {
    return order.paymentStatus;
  }
  try {
    const pi = await stripe.paymentIntents.retrieve(order.stripePaymentIntentId);
    if (pi.status === "succeeded") {
      await markStripeOrderPaid(order.id, pi.id);
      return "PAID";
    }
  } catch {
    // Network/Stripe error — leave UNPAID; the poll/webhook will retry.
  }
  return "UNPAID";
}
