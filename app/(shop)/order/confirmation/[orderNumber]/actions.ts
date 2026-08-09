"use server";

import { auth } from "@/auth";
import type { PaymentStatus } from "@prisma/client";
import { syncStripeOrderPayment } from "@/lib/stripe/finalize";

/**
 * The signed-in customer's payment status for one of THEIR orders. For a Stripe
 * order still UNPAID it re-verifies with Stripe server-side (never trusting the
 * browser) and marks PAID if the PaymentIntent succeeded — so the confirmation
 * page's "Confirming payment…" poll resolves even without a delivered webhook.
 * Scoped by customerId (no existence leak).
 */
export async function getOrderPaymentStatus(orderNumber: string): Promise<PaymentStatus | null> {
  const session = await auth();
  if (!session?.user?.id) return null;
  return syncStripeOrderPayment(orderNumber, session.user.id);
}
