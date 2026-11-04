"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { getItem } from "@/lib/catalog";
import type { Dict, Locale } from "@/lib/i18n";
import type { CartLine } from "@/lib/order";

type LocaleCtx = { lang: Locale; d: Dict };
const LocaleContext = createContext<LocaleCtx | null>(null);

export function useLocale() {
  const v = useContext(LocaleContext);
  if (!v) throw new Error("useLocale hors de Providers");
  return v;
}

type Cart = {
  items: CartLine[];
  count: number;
  ready: boolean;
  open: boolean;
  setOpen: (v: boolean) => void;
  add: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
};
const CartContext = createContext<Cart | null>(null);
const STORAGE = "ods-panier";

export function useCart() {
  const v = useContext(CartContext);
  if (!v) throw new Error("useCart hors de Providers");
  return v;
}

export function Providers({ lang, d, children }: { lang: Locale; d: Dict; children: ReactNode }) {
  const [items, setItems] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);

  // Le panier survit à un changement de langue ou à un rechargement
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE) ?? "[]") as CartLine[];
      // eslint-disable-next-line react-hooks/set-state-in-effect -- lecture unique au montage
      setItems(saved.filter((l) => getItem(l.id) && l.qty > 0));
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE, JSON.stringify(items));
    } catch {}
  }, [items, ready]);

  const setQty = useCallback((id: string, qty: number) => {
    setItems((list) => {
      if (qty <= 0) return list.filter((l) => l.id !== id);
      const q = Math.min(50, Math.round(qty));
      return list.some((l) => l.id === id) ? list.map((l) => (l.id === id ? { ...l, qty: q } : l)) : [...list, { id, qty: q }];
    });
  }, []);
  const add = useCallback((id: string) => {
    setItems((list) => (list.some((l) => l.id === id) ? list.map((l) => (l.id === id ? { ...l, qty: Math.min(50, l.qty + 1) } : l)) : [...list, { id, qty: 1 }]));
  }, []);
  const clear = useCallback(() => setItems([]), []);

  const cart = useMemo<Cart>(() => ({ items, count: items.reduce((s, l) => s + l.qty, 0), ready, open, setOpen, add, setQty, clear }), [items, ready, open, add, setQty, clear]);

  return (
    <LocaleContext.Provider value={{ lang, d }}>
      <CartContext.Provider value={cart}>{children}</CartContext.Provider>
    </LocaleContext.Provider>
  );
}
