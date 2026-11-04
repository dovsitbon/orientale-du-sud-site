import logo from "@/data/logo.json";

/**
 * Logo de L'Orientale du Sud redessiné en tracés (scripts/logo.py) d'après leur logo Instagram :
 * le nom en lettres à empattements doux, sur un disque sable doré à motif d'étoiles entrelacées.
 * Le nom seul suit `currentColor` (header, pied de page).
 */
export function Wordmark({ className = "", title }: { className?: string; title?: string }) {
  return (
    <svg viewBox={logo.markViewBox} className={className} role={title ? "img" : undefined} aria-label={title} aria-hidden={title ? undefined : true}>
      <g fill="currentColor" stroke="currentColor" strokeWidth="2.4">
        {logo.glyphs.map((g, i) => (
          <path key={i} d={g} />
        ))}
      </g>
    </svg>
  );
}

/** Version complète : disque sable doré, filigrane d'étoiles et nom en blanc. */
export function LogoDisc({ className = "", title }: { className?: string; title?: string }) {
  return (
    <div className={`arabesque-light flex aspect-square items-center justify-center rounded-full bg-sand text-white ${className}`} role={title ? "img" : undefined} aria-label={title}>
      <Wordmark className="w-[76%]" />
    </div>
  );
}

/** Étoile marocaine au trait (khatam), reprise des stories à la une. */
export function Star({ className = "", strokeWidth = 2.2 }: { className?: string; strokeWidth?: number }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <path d={logo.star} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinejoin="round" />
      <path d={logo.starInner} fill="none" stroke="currentColor" strokeWidth={strokeWidth * 0.8} strokeLinejoin="round" />
    </svg>
  );
}
