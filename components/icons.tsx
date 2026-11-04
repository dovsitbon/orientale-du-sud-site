type P = { className?: string };
const base = { fill: "none", stroke: "currentColor", strokeWidth: 1, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };

export const PlusIcon = ({ className = "h-4 w-4" }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base} strokeWidth={1.4}>
    <path d="M12 4v16M4 12h16" />
  </svg>
);

export const MinusIcon = ({ className = "h-4 w-4" }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base} strokeWidth={1.4}>
    <path d="M4 12h16" />
  </svg>
);

export const CheckIcon = ({ className = "h-4 w-4" }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base} strokeWidth={1.4}>
    <path d="m4.5 12.5 5 5 10-11" />
  </svg>
);

export const InstagramIcon = ({ className = "h-[18px] w-[18px]" }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" />
  </svg>
);

export const PhoneIcon = ({ className = "h-[18px] w-[18px]" }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M6.6 3.5h2.6l1.4 4.2-2 1.4a11 11 0 0 0 6.3 6.3l1.4-2 4.2 1.4v2.6a1.9 1.9 0 0 1-2 1.9A15.6 15.6 0 0 1 4.6 5.5a1.9 1.9 0 0 1 2-2Z" />
  </svg>
);

export const WhatsAppIcon = ({ className = "h-6 w-6" }: P) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
    <path d="M12.04 2.5a9.45 9.45 0 0 0-8.1 14.33L2.5 21.5l4.8-1.4a9.46 9.46 0 1 0 4.74-17.6Zm0 17.25a7.8 7.8 0 0 1-3.98-1.09l-.29-.17-2.85.83.85-2.78-.19-.3a7.8 7.8 0 1 1 6.46 3.51Zm4.28-5.84c-.23-.12-1.38-.68-1.6-.76-.21-.08-.37-.12-.53.12-.15.23-.6.76-.74.92-.14.15-.27.17-.5.06a6.4 6.4 0 0 1-1.88-1.16 7.06 7.06 0 0 1-1.3-1.62c-.14-.23 0-.36.1-.47.1-.1.23-.27.35-.41.11-.14.15-.23.23-.39.08-.15.04-.29-.02-.4-.06-.12-.53-1.27-.72-1.74-.19-.46-.38-.39-.53-.4h-.45a.86.86 0 0 0-.62.29 2.6 2.6 0 0 0-.81 1.94c0 1.14.83 2.25.95 2.4.12.16 1.64 2.5 3.97 3.5.55.24.99.39 1.32.5.56.17 1.06.15 1.46.09.45-.07 1.38-.56 1.57-1.1.2-.55.2-1.02.14-1.11-.06-.1-.21-.16-.44-.27Z" />
  </svg>
);

export const MenuIcon = ({ className = "h-5 w-5" }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M3.5 8.5h17M3.5 15.5h17" />
  </svg>
);

export const CloseIcon = ({ className = "h-5 w-5" }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="m5.5 5.5 13 13M18.5 5.5l-13 13" />
  </svg>
);

export const ArrowIcon = ({ className = "h-4 w-4 rtl:-scale-x-100" }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M4 12h16M14 6l6 6-6 6" />
  </svg>
);

export const BagIcon = ({ className = "h-[19px] w-[19px]" }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M5 8h14l-1.2 12.5H6.2L5 8Z" />
    <path d="M9 10V6.5a3 3 0 0 1 6 0V10" />
  </svg>
);

/* Petites icônes au trait des stories à la une (cœur, étincelles, rameau d'olivier) */
export const HeartIcon = ({ className = "h-6 w-6" }: P) => (
  <svg viewBox="0 0 32 32" className={className} {...base} strokeWidth={1.2}>
    <path d="M16 26.5S5 19.6 5 12.3A5.4 5.4 0 0 1 16 9.6a5.4 5.4 0 0 1 11 2.7C27 19.6 16 26.5 16 26.5Z" />
  </svg>
);

export const SparkleIcon = ({ className = "h-6 w-6" }: P) => (
  <svg viewBox="0 0 32 32" className={className} {...base} strokeWidth={1.2}>
    <path d="M14 4c.6 5.6 2.4 7.4 8 8-5.6.6-7.4 2.4-8 8-.6-5.6-2.4-7.4-8-8 5.6-.6 7.4-2.4 8-8Z" />
    <path d="M24.5 19c.3 2.6 1.1 3.4 3.5 3.7-2.4.3-3.2 1.1-3.5 3.7-.3-2.6-1.1-3.4-3.5-3.7 2.4-.3 3.2-1.1 3.5-3.7Z" />
  </svg>
);

export const OliveIcon = ({ className = "h-6 w-6" }: P) => (
  <svg viewBox="0 0 32 32" className={className} {...base} strokeWidth={1.2}>
    <path d="M5 27C11 21 17 13 27 5" />
    <path d="M12 19.5c-3.3.1-5.4-1.3-6.3-3.6 3-.6 5.3.6 6.3 3.6ZM17.2 13.6c-.4-3.2.9-5.5 3.2-6.6.8 3-.2 5.4-3.2 6.6ZM20.6 11.5c3.1-.9 5.6 0 6.9 2.1-2.9 1.1-5.4.4-6.9-2.1ZM14.3 17c-.6 3.2-2.5 4.9-5 5.3.2-3 1.9-4.9 5-5.3Z" />
    <ellipse cx="22.5" cy="18.5" rx="2" ry="2.8" transform="rotate(-35 22.5 18.5)" />
  </svg>
);
