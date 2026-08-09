"use client";

import { Icon, type IconName } from "@/components/dashboard/Icon";
import { StripeCardSection, type StripeCheckout } from "@/components/shop/checkout/StripeCardSection";

export type PaymentMethod = "COD" | "STRIPE";

/**
 * Payment step. Two methods: Cash on Delivery (unchanged) and Card via Stripe.
 * Selecting Card reveals the Stripe PaymentElement; the COD path is untouched.
 */
export function PaymentStep({
  method,
  onMethodChange,
  amountCents,
  stripe,
  note,
  onNoteChange,
  onBack,
}: {
  method: PaymentMethod;
  onMethodChange: (m: PaymentMethod) => void;
  amountCents: number;
  stripe: StripeCheckout;
  note: string;
  onNoteChange: (v: string) => void;
  onBack: () => void;
}) {
  return (
    <div className="rounded-[20px] border border-line-soft bg-surface p-7 shadow-[0_1px_2px_rgba(20,18,31,0.05)]">
      <div className="mb-[22px] flex items-center justify-between border-b border-line-soft pb-5">
        <h2 className="m-0 font-display text-[20px] font-bold text-ink">Payment method</h2>
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 font-sans text-[13.5px] font-semibold text-iris-500 hover:text-iris-700"
        >
          <Icon name="chevronLeft" size={15} strokeWidth={2} />
          Go back
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {/* Cash on Delivery — unchanged behaviour, now a selectable option. */}
        <MethodOption
          selected={method === "COD"}
          onSelect={() => onMethodChange("COD")}
          icon="cash"
          title="Cash on Delivery"
          subtitle="Pay in cash when your order is delivered to your doorstep."
        />

        {/* Card via Stripe. */}
        <MethodOption
          selected={method === "STRIPE"}
          onSelect={() => onMethodChange("STRIPE")}
          icon="card"
          title="Card (Stripe)"
          subtitle="Pay securely with a credit or debit card."
        />
      </div>

      {method === "COD" ? (
        <div className="mt-3 flex items-center gap-2 font-sans text-[12.5px] leading-[1.5] text-muted">
          <Icon name="alert" size={15} strokeWidth={2} className="flex-none text-warning" />
          Please have the exact amount ready for the delivery agent.
        </div>
      ) : (
        <StripeCardSection amountCents={amountCents} {...stripe} />
      )}

      <div className="mt-6">
        <label className="mb-2 block font-sans text-[13px] font-medium text-ink-soft">
          Order note <span className="font-normal text-muted-soft">(optional)</span>
        </label>
        <textarea
          value={note}
          onChange={(e) => onNoteChange(e.target.value)}
          placeholder="Delivery instructions, change to bring, etc."
          maxLength={1000}
          className="min-h-[80px] w-full resize-y rounded-[11px] border border-line px-3.5 py-3 font-sans text-sm leading-[1.5] text-ink outline-none focus:border-iris-500 focus:shadow-[0_0_0_3px_var(--color-iris-100)]"
        />
      </div>
    </div>
  );
}

function MethodOption({
  selected,
  onSelect,
  icon,
  title,
  subtitle,
}: {
  selected: boolean;
  onSelect: () => void;
  icon: IconName;
  title: string;
  subtitle: string;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={`flex w-full items-center gap-3.5 rounded-xl border p-4 text-left transition-colors ${
        selected ? "border-iris-500 bg-iris-50" : "border-line hover:border-iris-300"
      }`}
    >
      <span
        className={`flex size-[18px] flex-none items-center justify-center rounded-full border-2 ${
          selected ? "border-iris-500" : "border-line"
        }`}
      >
        {selected && <span className="size-2 rounded-full bg-iris-500" />}
      </span>
      <span
        className={`flex size-10 flex-none items-center justify-center rounded-lg bg-surface ${
          selected ? "text-iris-500" : "text-muted"
        }`}
      >
        <Icon name={icon} size={20} strokeWidth={1.9} />
      </span>
      <span className="flex-1">
        <span className="block font-sans text-sm font-semibold text-ink">{title}</span>
        <span className="mt-1 block font-sans text-[12.5px] text-muted">{subtitle}</span>
      </span>
    </button>
  );
}
