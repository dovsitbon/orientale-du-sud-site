import menu from "@/data/menu.json";
import { getItem } from "@/lib/catalog";
import { getDict, isLocale, type Locale } from "@/lib/i18n";
import type { CartLine, Order } from "@/lib/order";
import { EVENT_TYPES, FORMATS, type EventType, type Format, type Quote } from "@/lib/quote";

const str = (v: unknown, max = 300) => (typeof v === "string" ? v.slice(0, max).trim() : "");
const isDate = (v: string) => /^\d{4}-\d{2}-\d{2}$/.test(v);

export function parseLang(v: unknown): Locale {
  return typeof v === "string" && isLocale(v) ? v : "fr";
}

export const isPhone = (v: string) => /^[+\d][\d\s\-().]{7,19}$/.test(v.trim());
export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

/** Revalide côté serveur tout ce qui vient du formulaire de devis. */
export function parseQuote(raw: unknown, lang: Locale): Quote | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const eventType = str(r.eventType, 20);
  const budget = str(r.budget, 60);
  const waiters = str(r.waiters, 3);
  const q: Quote = {
    eventType: (EVENT_TYPES as readonly string[]).includes(eventType) ? (eventType as EventType) : "other",
    date: str(r.date, 10),
    venue: str(r.venue, 160),
    guests: str(r.guests, 6).replace(/\D/g, ""),
    formats: Array.isArray(r.formats) ? (r.formats.filter((x) => (FORMATS as readonly unknown[]).includes(x)) as Format[]).slice(0, FORMATS.length) : [],
    waiters: waiters === "yes" || waiters === "no" ? waiters : "",
    budget: getDict(lang).quote.fields.budgets.includes(budget) ? budget : "",
    name: str(r.name, 120),
    phone: str(r.phone, 30),
    email: str(r.email, 160),
    message: str(r.message, 1500),
  };
  if (!isDate(q.date) || !q.name || !isPhone(q.phone)) return null;
  if (q.email && !isEmail(q.email)) q.email = "";
  return q;
}

function parseItems(v: unknown): CartLine[] {
  if (!Array.isArray(v)) return [];
  return v
    .flatMap((it) => {
      const o = (it ?? {}) as Record<string, unknown>;
      const id = str(o.id, 60);
      const qty = Math.min(50, Math.max(1, Math.round(Number(o.qty) || 1)));
      return getItem(id) ? [{ id, qty }] : [];
    })
    .slice(0, 40);
}

/** Revalide côté serveur une commande à emporter / à domicile. */
export function parseOrder(raw: unknown): Order | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const slot = str(r.slot, 20);
  const o: Order = {
    items: parseItems(r.items),
    mode: r.mode === "delivery" ? "delivery" : "pickup",
    address: str(r.address, 200),
    city: str(r.city, 80),
    date: str(r.date, 10),
    slot: menu.order.slots.includes(slot) ? slot : "",
    name: str(r.name, 120),
    phone: str(r.phone, 30),
    email: str(r.email, 160),
    notes: str(r.notes, 1000),
  };
  if (!o.items.length || !isDate(o.date) || !o.slot || !o.name || !isPhone(o.phone)) return null;
  if (o.mode === "delivery" && !o.address) return null;
  if (o.email && !isEmail(o.email)) o.email = "";
  return o;
}

export const escapeHtml = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
