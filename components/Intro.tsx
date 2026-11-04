"use client";

import { useEffect, useState, type CSSProperties } from "react";
import logo from "@/data/logo.json";

const KEY = "ods-intro";
// Pétales de bougainvillier et feuilles de menthe : position de départ (% écran), rotation, délai (s), forme
const FALLING = [
  [14, 18, 20, 0.9, "petal"],
  [82, 12, -30, 1.05, "leaf"],
  [70, 70, 45, 1.15, "petal"],
  [24, 76, -12, 1.2, "leaf"],
  [90, 46, 70, 1.0, "petal"],
] as const;

const at = (d: number) => ({ "--d": `${d}s` }) as CSSProperties;

/**
 * Ouverture (2 s, une fois par session) : fond sable doré au filigrane d'étoiles,
 * l'étoile marocaine se trace au trait blanc, « L'Orientale du Sud » s'écrit lettre par lettre,
 * une lumière chaude de fin de journée glisse sur l'écran avec quelques pétales, puis fondu sur le hero.
 * Tout est en CSS (globals.css) : l'animation démarre dès le premier rendu, sans attendre le JavaScript.
 */
export function Intro({ skipLabel }: { skipLabel: string }) {
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const done = () => {
      try {
        sessionStorage.setItem(KEY, "1");
      } catch {}
      document.documentElement.classList.add("intro-seen");
    };
    const t = setTimeout(done, 2300);
    return () => clearTimeout(t);
  }, []);

  if (gone) return null;
  const n = logo.glyphs.length;

  return (
    <div className="intro-curtain arabesque-light flex flex-col items-center justify-center gap-7 overflow-hidden text-white">
      <span aria-hidden="true" className="intro-sweep" />
      {FALLING.map(([x, y, r, delay, kind]) => (
        <span key={`${x}-${y}`} aria-hidden="true" className={`intro-fall intro-${kind}`} style={{ left: `${x}%`, top: `${y}%`, "--r": `${r}deg`, ...at(delay) } as CSSProperties} />
      ))}
      <svg viewBox="0 0 100 100" className="relative w-[min(22vw,92px)]" aria-hidden="true">
        <path className="intro-draw" style={{ ...at(0.05), "--t": "0.65s" } as CSSProperties} pathLength={1} d={logo.star} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />
        <path className="intro-draw" style={{ ...at(0.4), "--t": "0.45s" } as CSSProperties} pathLength={1} d={logo.starInner} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      </svg>
      <svg viewBox={logo.markViewBox} className="relative w-[min(78vw,440px)]" aria-hidden="true">
        {logo.glyphs.map((g, i) => (
          <path key={i} className="intro-pen" style={at(0.35 + (i / n) * 0.6)} pathLength={1} d={g} fill="currentColor" stroke="currentColor" strokeWidth="2.4" />
        ))}
      </svg>
      <button
        type="button"
        onClick={() => {
          try {
            sessionStorage.setItem(KEY, "1");
          } catch {}
          document.documentElement.classList.add("intro-seen");
          setGone(true);
        }}
        className="nav-link absolute end-4 bottom-4 min-h-11 px-4 text-ink transition-opacity hover:opacity-70"
      >
        {skipLabel}
      </button>
    </div>
  );
}
