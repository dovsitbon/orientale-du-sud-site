import type { Metadata } from "next";
import Link from "next/link";
import site from "@/data/site.json";
import { Star } from "@/components/Logo";
import { getDict, isLocale, type Locale } from "@/lib/i18n";
import { pageMeta } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[lang]/mentions-legales">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const d = getDict(lang);
  return { ...pageMeta(lang, "/mentions-legales", d.meta.legalTitle, d.footer.tagline), robots: { index: false } };
}

// À COMPLÉTER dans data/site.json (legal) : raison sociale, SIRET, adresse du siège, responsable de la publication.
export default async function Legal({ params }: PageProps<"/[lang]/mentions-legales">) {
  const { lang } = await params;
  const d = getDict(lang as Locale);
  const L = site.legal;
  const todo = <span className="text-red">[{d.legal.toFill}]</span>;
  const sections = [
    {
      title: d.legal.publisher,
      body: (
        <>
          {L.company || site.name} — SIRET {L.siret || todo}
          <br />
          {L.address || todo}
          <br />
          <span dir="ltr">{site.phone}</span> · {L.publisher || todo}
        </>
      ),
    },
    { title: d.legal.hosting, body: d.legal.hostingText },
    { title: d.legal.data, body: d.legal.dataText },
    { title: d.legal.cookies, body: d.legal.cookiesText },
    { title: d.legal.photos, body: d.legal.photosText },
  ];
  return (
    <article className="mx-auto max-w-3xl px-5 pt-36 pb-28 md:pt-48 md:pb-40">
      <h1 className="display text-[2.8rem] md:text-[3.8rem]">{d.legal.title}</h1>
      <Star className="mt-8 h-10 w-10 text-gold" />
      <div className="mt-12 space-y-10">
        {sections.map((s) => (
          <section key={s.title}>
            <h2 className="eyebrow">{s.title}</h2>
            <p className="mt-3 text-[1.0625rem] leading-[1.85] text-muted">{s.body}</p>
          </section>
        ))}
      </div>
      <Link href={`/${lang}`} className="btn-line mt-16">
        {d.notFound.back}
      </Link>
    </article>
  );
}
