import { loadStripe, type Stripe } from "@stripe/stripe-js";

// Client-side Stripe loader. Uses only the PUBLISHABLE key (NEXT_PUBLIC_…), which
// is safe to expose to the browser by design. The secret key lives server-side
// only (lib/stripe/server.ts) and never reaches here. Memoized so Stripe.js loads
// once per page session.
let stripePromise: Promise<Stripe | null> | null = null;

export function getStripe(): Promise<Stripe | null> {
  if (!stripePromise) {
    const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    stripePromise = key ? loadStripe(key) : Promise.resolve(null);
  }
  return stripePromise;
}
