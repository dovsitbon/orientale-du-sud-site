import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import site from "@/data/site.json";
import saison from "@/data/saison.json";
import reviewsData from "@/data/reviews.json";
import { Gallery, type GalleryCat, type GalleryItem } from "@/components/Gallery";
import { HeroMedia } from "@/components/HeroMedia";
import { ArrowIcon, HeartIcon, InstagramIcon, OliveIcon, PhoneIcon, SparkleIcon, WhatsAppIcon } from "@/components/icons";
import { Star } from "@/components/Logo";
import { MenuSection } from "@/components/MenuSection";
import { QuoteForm } from "@/components/QuoteForm";
import { Reveal } from "@/components/Reveal";
import { altOf, fill, getDict, isLocale, type Dict, type Locale } from "@/lib/i18n";
import { img } from "@/lib/media";
import { waLink } from "@/lib/quote";
import { homeJsonLd, jsonLd, pageMeta } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const d = getDict(lang);
  return pageMeta(lang, "", d.meta.title, d.meta.description);
}

/** Photo de public/media avec son texte alternatif dans la langue de la page. */
function Photo({ d, src, sizes, className = "", fillBox = false, quality = 70 }: { d: Dict; src: string; sizes: string; className?: string; fillBox?: boolean; quality?: number }) {
  const m = img(src);
  return fillBox ? (
    <Image src={m.src} alt={altOf(d, src)} fill sizes={sizes} quality={quality} className={`object-cover ${className}`} />
  ) : (
    <Image src={m.src} alt={altOf(d, src)} width={m.width} height={m.height} sizes={sizes} quality={quality} className={`h-auto w-full ${className}`} />
  );
}

function SectionHead({ eyebrow, title, text, center = false, id }: { eyebrow: string; title: string; text?: string; center?: boolean; id?: string }) {
  return (
    <Reveal className={center ? "mx-auto max-w-3xl text-center" : "max-w-2xl"}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 id={id} className="display mt-5 text-[2.5rem] md:text-[3.6rem]">
        {title}
      </h2>
      {text && <p className={`mt-6 text-[1.0625rem] leading-[1.8] text-muted ${center ? "mx-auto max-w-2xl" : ""}`}>{text}</p>}
    </Reveal>
  );
}

const M = {
  hero: "/media/hero",
  mar: "/media/mariages",
  tab: "/media/tables-reception",
  sale: "/media/sale",
  sucre: "/media/sucre",
  fruits: "/media/fruits",
  eq: "/media/equipe-coulisses",
  gal: "/media/galerie",
};

const GALLERY: [string, GalleryCat][] = [
  [`${M.mar}/serveurs-cloches-salle.jpg`, "mariages"],
  [`${M.tab}/cheffe-plateaux-soleil.jpg`, "tables"],
  [`${M.sale}/couscous-legumes.jpg`, "saveurs"],
  [`${M.gal}/tables-fleuries-jardin.jpg`, "tables"],
  [`${M.mar}/fontaine-fleurs-reception.jpg`, "mariages"],
  [`${M.sucre}/kadaif-pistache.jpg`, "saveurs"],
  [`${M.tab}/buffet-oriental-petales.jpg`, "tables"],
  [`${M.mar}/serveurs-plateaux-dores.jpg`, "mariages"],
  [`${M.fruits}/cascade-fruits-plateau.jpg`, "saveurs"],
  [`${M.gal}/salon-maries.jpg`, "mariages"],
  [`${M.tab}/table-chandelier-roses.jpg`, "tables"],
  [`${M.sale}/nids-kadaif-crevettes.jpg`, "saveurs"],
  [`${M.mar}/buffet-jardin-fleurs.jpg`, "mariages"],
  [`${M.tab}/verres-voilage-olive.jpg`, "tables"],
  [`${M.sucre}/chebakia.jpg`, "saveurs"],
  [`${M.gal}/longue-table-pampa.jpg`, "tables"],
  [`${M.mar}/maries-a-table.jpg`, "mariages"],
  [`${M.tab}/tajine-bleu-petales.jpg`, "saveurs"],
  [`${M.gal}/arche-fleurs-blanches.jpg`, "tables"],
  [`${M.mar}/convives-jardin.jpg`, "mariages"],
  [`${M.sucre}/cornes-de-gazelle.jpg`, "saveurs"],
  [`${M.tab}/table-tajines-assiettes.jpg`, "tables"],
];

