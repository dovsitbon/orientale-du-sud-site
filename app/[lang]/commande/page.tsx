import type { Metadata } from "next";
import Link from "next/link";
import { ArrowIcon } from "@/components/icons";
import { OrderForm } from "@/components/OrderForm";
import { getDict, isLocale, type Locale } from "@/lib/i18n";
import { pageMeta } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[lang]/commande">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const d = getDict(lang);
  return { ...pageMeta(lang, "/commande", d.meta.orderTitle, d.meta.orderDescription), robots: { index: false, follow: true } };
}

export default async function OrderPage({ params }: PageProps<"/[lang]/commande">) {
  const { lang } = await params;
  const d = getDict(lang as Locale);
  return (
    <div className="arabesque min-h-[80svh] px-5 pt-32 pb-28 md:px-10 md:pt-44 md:pb-36">
      <div className="mx-auto max-w-[1200px]">
        <Link href={`/${lang}#carte`} className="nav-link inline-flex min-h-10 items-center gap-3 text-muted hover:text-ink">
          <ArrowIcon className="h-4 w-4 -scale-x-100 rtl:scale-x-100" />
          {d.order.back}
        </Link>
        <p className="eyebrow mt-8">{d.order.eyebrow}</p>
        <h1 className="display mt-4 text-[2.8rem] md:text-[4rem]">{d.order.title}</h1>
        <p className="mt-5 max-w-2xl text-[1.0625rem] leading-[1.8] text-muted">{d.order.text}</p>
        <div className="mt-14 md:mt-20">
          <OrderForm />
        </div>
      </div>
    </div>
  );
}
