"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { CloseIcon, MinusIcon, PlusIcon } from "@/components/icons";
import { useCart, useLocale } from "@/components/providers";
import { formatPrice, getItem } from "@/lib/catalog";
import { cartTotals, itemName } from "@/lib/order";

type Lenis = { stop: () => void; start: () => void };

/** Lignes du panier, partagées par le tiroir et la page de commande. */
export function CartLines({ compact = false }: { compact?: boolean }) {
  const { lang, d } = useLocale();
  const { items, setQty } = useCart();
  return (
    <ul className="divide-y divide-line">
      {items.map((l) => {
        const it = getItem(l.id);
        if (!it) return null;
        const name = itemName(d, it.id);
        const unit = d.menu.items[it.id as keyof typeof d.menu.items]?.unit;
        return (
          <li key={l.id} className="flex gap-4 py-4">
            <div className={`relative shrink-0 overflow-hidden bg-ivory ${compact ? "h-14 w-12" : "h-20 w-16"}`}>
              <Image src={it.img} alt="" fill sizes="64px" quality={70} className="object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[0.9375rem] leading-snug">{name}</p>
                  {unit && <p className="mt-0.5 text-[0.8125rem] text-muted">{unit}</p>}
                </div>
                <span className="num shrink-0 text-gold-ink">{it.price == null ? d.menu.onQuote : formatPrice(it.price * l.qty, lang)}</span>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center border border-line" role="group" aria-label={`${d.cart.qty} – ${name}`}>
                  <button type="button" className="flex h-9 w-9 items-center justify-center hover:text-gold-ink" onClick={() => setQty(l.id, l.qty - 1)} aria-label={`${d.cart.less} – ${name}`}>
                    <MinusIcon className="h-3.5 w-3.5" />
                  </button>
                  <span className="num w-7 text-center" aria-live="polite">
                    {l.qty}
                  </span>
                  <button type="button" className="flex h-9 w-9 items-center justify-center hover:text-gold-ink" onClick={() => setQty(l.id, l.qty + 1)} aria-label={`${d.cart.more} – ${name}`}>
                    <PlusIcon className="h-3.5 w-3.5" />
                  </button>
                </div>
                <button type="button" onClick={() => setQty(l.id, 0)} className="min-h-9 text-[0.8125rem] text-muted underline-offset-4 hover:text-ink hover:underline">
                  {d.cart.remove}
                </button>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export function CartSubtotal() {
  const { lang, d } = useLocale();
  const { items } = useCart();
  const t = cartTotals(items);
  return (
    <div>
      <p className="flex items-baseline justify-between">
        <span className="label">{d.cart.subtotal}</span>
        <span className="num text-lg">{formatPrice(t.subtotal, lang)}</span>
      </p>
      {t.unpriced > 0 && <p className="mt-1 text-end text-[0.8125rem] text-muted">{d.cart.plusQuote}</p>}
      <p className="mt-3 text-[0.8125rem] leading-relaxed text-muted">{d.menu.priceNote}</p>
    </div>
  );
}

export function CartDrawer() {
  const { lang, d } = useLocale();
  const { open, setOpen, count, items } = useCart();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;
    lenis?.stop();
    return () => {
      window.removeEventListener("keydown", onKey);
      lenis?.start();
      prev?.focus?.();
    };
  }, [open, setOpen]);

  return (
    <div className={`fixed inset-0 z-[70] ${open ? "visible" : "invisible"}`} aria-hidden={!open}>
      <div className={`absolute inset-0 bg-ink/40 transition-opacity duration-500 ${open ? "opacity-100" : "opacity-0"}`} onClick={() => setOpen(false)} />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={d.cart.title}
        className={`absolute inset-y-0 end-0 flex w-full max-w-md flex-col bg-cream text-ink shadow-[0_0_60px_rgba(43,35,28,0.14)] transition-transform duration-700 ease-[cubic-bezier(0.22,0.61,0.36,1)] ${open ? "translate-x-0" : "translate-x-full rtl:-translate-x-full"}`}
      >
        <div className="flex items-center justify-between border-b border-line px-6 py-5">
          <h2 className="display text-[1.6rem]">
            {d.cart.title}
            {count > 0 && <span className="num ms-2 text-base text-muted">({count})</span>}
          </h2>
          <button ref={closeRef} type="button" onClick={() => setOpen(false)} className="-m-2 flex h-11 w-11 items-center justify-center" aria-label={d.nav.close}>
            <CloseIcon />
          </button>
        </div>
        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-5 px-8 text-center">
            <p className="display text-2xl">{d.cart.empty}</p>
            <p className="text-[0.9375rem] text-muted">{d.cart.emptyText}</p>
            <Link href={`/${lang}#carte`} onClick={() => setOpen(false)} className="btn-line mt-2">
              {d.cart.browse}
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto overscroll-contain px-6" data-lenis-prevent>
              <CartLines />
            </div>
            <div className="border-t border-line px-6 py-6">
              <CartSubtotal />
              <Link href={`/${lang}/commande`} onClick={() => setOpen(false)} className="btn-ink mt-5 w-full">
                {d.cart.checkout}
              </Link>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
