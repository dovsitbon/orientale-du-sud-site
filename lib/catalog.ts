import menu from "@/data/menu.json";
import { intlLocale, type Locale } from "@/lib/i18n";

export type Category = "sale" | "sucre" | "fruits";
export type MenuItem = { id: string; cat: Category; img: string; price: number | null };

export const categories = menu.categories as Category[];
export const menuItems = menu.items as MenuItem[];
export const orderSettings = menu.order;

const byId = new Map(menuItems.map((it) => [it.id, it]));
export const getItem = (id: string) => byId.get(id);

export function formatPrice(value: number, lang: Locale) {
  return new Intl.NumberFormat(intlLocale[lang], { style: "currency", currency: "EUR", maximumFractionDigits: value % 1 ? 2 : 0 }).format(value);
}
