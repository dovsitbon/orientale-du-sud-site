import { formatPrice, getItem } from "@/lib/catalog";
import type { Dict, Locale } from "@/lib/i18n";
import { colon, formatDay } from "@/lib/quote";

export type CartLine = { id: string; qty: number };

export type Order = {
  items: CartLine[];
  mode: "pickup" | "delivery";
  address: string;
  city: string;
  date: string;
  slot: string;
  name: string;
  phone: string;
  email: string;
  notes: string;
};

export const itemName = (d: Dict, id: string) => d.menu.items[id as keyof Dict["menu"]["items"]]?.name ?? id;

export function cartTotals(items: CartLine[]) {
  let subtotal = 0;
  let unpriced = 0;
  for (const l of items) {
    const p = getItem(l.id)?.price;
    if (p == null) unpriced += l.qty;
    else subtotal += p * l.qty;
  }
  return { subtotal, unpriced, count: items.reduce((s, l) => s + l.qty, 0) };
}

/** Récapitulatif de commande envoyé sur WhatsApp et par e-mail, dans la langue du visiteur. */
export function orderMessage(o: Order, lang: Locale, d: Dict, ref?: string) {
  const m = d.order.message;
  const c = colon(lang);
  const lines = o.items.flatMap((l) => {
    const it = getItem(l.id);
    if (!it) return [];
    const price = it.price == null ? d.menu.onQuote : formatPrice(it.price * l.qty, lang);
    return [`• ${l.qty} × ${itemName(d, it.id)} — ${price}`];
  });
  const t = cartTotals(o.items);
  const head = [
    `${m.mode}${c} ${o.mode === "pickup" ? d.order.fields.pickup : d.order.fields.delivery}`,
    `${m.when}${c} ${formatDay(o.date, lang)} · ${o.slot.replace("-", " – ")}`,
    o.mode === "delivery" ? `${m.address}${c} ${o.address}${o.city ? `, ${o.city}` : ""}` : "",
  ];
  const total = [`${m.subtotal}${c} ${formatPrice(t.subtotal, lang)}${t.unpriced ? ` ${m.plusQuote}` : ""}`, o.mode === "delivery" ? m.feeNote : ""];
  const contact = [
    `${m.name}${c} ${o.name}`,
    `${m.phone}${c} ${o.phone}`,
    o.email ? `${m.email}${c} ${o.email}` : "",
    o.notes ? `${m.notes}${c} ${o.notes}` : "",
    ref ? `${m.ref}${c} ${ref}` : "",
  ];
  return [[`*${m.title}*`], head, [`*${m.items}*`, ...lines], total, contact, [m.closing]].map((b) => b.filter(Boolean).join("\n")).join("\n\n");
}
