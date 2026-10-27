import type { ReactNode } from "react";
import { Eyebrow } from "@/components/Eyebrow";

// TODO(Tom): textos provisórios — confirmar momentos e nomes de produto reais.
const MOMENTS: {
  n: string;
  title: string;
  product: string;
  text: string;
  icon: ReactNode;
}[] = [
  {
    n: "01",
    title: "Criar uma marca do zero",
    product: "Brand System completo",
    text: "Sua marca está nascendo. Essência, narrativa e identidade visual saem do mesmo raciocínio e chegam juntas.",
    icon: (
      // estrela nascendo
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M12 8.5 13.2 10.8 15.5 12 13.2 13.2 12 15.5 10.8 13.2 8.5 12 10.8 10.8Z" />
    ),
  },
  {
    n: "02",
    title: "Reposicionar ou renovar a marca",
    product: "Rebranding",
    text: "Sua marca cresceu e a imagem ficou para trás. Revisamos essência e expressão, preservando o que já é reconhecido.",
    icon: (
      // ciclo
      <>
        <path d="M20 11a8 8 0 0 0-14.6-4.5L4 8" />
        <path d="M4 4v4h4" />
        <path d="M4 13a8 8 0 0 0 14.6 4.5L20 16" />
        <path d="M20 20v-4h-4" />
      </>
    ),
  },
  {
    n: "03",
    title: "Manter a marca viva e consistente",
    product: "Brand System contínuo",
    text: "Sua marca está no mercado e precisa de peças, campanhas e aplicações à altura. O Brand System cresce junto.",
    icon: (
      // órbita
      <>
        <circle cx="12" cy="12" r="3" />
        <ellipse cx="12" cy="12" rx="9.5" ry="4" transform="rotate(-30 12 12)" />
      </>
    ),
  },
];

/** "Em que momento sua marca está?" — serviços organizados pelo momento do cliente. */
export function Moments() {
  return (
    <section id="momentos" className="border-t border-black/5 bg-white py-24">
      <div className="mx-auto max-w-6xl px-6">
        <Eyebrow>Serviços</Eyebrow>
        <h2
          className="mt-5 max-w-3xl text-balance text-3xl font-bold tracking-tight text-ink-900 md:text-5xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Em que momento sua marca está?
        </h2>
        <p className="mt-5 max-w-2xl text-balance text-lg text-stone-500">
          Cada projeto começa de onde a sua marca está agora. O ponto de
          chegada é sempre o mesmo: um Brand System vivo, feito só para ela.
        </p>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {MOMENTS.map((m) => (
            <article
              key={m.n}
              className="group flex flex-col rounded-3xl border border-black/10 bg-paper p-8 transition-all duration-300 hover:-translate-y-1 hover:border-accent-500/50 hover:shadow-[0_18px_40px_-24px_rgba(20,18,16,0.35)]"
            >
              <svg
                width="34"
                height="34"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-ink-900"
                aria-hidden="true"
              >
                {m.icon}
              </svg>
              <p className="mt-8 text-xs font-semibold uppercase tracking-[0.22em] text-gold-700">
                Momento {m.n}
              </p>
              <h3
                className="mt-3 text-balance text-2xl font-semibold leading-tight text-ink-900"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {m.title}
              </h3>
              <p className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-stone-400">
                {m.product}
              </p>
              <p className="mt-5 flex-1 text-[15px] leading-relaxed text-stone-600">{m.text}</p>
              <a
                href="#contato"
                className="mt-8 inline-flex items-center gap-1.5 text-sm font-semibold text-gold-700 transition-colors hover:text-ink-900"
              >
                Conversar sobre isso
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
