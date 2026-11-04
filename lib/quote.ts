import site from "@/data/site.json";
import { intlLocale, type Dict, type Locale } from "@/lib/i18n";

export const EVENT_TYPES = ["wedding", "henna", "birthday", "family", "reception", "corporate", "other"] as const;
export const FORMATS = ["buffet", "table", "cocktail", "pastries", "fruits", "tea"] as const;
export type EventType = (typeof EVENT_TYPES)[number];
export type Format = (typeof FORMATS)[number];

export type Quote = {
  eventType: EventType;
  date: string;
  venue: string;
  guests: string;
  formats: Format[];
  waiters: "yes" | "no" | "";
  budget: string;
  name: string;
  phone: string;
  email: string;
  message: string;
};

export const waLink = (text: string) => `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;

/** Date du jour au format AAAA-MM-JJ, en heure de Paris. */
export function isoDay(date: Date) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Paris", year: "numeric", month: "2-digit", day: "2-digit" }).format(date);
}

export function addDays(iso: string, n: number) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d + n)).toISOString().slice(0, 10);
}

export function formatDay(iso: string, lang: Locale) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Intl.DateTimeFormat(intlLocale[lang], { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(Date.UTC(y, m - 1, d)));
}

/** Deux-points typographique : espace avant en français. */
export const colon = (lang: Locale) => (lang === "fr" ? " :" : ":");

/** Récapitulatif de devis envoyé sur WhatsApp et par e-mail, dans la langue du visiteur. */
export function quoteMessage(q: Quote, lang: Locale, d: Dict, ref?: string) {
  const m = d.quote.message;
  const f = d.quote.fields;
  const c = colon(lang);
  const event = [
    `${m.event}${c} ${f.eventTypes[q.eventType]}`,
    `${m.date}${c} ${formatDay(q.date, lang)}`,
    q.venue ? `${m.venue}${c} ${q.venue}` : "",
    q.guests ? `${m.guests}${c} ${q.guests}` : "",
    q.formats.length ? `${m.formats}${c} ${q.formats.map((x) => f.formatsList[x]).join(", ")}` : "",
    q.waiters ? `${m.waiters}${c} ${q.waiters === "yes" ? f.yes : f.no}` : "",
    q.budget ? `${m.budget}${c} ${q.budget}` : "",
  ];
  const contact = [
    `${m.name}${c} ${q.name}`,
    `${m.phone}${c} ${q.phone}`,
    q.email ? `${m.email}${c} ${q.email}` : "",
    q.message ? `${m.notes}${c} ${q.message}` : "",
    ref ? `${m.ref}${c} ${ref}` : "",
  ];
  return [[`*${m.title}*`], event, contact, [m.closing]].map((block) => block.filter(Boolean).join("\n")).join("\n\n");
}
