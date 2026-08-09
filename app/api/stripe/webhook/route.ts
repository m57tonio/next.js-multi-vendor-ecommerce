import { stripe } from "@/lib/stripe/server";
import { finalizeFromPaymentIntent } from "@/lib/stripe/finalize";

// Node runtime — Stripe signature verification needs the RAW request body + node
// crypto (not the edge runtime).
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Stripe webhook — the primary source of truth for marking an order PAID (a
 * server-side verification on the confirmation page complements it for local dev).
 * An order becomes PAID ONLY after the Stripe SIGNATURE is verified — never from the
 * browser's redirect. Stock + coupons were already reserved at order placement, so
 * this only flips the payment status. Handlers are IDEMPOTENT and return 200 fast.
 */
export async function POST(req: Request) {
  const signature = req.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!signature || !secret) {
    return new Response("Missing signature or webhook secret", { status: 400 });
  }

  // Verify the signature against the RAW body — rejects unsigned/forged calls.
  const rawBody = await req.text();
  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, secret);
  } catch {
    return new Response("Invalid signature", { status: 400 });
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded":
        await finalizeFromPaymentIntent(event.data.object);
        break;
      case "payment_intent.payment_failed":
        // Leave the order UNPAID (it already is) — the shopper retries client-side.
        break;
      default:
        break;
    }
  } catch (e) {
    // 5xx so Stripe RETRIES; the handler is idempotent so retries are safe.
    console.error("Stripe webhook handler error:", e);
    return new Response("Handler error", { status: 500 });
  }

  return new Response("ok", { status: 200 });
}
