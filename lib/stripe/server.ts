import "server-only";
import Stripe from "stripe";

// ─────────────────────────────────────────────────────────────────────────────
// Single server-side Stripe client. Uses STRIPE_SECRET_KEY, which is SERVER-ONLY:
// `import "server-only"` makes this module a build error if it's ever pulled into
// a client component, so the secret can never reach the browser bundle.
// ─────────────────────────────────────────────────────────────────────────────

const secretKey = process.env.STRIPE_SECRET_KEY;
if (!secretKey) {
  // Fail loudly on the server if the key is missing — never silently fall back.
  throw new Error("STRIPE_SECRET_KEY is not set. Add it to .env (see Part 1 setup).");
}

export const stripe = new Stripe(secretKey, {
  // Pin to the SDK's bundled API version for reproducible behaviour.
  apiVersion: Stripe.API_VERSION,
  typescript: true,
  appInfo: { name: "Covet Marketplace" },
});
