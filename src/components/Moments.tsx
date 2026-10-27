import type { ReactNode } from "react";
import { Eyebrow } from "@/components/Eyebrow";
import { ArrowDot } from "@/components/SiteNav";

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
    <section id="momentos" className="border-t border-black/5 bg-white py-16 md:py-24">
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

        {/* cards empilháveis: cada um gruda no topo e o próximo sobe por cima */}
        <div className="mt-10 flex flex-col gap-4 md:mt-14 md:gap-8">
          {MOMENTS.map((m, i) => {
            const dark = i === MOMENTS.length - 1;
            return (
              <article
                key={m.n}
                className={`group grid gap-8 rounded-[1.75rem] border p-6 shadow-[0_-12px_40px_-28px_rgba(20,18,16,0.35)] md:sticky md:min-h-[300px] md:grid-cols-[1fr_1.1fr] md:gap-14 md:p-12 ${
                  dark
                    ? "border-white/10 bg-ink-900 text-cream"
                    : i === 0
                      ? "border-black/10 bg-paper text-ink-900"
                      : "border-black/10 bg-[#f1ead8] text-ink-900"
                }`}
                style={{ top: `${104 + i * 22}px` }}
              >
                <div className="flex flex-col">
                  <div className="flex items-center gap-4">
                    <svg
                      width="34"
                      height="34"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      {m.icon}
                    </svg>
                    <p
                      className={`text-xs font-semibold uppercase tracking-[0.22em] ${
                        dark ? "text-accent-400" : "text-gold-700"
                      }`}
                    >
                      Momento {m.n}
                    </p>
                  </div>
                  <h3
                    className="mt-6 text-balance text-[1.7rem] font-semibold leading-tight md:mt-8 md:text-4xl"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {m.title}
                  </h3>
                </div>
                <div className="flex flex-col md:pt-1">
                  <p
                    className={`text-xs font-semibold uppercase tracking-[0.18em] ${
                      dark ? "text-fog" : "text-stone-400"
                    }`}
                  >
                    {m.product}
                  </p>
                  <p
                    className={`mt-3 flex-1 text-base leading-relaxed md:mt-4 md:text-lg ${
                      dark ? "text-cream/75" : "text-stone-600"
                    }`}
                  >
                    {m.text}
                  </p>
                  <a
                    href="#contato"
                    className={`mt-6 inline-flex w-fit items-center gap-2.5 rounded-full py-2 pl-2 pr-4 md:mt-8 text-sm font-semibold transition-transform hover:scale-[1.03] ${
                      dark ? "bg-accent-500 text-ink-900" : "bg-ink-900 text-cream"
                    }`}
                  >
                    <ArrowDot dark={dark} />
                    Conversar sobre isso
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
