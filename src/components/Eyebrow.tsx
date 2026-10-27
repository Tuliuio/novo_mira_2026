import type { ReactNode } from "react";

/** Planetinha (Saturno) — igual às apresentações do Canva da Mira. */
export function PlanetIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="11" r="5.2" />
      <ellipse cx="12" cy="11" rx="10" ry="3.1" transform="rotate(-22 12 11)" />
    </svg>
  );
}

/**
 * Rótulo de seção — padrão único do site: planetinha + fio fino + caixa alta
 * espaçada. `tone="dark"` para fundos escuros (dourado claro).
 */
export function Eyebrow({
  children,
  tone = "light",
  center = false,
}: {
  children: ReactNode;
  tone?: "light" | "dark";
  center?: boolean;
}) {
  return (
    <p
      className={`flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] ${
        tone === "dark" ? "text-accent-400" : "text-gold-700"
      } ${center ? "justify-center" : ""}`}
    >
      <PlanetIcon size={15} />
      <span className="h-px w-8 bg-current opacity-50" />
      {children}
    </p>
  );
}
