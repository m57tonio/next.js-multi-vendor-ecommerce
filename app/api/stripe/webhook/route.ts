import type Stripe from "stripe";
import { stripe } from "@/lib/stripe/server";
import { prisma } from "@/lib/prisma";

// Node runtime — Stripe signature verification needs the RAW request body + node
// crypto (not the edge runtime).
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Stripe webhook — the SINGLE source of truth for marking an order PAID. An order
 * becomes PAID ONLY here, after the Stripe SIGNATURE is verified — never from the
 * browser's success redirect. Stock + coupon usedCount were already reserved at
 * order placement (reserve-at-order, same as COD), so this handler only flips the
 * payment status; it never re-touches stock/coupons. Handlers are IDEMPOTENT and
 * return 200 quickly.
 */
export async function POST(req: Request) {
  const signature = req.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!signature || !secret) {
    return new Response("Missing signature or webhook secret", { status: 400 });
  }

  // Verify the signature against the RAW body — rejects unsigned/forged calls.
  const rawBody = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, secret);
  } catch {
    return new Response("Invalid signature", { status: 400 });
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded":
        await markOrderPaid(event.data.object);
        break;
      case "payment_intent.payment_failed":
        // Leave the order UNPAID (it already is). Nothing to write — the shopper
        // sees the failure client-side and can retry with the same PaymentIntent.
        break;
      default:
        break; // ignore other event types
    }
  } catch (e) {
    // Return 5xx so Stripe RETRIES; the handler is idempotent so retries are safe.
    console.error("Stripe webhook handler error:", e);
    return new Response("Handler error", { status: 500 });
  }

  return new Response("ok", { status: 200 });
}

/**
 * Mark the order (and its sub-orders) PAID. Idempotent + race-safe: the atomic
 * conditional update on Order is the lock — only the FIRST delivery flips it and
 * proceeds; concurrent/duplicate deliveries see count 0 and no-op.
 */
async function markOrderPaid(pi: Stripe.PaymentIntent): Promise<void> {
  const metaOrderId = typeof pi.metadata?.orderId === "string" ? pi.metadata.orderId : null;

  const order = await prisma.order.findFirst({
    where: {
      OR: [{ stripePaymentIntentId: pi.id }, ...(metaOrderId ? [{ id: metaOrderId }] : [])],
    },
    select: { id: true },
  });
  if (!order) return; // unknown PaymentIntent — ignore

  // Atomic guard: flip UNPAID→PAID exactly once. Also backfills the PI id in case
  // the order was found via metadata.
  const flipped = await prisma.order.updateMany({
    where: { id: order.id, paymentStatus: { not: "PAID" } },
    data: { paymentStatus: "PAID", stripePaymentIntentId: pi.id },
  });
  if (flipped.count === 0) return; // already PAID — idempotent no-op

  // A Stripe order is paid in full up front, so every vendor's slice is paid too
  // (vendor views read SubOrder.paymentStatus).
  await prisma.subOrder.updateMany({
    where: { orderId: order.id },
    data: { paymentStatus: "PAID", paidAt: new Date() },
  });
}
