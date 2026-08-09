"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { PaymentMethod, PaymentStatus } from "@prisma/client";
import { Icon } from "@/components/dashboard/Icon";
import { getOrderPaymentStatus } from "@/app/(shop)/order/confirmation/[orderNumber]/actions";

/**
 * Payment method + status on the confirmation screen. For a Stripe order that is
 * still UNPAID (the verified webhook hasn't landed yet), it shows a "Confirming
 * payment…" state and POLLS the server until PAID — it never marks paid itself.
 * COD renders exactly as before (Cash on Delivery · Unpaid).
 */
export function PaymentStatusBlock({
  orderNumber,
  method,
  initialStatus,
}: {
  orderNumber: string;
  method: PaymentMethod;
  initialStatus: PaymentStatus;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<PaymentStatus>(initialStatus);
  const confirming = method === "STRIPE" && status === "UNPAID";

  useEffect(() => {
    if (!confirming) return;
    let alive = true;
    let tries = 0;
    const id = window.setInterval(async () => {
      tries += 1;
      const next = await getOrderPaymentStatus(orderNumber);
      if (!alive) return;
      if (next && next !== "UNPAID") {
        setStatus(next);
        router.refresh(); // re-read server data now that payment resolved
        window.clearInterval(id);
      }
      if (tries >= 45) window.clearInterval(id); // give up after ~90s of polling
    }, 2000);
    return () => {
      alive = false;
      window.clearInterval(id);
    };
  }, [confirming, orderNumber, router]);

  const label = method === "STRIPE" ? "Card (Stripe)" : "Cash on Delivery";
  const icon = method === "STRIPE" ? "card" : "cash";

  return (
    <div className="flex items-center justify-between rounded-xl bg-field px-4 py-3">
      <span className="flex items-center gap-2 font-sans text-[13px] font-medium text-ink-soft">
        <Icon name={icon} size={16} strokeWidth={1.9} className="text-iris-500" />
        {label}
      </span>
      {status === "PAID" ? (
        <span className="rounded-full bg-success-bg px-2.5 py-1 font-sans text-[11px] font-semibold text-success">
          Paid
        </span>
      ) : confirming ? (
        <span className="flex items-center gap-1.5 rounded-full bg-iris-50 px-2.5 py-1 font-sans text-[11px] font-semibold text-iris-600">
          <span className="size-1.5 animate-pulse rounded-full bg-iris-500" />
          Confirming payment…
        </span>
      ) : (
        <span className="rounded-full bg-warning-bg px-2.5 py-1 font-sans text-[11px] font-semibold text-warning">
          Unpaid
        </span>
      )}
    </div>
  );
}