const POINT_ICONS = [HeartIcon, Star, SparkleIcon, OliveIcon];

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang: l } = await params;
  const lang = l as Locale;
  const d = getDict(lang);
  const cards = [`${M.mar}/serveurs-cloches-salle.jpg`, `${M.sale}/couscous-poulet-amandes.jpg`, `${M.fruits}/cascade-de-fruits.jpg`];
  const cardHref = ["#mariages", "#carte", "#sucre"];
  const reviews = reviewsData.reviews.filter((r) => r.published && r.text);
  const gallery: GalleryItem[] = GALLERY.map(([src, cat]) => ({ ...img(src), alt: altOf(d, src), cat }));

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(homeJsonLd(lang))} />

      {/* ——— Hero ——— */}
      <section className="relative flex h-[100svh] min-h-[560px] items-end overflow-hidden bg-ink text-cream" aria-labelledby="hero-title">
        <HeroMedia wide={img(`${M.hero}/poster-wide.jpg`)} tall={img(`${M.hero}/poster-tall.jpg`)} alt={d.hero.alt} videoWide={`${M.hero}/hero-wide.mp4`} videoTall={`${M.hero}/hero-tall.mp4`} />
        <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,rgba(43,35,28,0.5)_0%,rgba(43,35,28,0.08)_30%,rgba(43,35,28,0.28)_58%,rgba(43,35,28,0.8)_100%)]" />
        <div className="relative mx-auto w-full max-w-[1400px] px-5 pb-[max(5.5rem,12svh)] text-center md:px-10 md:pb-28">
          <p className="eyebrow rise mx-auto max-w-[19rem] !text-cream/90 text-balance max-sm:!tracking-[0.2em] sm:max-w-none" style={{ animationDelay: "0.2s" }}>
            {d.hero.eyebrow}
          </p>
          <h1 id="hero-title" className="display hero-title mx-auto mt-6 max-w-5xl text-[3rem] leading-[1.02] md:text-[5.6rem] lg:text-[6.6rem] rtl:text-[2.6rem] rtl:leading-[1.3] md:rtl:text-[4.4rem]">
            {d.hero.title}
          </h1>
          <div className="rise mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-5" style={{ animationDelay: "0.5s" }}>
            <Link href="#contact" className="btn-line on-dark min-w-56">
              {d.hero.quote}
            </Link>
            <Link href="#carte" className="btn-line on-dark min-w-56 !border-transparent bg-cream/10 backdrop-blur-[2px]">
              {d.hero.order}
            </Link>
          </div>
        </div>
        <a href="#maison" className="absolute bottom-0 left-1/2 hidden h-16 w-10 -translate-x-1/2 justify-center md:flex" aria-label={d.hero.scroll}>
          <span className="scroll-line block h-full w-px bg-cream/70" />
        </a>
      </section>

      {/* ——— Manifeste ——— */}
      <section id="maison" className="arabesque scroll-mt-20 px-5 py-28 md:py-44" aria-labelledby="manifesto-title">
        <Reveal className="mx-auto max-w-3xl text-center">
          <Star className="mx-auto h-12 w-12 text-gold" strokeWidth={1.6} />
          <p className="eyebrow mt-8">{d.manifesto.eyebrow}</p>
          <h2 id="manifesto-title" className="display mt-7 text-[2.3rem] md:text-[3.4rem]">
            {d.manifesto.title}
          </h2>
          <p className="mx-auto mt-8 max-w-2xl text-[1.0625rem] leading-[1.9] text-muted">{d.manifesto.text}</p>
          <p className="script mt-10 text-[2rem] text-gold-ink rtl:font-[family-name:var(--font-amiri)] rtl:text-[1.5rem]">{d.manifesto.signature}</p>
          <a href="#savoir-faire" className="link-line nav-link mt-10 inline-block">
            {d.manifesto.link}
          </a>
        </Reveal>
      </section>

      {/* ——— 001 / 002 / 003 ——— */}
      <section id="savoir-faire" className="scroll-mt-20 bg-ivory px-5 py-24 md:px-10 md:py-36" aria-labelledby="cards-title">
        <div className="mx-auto max-w-[1400px]">
          <SectionHead eyebrow={d.cards.eyebrow} title={d.cards.title} center id="cards-title" />
          <ol className="mt-16 grid gap-14 md:mt-24 md:grid-cols-3 md:gap-8">
            {d.cards.items.map((c, i) => (
              <Reveal as="li" key={c.title} delay={i * 0.12} className={i === 1 ? "md:mt-20" : ""}>
                <Link href={cardHref[i]} className="group block">
                  <div className="zoom relative aspect-[3/4] overflow-hidden bg-sand-soft">
                    <Photo d={d} src={cards[i]} fillBox sizes="(min-width: 768px) 32vw, 100vw" />
                  </div>
                  <p className="num mt-6 text-[0.875rem] text-gold-ink">{String(i + 1).padStart(3, "0")}</p>
                  <h3 className="display mt-2 text-[2rem]">{c.title}</h3>
                  <p className="mt-3 max-w-sm leading-[1.8] text-muted">{c.text}</p>
                  <span className="nav-link mt-5 inline-flex items-center gap-3">
                    <span className="link-line">{c.link}</span>
                    <ArrowIcon />
                  </span>
                </Link>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ——— Mariages & événements ——— */}
      <section id="mariages" className="scroll-mt-20 px-5 py-24 md:px-10 md:py-40" aria-labelledby="weddings-title">
        <div className="mx-auto grid max-w-[1400px] items-center gap-14 md:grid-cols-12 md:gap-10">
          <Reveal className="md:col-span-6">
            <figure>
              <div className="relative aspect-[4/5] overflow-hidden bg-sand-soft">
                <Photo d={d} src={`${M.mar}/reception-jardin-soleil.jpg`} fillBox sizes="(min-width: 768px) 46vw, 100vw" quality={80} />
              </div>
              <figcaption className="mt-3 text-[0.8125rem] text-muted">{d.weddings.caption}</figcaption>
            </figure>
          </Reveal>
          <div className="md:col-span-5 md:col-start-8">
            <SectionHead eyebrow={d.weddings.eyebrow} title={d.weddings.title} text={d.weddings.text} id="weddings-title" />
            <Reveal delay={0.15}>
              <Link href="#contact" className="btn-ink mt-10">
                {d.weddings.cta}
              </Link>
            </Reveal>
          </div>
        </div>

        <ul className="mx-auto mt-24 grid max-w-[1400px] gap-x-8 gap-y-12 border-t border-line pt-14 sm:grid-cols-2 lg:grid-cols-4 md:mt-32">
          {d.weddings.points.map((p, i) => {
            const Icon = POINT_ICONS[i];
            return (
              <Reveal as="li" key={p.title} delay={i * 0.08}>
                <Icon className="h-8 w-8 text-gold" />
                <h3 className="display mt-5 text-[1.6rem]">{p.title}</h3>
                <p className="mt-3 leading-[1.8] text-muted">{p.text}</p>
              </Reveal>
            );
          })}
        </ul>

        <div className="mx-auto mt-20 grid max-w-[1400px] grid-cols-2 gap-3 md:mt-28 md:grid-cols-12 md:gap-8">
          <Reveal className="col-span-1 md:col-span-4">
            <div className="zoom relative aspect-[3/4] overflow-hidden bg-sand-soft">
              <Photo d={d} src={`${M.mar}/service-cloches-tajine.jpg`} fillBox sizes="(min-width: 768px) 32vw, 50vw" />
            </div>
          </Reveal>
          <Reveal className="col-span-1 md:col-span-4 md:mt-24" delay={0.1}>
            <div className="zoom relative aspect-[3/4] overflow-hidden bg-sand-soft">
              <Photo d={d} src={`${M.mar}/service-tenue-traditionnelle.jpg`} fillBox sizes="(min-width: 768px) 32vw, 50vw" />
            </div>
          </Reveal>
          <Reveal className="col-span-2 md:col-span-4" delay={0.2}>
            <div className="zoom relative aspect-[4/3] overflow-hidden bg-sand-soft md:aspect-[3/4]">
              <Photo d={d} src={`${M.sucre}/the-a-la-menthe.jpg`} fillBox sizes="(min-width: 768px) 32vw, 100vw" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ——— Coulisses, pleine largeur ——— */}
      <section className="relative flex min-h-[88svh] items-end overflow-hidden bg-ink text-cream" aria-labelledby="backstage-title">
        <Photo d={d} src={`${M.eq}/cuisine-assiettes.jpg`} fillBox sizes="100vw" quality={75} className="object-[50%_60%]" />
        <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,rgba(43,35,28,0.15)_0%,rgba(43,35,28,0.35)_45%,rgba(43,35,28,0.85)_100%)]" />
        <Reveal className="relative mx-auto w-full max-w-[1400px] px-5 pb-20 md:px-10 md:pb-28">
          <p className="eyebrow !text-sand">{d.backstage.eyebrow}</p>
          <h2 id="backstage-title" className="display mt-5 max-w-4xl text-[2.6rem] md:text-[4.8rem] rtl:md:text-[3.8rem]">
            {d.backstage.title}
          </h2>
          <p className="mt-6 max-w-xl text-[1.0625rem] leading-[1.8] text-cream/85">{d.backstage.text}</p>
        </Reveal>
      </section>

      {/* ——— La carte ——— */}
      <section id="carte" className="relative scroll-mt-20 px-5 py-24 md:px-10 md:py-36" aria-labelledby="menu-title">
        <span id="sale" className="absolute top-0 scroll-mt-20" aria-hidden="true" />
        <span id="sucre" className="absolute top-0 scroll-mt-20" aria-hidden="true" />
        <span id="fruits" className="absolute top-0 scroll-mt-20" aria-hidden="true" />
        <div className="mx-auto max-w-[1400px]">
          <SectionHead eyebrow={d.menu.eyebrow} title={d.menu.title} text={d.menu.text} center id="menu-title" />
          <div className="mt-14 md:mt-20">
            <MenuSection />
          </div>
        </div>
      </section>

      {/* ——— L'équipe ——— */}
      <section id="equipe" className="scroll-mt-20 bg-ivory px-5 py-24 md:px-10 md:py-40" aria-labelledby="team-title">
        <div className="mx-auto grid max-w-[1400px] items-start gap-14 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-5 md:sticky md:top-32">
            <SectionHead eyebrow={d.team.eyebrow} title={d.team.title} id="team-title" />
            <Reveal delay={0.1}>
              {d.team.text.map((t) => (
                <p key={t.slice(0, 20)} className="mt-6 text-[1.0625rem] leading-[1.85] text-muted">
                  {t}
                </p>
              ))}
              <blockquote className="mt-10 border-s border-gold ps-6">
                <p className="display text-[1.6rem] leading-snug italic rtl:not-italic">« {d.team.quote} »</p>
              </blockquote>
            </Reveal>
          </div>
          <div className="md:col-span-6 md:col-start-7">
            <Reveal>
              <figure>
                <div className="relative aspect-[1080/1126] overflow-hidden bg-sand-soft">
                  <Photo d={d} src={`${M.eq}/merci-2025.jpg`} fillBox sizes="(min-width: 768px) 46vw, 100vw" quality={80} />
                </div>
                <figcaption className="mt-3 text-[0.8125rem] text-muted">{d.team.caption}</figcaption>
              </figure>
            </Reveal>
            <div className="mt-8 grid grid-cols-3 gap-3 md:gap-6">
              {[`${M.eq}/equipe-briefing.jpg`, `${M.eq}/cheffe-portrait.jpg`, `${M.eq}/serveurs-sourires.jpg`].map((src, i) => (
                <Reveal key={src} delay={i * 0.1}>
                  <div className="zoom relative aspect-[3/4] overflow-hidden bg-sand-soft">
                    <Photo d={d} src={src} fillBox sizes="(min-width: 768px) 15vw, 33vw" />
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ——— Ramadan (bannière saisonnière : data/saison.json) ——— */}
      {saison.ramadan.active && (
        <section id="ramadan" className="scroll-mt-20 bg-olive text-cream" aria-labelledby="ramadan-title">
          <div className="arabesque-light">
            <div className="mx-auto grid max-w-[1400px] items-center gap-10 px-5 py-20 md:grid-cols-12 md:px-10 md:py-24">
              <Reveal className="md:col-span-6">
                <Star className="h-10 w-10 text-sand" strokeWidth={1.8} />
                <p className="eyebrow mt-6 !text-sand">{fill(d.ramadan.eyebrow, { year: saison.ramadan.year })}</p>
                <h2 id="ramadan-title" className="display mt-4 text-[2.5rem] md:text-[3.4rem]">
                  {d.ramadan.title}
                </h2>
                <p className="mt-5 max-w-lg text-[1.0625rem] leading-[1.8] text-cream/90">{d.ramadan.text}</p>
                <a href={waLink(d.ramadan.message)} target="_blank" rel="noopener noreferrer" className="btn-line on-dark mt-8">
                  <WhatsAppIcon className="h-4 w-4" />
                  {d.ramadan.cta}
                </a>
              </Reveal>
              <Reveal className="grid grid-cols-2 gap-3 md:col-span-5 md:col-start-8" delay={0.1}>
                <div className="relative aspect-[3/4] overflow-hidden">
                  <Photo d={d} src={`${M.sucre}/chebakia-miel.jpg`} fillBox sizes="(min-width: 768px) 20vw, 50vw" />
                </div>
                <div className="relative mt-10 aspect-[3/4] overflow-hidden">
                  <Photo d={d} src={`${M.sale}/msemen.jpg`} fillBox sizes="(min-width: 768px) 20vw, 50vw" />
                </div>
              </Reveal>
            </div>
          </div>
        </section>
      )}

      {/* ——— Réalisations ——— */}
      <section id="realisations" className="scroll-mt-20 px-5 py-24 md:px-10 md:py-36" aria-labelledby="gallery-title">
        <div className="mx-auto max-w-[1400px]">
          <SectionHead eyebrow={d.gallery.eyebrow} title={d.gallery.title} text={d.gallery.text} center id="gallery-title" />
          <div className="mt-14">
            <Gallery items={gallery} labels={d.gallery} />
          </div>
        </div>
      </section>

      {/* ——— Retours clients ——— */}
      <section id="avis" className="arabesque scroll-mt-20 border-y border-line px-5 py-24 md:px-10 md:py-32" aria-labelledby="reviews-title">
        <div className="mx-auto max-w-[1100px] text-center">
          <SectionHead eyebrow={d.reviews.eyebrow} title={d.reviews.title} center id="reviews-title" />
          {/* À REMPLIR avec les vrais retours de la story « Retours » : data/reviews.json (published: true) */}
          {reviews.length > 0 ? (
            <ul className="mt-14 grid gap-10 md:grid-cols-3">
              {reviews.map((r, i) => (
                <Reveal as="li" key={i} delay={i * 0.1} className="bg-cream p-8 text-start">
                  <HeartIcon className="h-6 w-6 text-gold" />
                  <p className="display mt-5 text-[1.35rem] leading-snug">« {r.text} »</p>
                  <p className="nav-link mt-6 text-muted">
                    {r.author}
                    {r.event ? ` · ${r.event}` : ""}
                  </p>
                </Reveal>
              ))}
            </ul>
          ) : (
            <Reveal delay={0.1}>
              <p className="mx-auto mt-6 max-w-xl text-[1.0625rem] leading-[1.8] text-muted">{d.reviews.text}</p>
            </Reveal>
          )}
          <Reveal delay={0.2}>
            <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="btn-line mt-10">
              <InstagramIcon className="h-4 w-4" />
              {d.reviews.link}
            </a>
          </Reveal>
        </div>
      </section>

      {/* ——— Zone d'intervention ——— */}
      <section id="zone" className="scroll-mt-20 px-5 py-24 md:px-10 md:py-32" aria-labelledby="zone-title">
        <div className="mx-auto grid max-w-[1400px] gap-12 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-6">
            <SectionHead eyebrow={d.zone.eyebrow} title={d.zone.title} text={d.zone.text} id="zone-title" />
          </div>
          <Reveal className="md:col-span-5 md:col-start-8 md:pt-14" delay={0.1}>
            <ul className="divide-y divide-line border-y border-line">
              {site.cities.map((c, i) => (
                <li key={c} className="flex items-baseline justify-between py-4">
                  <span className="display text-[1.5rem]" dir="ltr">
                    {c}
                  </span>
                  <span className="num text-[0.8125rem] text-gold-ink">{String(i + 1).padStart(2, "0")}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-[0.9375rem] text-muted">{d.zone.farther}</p>
          </Reveal>
        </div>
      </section>

      {/* ——— Devis ——— */}
      <section id="contact" className="scroll-mt-20 bg-ivory px-5 py-24 md:px-10 md:py-36" aria-labelledby="quote-title">
        <div className="mx-auto grid max-w-[1400px] gap-16 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <SectionHead eyebrow={d.quote.eyebrow} title={d.quote.title} text={d.quote.text} id="quote-title" />
            <Reveal delay={0.1}>
              <ul className="mt-10 space-y-4 text-[0.9375rem]">
                <li>
                  <a href={`tel:${site.phoneIntl.replace(/\s/g, "")}`} className="inline-flex min-h-10 items-center gap-3 hover:text-gold-ink" dir="ltr">
                    <PhoneIcon className="h-4 w-4" />
                    {site.phone}
                  </a>
                </li>
                <li>
                  <a href={waLink(d.whatsapp.hello)} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center gap-3 hover:text-gold-ink">
                    <WhatsAppIcon className="h-4 w-4" />
                    WhatsApp
                  </a>
                </li>
                <li>
                  <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center gap-3 hover:text-gold-ink">
                    <InstagramIcon className="h-4 w-4" />
                    <span dir="ltr">{site.instagramHandle}</span>
                  </a>
                </li>
              </ul>
              <div className="relative mt-12 hidden aspect-[4/5] max-w-xs overflow-hidden lg:block">
                <Photo d={d} src={`${M.tab}/cheffe-plateaux-soleil.jpg`} fillBox sizes="20rem" />
              </div>
            </Reveal>
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <QuoteForm />
          </div>
        </div>
      </section>
    </>
  );
}
