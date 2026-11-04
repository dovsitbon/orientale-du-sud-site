"use client";

import Link from "next/link";
import { useEffect, useId, useState, type FormEvent } from "react";
import { CartLines, CartSubtotal } from "@/components/CartDrawer";
import { WhatsAppIcon } from "@/components/icons";
import { useCart, useLocale } from "@/components/providers";
import { Field, Legend } from "@/components/QuoteForm";
import { orderSettings } from "@/lib/catalog";
import { fill } from "@/lib/i18n";
import { orderMessage, type Order } from "@/lib/order";
import { addDays, isoDay, waLink } from "@/lib/quote";
import { isEmail, isPhone } from "@/lib/validate";

type Errors = Partial<Record<"date" | "slot" | "address" | "name" | "phone" | "email", string>>;
const cardMode = process.env.NEXT_PUBLIC_PAYMENT_MODE === "stripe";

/**
 * Commande à emporter / à domicile. Par défaut la commande part sur WhatsApp et la cheffe la valide
 * avant de la préparer ; le paiement en ligne (Stripe) n'apparaît que si NEXT_PUBLIC_PAYMENT_MODE=stripe.
 */
export function OrderForm() {
  const { lang, d } = useLocale();
  const { items, ready, clear } = useCart();
  const f = d.order.fields;
  const uid = useId();
  const id = (k: string) => `${uid}-${k}`;

  const [mode, setMode] = useState<Order["mode"]>("pickup");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [pay, setPay] = useState<"whatsapp" | "card">("whatsapp");
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState<string | null>(null);
  const [payError, setPayError] = useState(false);
  const [minDate, setMinDate] = useState("");

  // eslint-disable-next-line react-hooks/set-state-in-effect -- date lue côté client
  useEffect(() => setMinDate(addDays(isoDay(new Date()), orderSettings.leadDays)), []);

  const validate = (): Errors => {
    const e: Errors = {};
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || (minDate && date < minDate)) e.date = d.quote.required;
    if (!slot) e.slot = d.quote.required;
    if (mode === "delivery" && !address.trim()) e.address = d.quote.required;
    if (!name.trim()) e.name = d.quote.required;
    if (!phone.trim()) e.phone = d.quote.required;
    else if (!isPhone(phone)) e.phone = d.quote.invalidPhone;
    if (email.trim() && !isEmail(email)) e.email = d.quote.invalidEmail;
    return e;
  };

  const onSubmit = async (ev: FormEvent) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) {
      const first = (["date", "slot", "address", "name", "phone", "email"] as const).find((k) => e[k]);
      if (first) document.getElementById(id(first))?.focus();
      return;
    }
    const order: Order = { items, mode, address: address.trim(), city: city.trim(), date, slot, name: name.trim(), phone: phone.trim(), email: email.trim(), notes: notes.trim() };
    const ref = `CMD-${Date.now().toString(36).slice(-5).toUpperCase()}`;

    if (cardMode && pay === "card") {
      const res = await fetch("/api/checkout", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ order, lang, ref }) }).catch(() => null);
      const data = res?.ok ? ((await res.json()) as { url?: string }) : null;
      if (data?.url) {
        window.location.href = data.url;
        return;
      }
      setPayError(true);
      return;
    }

    const url = waLink(orderMessage(order, lang, d, ref));
    window.open(url, "_blank", "noopener");
    fetch("/api/commande", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ order, lang, ref }), keepalive: true }).catch(() => {});
    setSent(url);
    clear();
  };

  if (sent) {
    return (
      <div className="mx-auto max-w-2xl border border-line bg-cream p-8 text-center md:p-14" role="status">
        <p className="script text-[2.6rem] leading-none text-gold-ink rtl:font-[family-name:var(--font-amiri)] rtl:text-[2rem]">{d.order.success.thanks}</p>
        <h2 className="display mt-4 text-[2rem]">{d.order.success.title}</h2>
        <p className="mx-auto mt-4 max-w-md leading-relaxed text-muted">{d.order.success.text}</p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a href={sent} target="_blank" rel="noopener noreferrer" className="btn-ink">
            <WhatsAppIcon className="h-4 w-4" />
            {d.order.success.again}
          </a>
          <Link href={`/${lang}`} className="link-line nav-link">
            {d.order.success.home}
          </Link>
        </div>
      </div>
    );
  }

  if (ready && items.length === 0) {
    return (
      <div className="mx-auto max-w-xl text-center">
        <p className="text-[1.0625rem] text-muted">{d.order.emptyCart}</p>
        <Link href={`/${lang}#carte`} className="btn-line mt-8">
          {d.order.back}
        </Link>
      </div>
    );
  }

  const err = (k: keyof Errors) => (errors[k] ? { "aria-invalid": true as const, "aria-describedby": `${id(k)}-err` } : {});
  const optional = <span className="normal-case tracking-normal">({f.optional})</span>;

  return (
    <div className="grid gap-14 lg:grid-cols-[1fr_24rem] lg:gap-20">
      <form onSubmit={onSubmit} noValidate className="order-2 space-y-14 lg:order-1">
        <fieldset className="space-y-8">
          <Legend n="01">{d.order.steps.when}</Legend>
          <div>
            <p className="label" id={id("mode")}>
              {f.mode}
            </p>
            <div role="radiogroup" aria-labelledby={id("mode")} className="mt-3 grid grid-cols-2 gap-2 sm:flex">
              {(["pickup", "delivery"] as const).map((m) => (
                <label key={m} className="chip justify-center">
                  <input type="radio" name="mode" value={m} checked={mode === m} onChange={() => setMode(m)} className="sr-only" />
                  {f[m]}
                </label>
              ))}
            </div>
            <p className="mt-3 text-[0.8125rem] text-muted">{mode === "pickup" ? d.order.pickupNote : d.order.feeNote}</p>
          </div>
          {mode === "delivery" && (
            <div className="grid gap-8 sm:grid-cols-[2fr_1fr]">
              <Field id={id("address")} label={`${f.address} *`} error={errors.address}>
                <input id={id("address")} name="address" type="text" autoComplete="street-address" value={address} onChange={(e) => setAddress(e.target.value)} className="field" maxLength={200} {...err("address")} />
              </Field>
              <Field id={id("city")} label={f.city}>
                <input id={id("city")} name="city" type="text" autoComplete="address-level2" value={city} onChange={(e) => setCity(e.target.value)} className="field" maxLength={80} />
              </Field>
            </div>
          )}
          <div className="grid gap-8 sm:grid-cols-2">
            <Field id={id("date")} label={`${f.date} *`} error={errors.date} hint={fill(d.order.leadTime, { days: orderSettings.leadDays })}>
              <input id={id("date")} name="date" type="date" required min={minDate || undefined} value={date} onChange={(e) => setDate(e.target.value)} className="field" {...err("date")} />
            </Field>
            <Field id={id("slot")} label={`${f.slot} *`} error={errors.slot}>
              <select id={id("slot")} name="slot" value={slot} onChange={(e) => setSlot(e.target.value)} className="field num" {...err("slot")}>
                <option value="">{f.slotNone}</option>
                {orderSettings.slots.map((s) => (
                  <option key={s} value={s}>
                    {s.replace("-", " – ")}
                  </option>
                ))}
              </select>
            </Field>
          </div>
        </fieldset>

        <fieldset className="space-y-8">
          <Legend n="02">{d.order.steps.contact}</Legend>
          <div className="grid gap-8 sm:grid-cols-2">
            <Field id={id("name")} label={`${f.name} *`} error={errors.name}>
              <input id={id("name")} name="name" type="text" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} className="field" maxLength={120} {...err("name")} />
            </Field>
            <Field id={id("phone")} label={`${f.phone} *`} error={errors.phone}>
              <input id={id("phone")} name="phone" type="tel" autoComplete="tel" inputMode="tel" dir="ltr" value={phone} onChange={(e) => setPhone(e.target.value)} className="field rtl:text-end" maxLength={30} {...err("phone")} />
            </Field>
            <Field id={id("email")} label={<>{f.email} {optional}</>} error={errors.email}>
              <input id={id("email")} name="email" type="email" autoComplete="email" spellCheck={false} dir="ltr" value={email} onChange={(e) => setEmail(e.target.value)} className="field rtl:text-end" maxLength={160} {...err("email")} />
            </Field>
          </div>
          <Field id={id("notes")} label={f.notes}>
            <textarea id={id("notes")} name="notes" rows={3} placeholder={f.notesPlaceholder} value={notes} onChange={(e) => setNotes(e.target.value)} className="field resize-y" maxLength={1000} />
          </Field>
        </fieldset>

        {cardMode && (
          <fieldset className="space-y-3">
            <legend className="label mb-3">{d.order.payment.title}</legend>
            {(["whatsapp", "card"] as const).map((p) => (
              <label key={p} className="chip w-full">
                <input type="radio" name="pay" value={p} checked={pay === p} onChange={() => setPay(p)} className="sr-only" />
                {p === "whatsapp" ? d.order.payment.whatsapp : d.order.payment.card}
              </label>
            ))}
            {payError && <p className="text-[0.8125rem] text-red">{d.order.payment.cardError}</p>}
          </fieldset>
        )}

        <div>
          <button type="submit" className="btn-ink w-full sm:w-auto">
            {pay === "card" ? null : <WhatsAppIcon className="h-4 w-4" />}
            {pay === "card" ? d.order.submitCard : d.order.submit}
          </button>
          <p className="mt-4 text-[0.8125rem] leading-relaxed text-muted">{d.quote.hint}</p>
          <p className="mt-1 text-[0.8125rem] leading-relaxed text-muted">{d.quote.consent}</p>
        </div>
      </form>

      <aside className="order-1 self-start border border-line bg-cream p-6 md:p-8 lg:sticky lg:top-28 lg:order-2" aria-label={d.order.summary}>
        <h2 className="display text-[1.6rem]">{d.order.summary}</h2>
        <div className="mt-2">
          <CartLines compact />
        </div>
        <div className="mt-4 border-t border-line pt-5">
          <CartSubtotal />
        </div>
      </aside>
    </div>
  );
}
