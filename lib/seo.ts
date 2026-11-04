import type { Metadata } from "next";
import site from "@/data/site.json";
import reviewsData from "@/data/reviews.json";
import { categories, menuItems } from "@/lib/catalog";
import { getDict, locales, ogLocale, type Locale } from "@/lib/i18n";
import { itemName } from "@/lib/order";

export function pageMeta(lang: Locale, path: string, title: string, description: string, image = "/og.jpg"): Metadata {
  const languages = Object.fromEntries(locales.map((l) => [l, `/${l}${path}`])) as Record<string, string>;
  languages["x-default"] = `/fr${path}`;
  return {
    title,
    description,
    alternates: { canonical: `/${lang}${path}`, languages },
    openGraph: {
      type: "website",
      siteName: site.name,
      title,
      description,
      url: `/${lang}${path}`,
      locale: ogLocale[lang],
      alternateLocale: locales.filter((l) => l !== lang).map((l) => ogLocale[l]),
      images: [{ url: image, width: 1200, height: 630, alt: getDict(lang).hero.alt }],
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

/** Traiteur (FoodEstablishment + LocalBusiness), sa carte (Menu) et ses services, dans un seul graphe JSON-LD. */
export function homeJsonLd(lang: Locale) {
  const d = getDict(lang);
  const id = `${site.url}/#traiteur`;
  const areaServed = [{ "@type": "AdministrativeArea", name: `${site.region}, Côte d'Azur` }, ...site.cities.map((c) => ({ "@type": "City", name: c }))];
  const reviews = reviewsData.reviews
    .filter((r) => r.published && r.text)
    .map((r) => ({ "@type": "Review", reviewBody: r.text, inLanguage: "fr", author: { "@type": "Person", name: r.author || "Client" } }));
  const menu = {
    "@type": "Menu",
    name: d.menu.title,
    inLanguage: lang,
    hasMenuSection: categories.map((c) => ({
      "@type": "MenuSection",
      name: d.menu.tabs[c],
      hasMenuItem: menuItems
        .filter((it) => it.cat === c)
        .map((it) => {
          const t = d.menu.items[it.id as keyof typeof d.menu.items];
          return {
            "@type": "MenuItem",
            name: itemName(d, it.id),
            description: `${t.desc} ${t.unit}.`,
            image: `${site.url}${it.img}`,
            ...(it.price != null ? { offers: { "@type": "Offer", price: it.price, priceCurrency: "EUR" } } : {}),
          };
        }),
    })),
  };
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["FoodEstablishment", "LocalBusiness"],
        "@id": id,
        additionalType: "https://www.wikidata.org/wiki/Q2252452",
        name: site.name,
        description: d.meta.description,
        slogan: d.hero.title,
        url: `${site.url}/${lang}`,
        image: [`${site.url}/og.jpg`, `${site.url}/media/equipe-coulisses/merci-2025.jpg`],
        logo: `${site.url}/logo.svg`,
        telephone: site.phoneIntl,
        sameAs: [site.instagram],
        servesCuisine: ["Marocaine", "Maghrébine", "Orientale"],
        address: { "@type": "PostalAddress", addressRegion: "Provence-Alpes-Côte d'Azur", addressCountry: "FR" },
        areaServed,
        knowsLanguage: ["fr", "ar", "en"],
        hasMenu: menu,
        acceptsReservations: true,
        contactPoint: { "@type": "ContactPoint", telephone: site.phoneIntl, contactType: "customer service", availableLanguage: ["French", "Arabic", "English"] },
        ...(reviews.length ? { review: reviews } : {}),
      },
      ...d.weddings.points.map((p) => ({ "@type": "Service", name: p.title, description: p.text, serviceType: "Catering", provider: { "@id": id }, areaServed })),
    ],
  };
}

export const jsonLd = (data: object) => ({ __html: JSON.stringify(data).replace(/</g, "\\u003c") });
