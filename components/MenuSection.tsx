"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { BagIcon, CheckIcon, PlusIcon } from "@/components/icons";
import { useCart, useLocale } from "@/components/providers";
import { categories, formatPrice, menuItems, type Category } from "@/lib/catalog";
import { fill } from "@/lib/i18n";
import { itemName } from "@/lib/order";

function AddButton({ id, name }: { id: string; name: string }) {
  const { d } = useLocale();
  const { add } = useCart();
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (!done) return;
    const t = setTimeout(() => setDone(false), 1600);
    return () => clearTimeout(t);
  }, [done]);
  return (
    <button
      type="button"
      onClick={() => {
        add(id);
        setDone(true);
      }}
      className={`nav-link inline-flex min-h-10 items-center gap-2 border px-4 transition-colors duration-500 ${done ? "border-ink bg-ink text-cream" : "border-ink/35 hover:border-ink hover:bg-ink hover:text-cream"}`}
      aria-label={fill(d.menu.addAria, { name })}
    >
      {done ? <CheckIcon className="h-3.5 w-3.5" /> : <PlusIcon className="h-3.5 w-3.5" />}
      {done ? d.menu.added : d.menu.add}
    </button>
  );
}

/** La carte à emporter : onglets Salé / Sucré / Fruits, fiches produits et bouton « Ajouter ». */
export function MenuSection() {
  const { lang, d } = useLocale();
  const { count, setOpen } = useCart();
  const [tab, setTab] = useState<Category>("sale");

  // Les liens « Salé » et « Sucré » du menu ouvrent directement le bon onglet
  useEffect(() => {
    const sync = () => {
      const h = window.location.hash.slice(1);
      if ((categories as string[]).includes(h)) setTab(h as Category);
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  const shown = menuItems.filter((it) => it.cat === tab);

  return (
    <>
      <div role="tablist" aria-label={d.menu.tabsLabel} className="mb-12 flex justify-center gap-10 md:mb-16">
        {categories.map((c) => (
          <button key={c} id={`tab-${c}`} type="button" role="tab" aria-selected={tab === c} aria-controls="menu-panel" className="tab" onClick={() => setTab(c)}>
            {d.menu.tabs[c]}
          </button>
        ))}
      </div>

      <div id="menu-panel" role="tabpanel" aria-labelledby={`tab-${tab}`}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.ul key={tab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.45 }} className="grid grid-cols-2 gap-x-4 gap-y-12 md:gap-x-8 lg:grid-cols-3 xl:grid-cols-4">
            {shown.map((it) => {
              const t = d.menu.items[it.id as keyof typeof d.menu.items];
              const name = itemName(d, it.id);
              return (
                <li key={it.id} className="flex flex-col">
                  <div className="zoom relative aspect-[4/5] overflow-hidden bg-ivory">
                    <Image src={it.img} alt={name} fill sizes="(min-width: 1280px) 22vw, (min-width: 1024px) 30vw, 46vw" quality={70} className="object-cover" />
                  </div>
                  <div className="mt-4 flex flex-1 flex-col">
                    <p className="text-[0.75rem] tracking-[0.14em] text-gold-ink uppercase rtl:tracking-normal">{t.unit}</p>
                    <h3 className="display mt-1.5 text-[1.35rem] leading-tight md:text-[1.6rem]">{name}</h3>
                    <p className="mt-2 hidden flex-1 text-[0.9rem] leading-relaxed text-muted sm:block">{t.desc}</p>
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                      <span className="num text-[1.05rem]">{it.price == null ? d.menu.onQuote : formatPrice(it.price, lang)}</span>
                      <AddButton id={it.id} name={name} />
                    </div>
                  </div>
                </li>
              );
            })}
          </motion.ul>
        </AnimatePresence>
      </div>

      <div className="mt-14 flex flex-col items-center gap-5 text-center">
        <p className="max-w-xl text-[0.875rem] text-muted">{d.menu.priceNote}</p>
        {count > 0 && (
          <button type="button" onClick={() => setOpen(true)} className="btn-ink">
            <BagIcon className="h-4 w-4" />
            {d.menu.seeCart} ({count})
          </button>
        )}
      </div>
    </>
  );
}
