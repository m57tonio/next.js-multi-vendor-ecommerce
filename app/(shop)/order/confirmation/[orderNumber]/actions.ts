"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import type { PaymentStatus } from "@prisma/client";

/**
 * The signed-in customer's payment status for one of THEIR orders. Scoped by
 * customerId (no existence leak). Used by the confirmation page to poll while a
 * Stripe payment is being confirmed by the webhook — the page NEVER marks paid
 * itself; it only reads what the verified webhook has written.
 */
export async function getOrderPaymentStatus(orderNumber: string): Promise<PaymentStatus | null> {
  const session = await auth();
  if (!session?.user?.id) return null;
  const order = await prisma.order.findFirst({
    where: { orderNumber, customerId: session.user.id },
    select: { paymentStatus: true },
  });
  return order?.paymentStatus ?? null;
}
