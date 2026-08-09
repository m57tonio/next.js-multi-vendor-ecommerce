"use client";

import { useEffect, useRef, useState } from "react";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import type { StripeElementsOptions } from "@stripe/stripe-js";
import { Icon } from "@/components/dashboard/Icon";
import { getStripe } from "@/lib/stripe/client";
import { placeOrder } from "@/app/(shop)/checkout/actions";

const stripePromise = getStripe();

// Stripe Elements renders inside a cross-origin iframe and CANNOT read our CSS
// custom properties, so these appearance values MIRROR the DESIGN_SYSTEM tokens
// as literals (iris #6544E0, ink #17151F, error #E5484D). Keep in sync with globals.css.
const appearance: StripeElementsOptions["appearance"] = {
  theme: "stripe",
  variables: {
    colorPrimary: "#6544E0",
    colorText: "#17151F",
    colorDanger: "#E5484D",
    fontFamily: "Instrument Sans, system-ui, sans-serif",
    borderRadius: "11px",
    fontSizeBase: "14px",
  },
};

/** What CheckoutFlow passes so the (in-Elements) confirm can run on "Place Order". */
export type StripeCheckout = {
  /** Returns the placeOrder input (with paymentMethod:"STRIPE") — server re-prices. */
  getOrderInput: () => unknown;
  /** Toggles the parent's placing/processing state. */
  onProcessingChange: (busy: boolean) => void;
  /** The inner form registers its confirm fn here; CheckoutFlow calls it on submit. */
  registerPay: (fn: (() => Promise<void>) | null) => void;
  /** Card confirmed on Stripe's side — navigate to confirmation (webhook marks PAID). */
  onSuccess: (orderNumber: string) => void;
};

/**
 * The Stripe card input + confirm flow, shown when "Card" is selected. Deferred
 * mode: card details are collected before a PaymentIntent exists. On "Place Order"
 * the inner form validates, calls placeOrder(STRIPE) (server creates the UNPAID
 * order + PaymentIntent for the SERVER total), then confirms the card. Payment is
 * marked PAID only by the verified webhook — never here.
 */
export function StripeCardSection({ amountCents, ...checkout }: { amountCents: number } & StripeCheckout) {
  const [error, setError] = useState<string | null>(null);

  const options: StripeElementsOptions = {
    // Deferred mode — collect the card before the PaymentIntent exists. No explicit
    // paymentMethodTypes: the Element auto-detects to match the PaymentIntent's
    // automatic_payment_methods, which the confirmPayment handshake requires.
    mode: "payment",
    amount: Math.max(amountCents, 1),
    currency: "usd",
    appearance,
  };

  return (
    <div className="mt-4 rounded-xl border border-line-soft bg-bg-subtle p-4">
      <Elements stripe={stripePromise} options={options}>
        <StripeInner {...checkout} onError={setError} />
        <PaymentElement options={{ layout: "tabs" }} />
      </Elements>
      {error && (
        <p className="mt-3 flex items-start gap-2 font-sans text-[12.5px] leading-[1.5] text-error">
          <Icon name="alert" size={15} strokeWidth={2} className="mt-0.5 flex-none" />
          {error}
        </p>
      )}
      <p className="mt-3 font-sans text-[12px] leading-[1.5] text-muted">
        Payments are processed securely by Stripe. Your card details never touch Covet&apos;s servers.
      </p>
    </div>
  );
}

function StripeInner({
  getOrderInput,
  onProcessingChange,
  registerPay,
  onSuccess,
  onError,
}: StripeCheckout & { onError: (m: string | null) => void }) {
  const stripe = useStripe();
  const elements = useElements();
  // Cache the created order/PI so a retry after a decline REUSES the same
  // PaymentIntent instead of creating a duplicate order.
  const orderRef = useRef<{ clientSecret: string; orderNumber: string } | null>(null);

  useEffect(() => {
    if (!stripe || !elements) {
      registerPay(null);
      return;
    }
    registerPay(async () => {
      onError(null);
      onProcessingChange(true);
      try {
        // 1) Validate the card fields.
        const submit = await elements.submit();
        if (submit.error) {
          onError(submit.error.message ?? "Please check your card details.");
          return;
        }
        // 2) Create the UNPAID order + PaymentIntent (server total) — once.
        if (!orderRef.current) {
          const res = await placeOrder(getOrderInput());
          if (!res.ok) {
            onError(res.error);
            return;
          }
          if (!res.clientSecret) {
            onError("We couldn't start the card payment. Please try again.");
            return;
          }
          orderRef.current = { clientSecret: res.clientSecret, orderNumber: res.orderNumber };
        }
        // 3) Confirm the card. redirect:"if_required" → non-3DS confirms in place;
        //    3DS cards redirect to return_url. Either way, PAID is set by the webhook.
        const { clientSecret, orderNumber } = orderRef.current;
        const { error } = await stripe.confirmPayment({
          elements,
          clientSecret,
          confirmParams: { return_url: `${window.location.origin}/order/confirmation/${orderNumber}` },
          redirect: "if_required",
        });
        if (error) {
          onError(error.message ?? "Your payment could not be completed.");
          return; // order stays UNPAID; the same PaymentIntent can be retried
        }
        onSuccess(orderNumber);
      } finally {
        onProcessingChange(false);
      }
    });
    return () => registerPay(null);
  }, [stripe, elements, getOrderInput, onProcessingChange, registerPay, onSuccess, onError]);

  return null;
}
