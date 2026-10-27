import { Link } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { CasesGallery } from "@/components/CasesGallery";
import { ScrollVideo } from "@/components/ScrollVideo";
import { BrandSystemSection } from "@/components/BrandSystemSection";
import { Eyebrow } from "@/components/Eyebrow";
import { Moments } from "@/components/Moments";
import { SiteNav } from "@/components/SiteNav";
import { SplitFlap } from "@/components/SplitFlap";
import { METHOD, pillarItems } from "@/lib/method";

export function Home() {
  return (
    <div className="min-h-screen bg-ink-900">
      <SiteNav />
      {/* Abertura — vídeo de descida do espaço, scrubado pelo scroll */}
      <div id="inicio">
        <ScrollVideo src="/descent.mp4" poster="/descent-poster.jpg" trackVh={300}>
          <HeroContent />
        </ScrollVideo>
      </div>
      {/* Mundo "solo" — branco. Sobe POR CIMA do vídeo ainda travado (margem
          negativa), então os cases entram antes do vídeo terminar. */}
      <div id="mundo" className="relative z-10 -mt-[130vh] bg-white text-ink-900">
        {/* borda suave de emergência: o vídeo desbota no branco */}
        <div className="pointer-events-none absolute inset-x-0 -top-[20vh] h-[20vh] bg-gradient-to-b from-transparent to-white" />
        <CasesGallery />
        <Moments />
        <BrandSystemSection />
        <Method />
        <CTA />
      </div>
      <Footer />
    </div>
  );
}

/** Foguetinho flat — indica o acesso/login. */
function RocketIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 13a8 8 0 0 1 7 7a6 6 0 0 0 3 -5a9 9 0 0 0 6 -8a3 3 0 0 0 -3 -3a9 9 0 0 0 -8 6a6 6 0 0 0 -5 3" />
      <path d="M7 14a6 6 0 0 0 -3 6a6 6 0 0 0 6 -3" />
      <circle cx="15" cy="9" r="1" />
    </svg>
  );
}

/* ------------------------------------------------- Conteúdo do reader */
function HeroContent() {
  return (
    <div className="relative flex h-full flex-col items-center justify-center px-6 text-center text-cream">
      {/* scrim para legibilidade sobre o vídeo: escurece tudo e reforça o centro, atrás do texto */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink-950/70 via-ink-950/45 to-ink-950/65" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(0,0,0,0.45),transparent_75%)]" />
      <div className="relative max-w-4xl">
        <h1
          aria-label="Cada marca é um universo"
          className="mx-auto max-w-4xl text-[2.6rem] uppercase leading-[0.95] tracking-[-0.03em] drop-shadow-[0_2px_24px_rgba(0,0,0,0.5)] sm:text-6xl md:text-7xl lg:text-[5.5rem]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          <span aria-hidden="true" className="block text-[1.9rem] font-light sm:text-[length:inherit]">
            Cada marca é um
          </span>
          <span className="mt-1 block text-[3.3rem] font-bold sm:mt-0 sm:text-[length:inherit]">
            <SplitFlap word="UNIVERSO" />
          </span>
        </h1>
        <p className="mx-auto mt-8 max-w-xl text-balance text-lg text-cream/80 drop-shadow-[0_2px_16px_rgba(0,0,0,0.5)]">
          A Mira constrói marcas com método e profundidade, da essência à
          expressão, e entrega tudo isso em um Brand System digital e
          exclusivo.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <a
            href="#contato"
            className="rounded-full bg-accent-500 px-6 py-3 text-sm font-semibold text-ink-900 transition-transform hover:scale-[1.03]"
          >
            Começar um projeto
          </a>
          <a
            href="#cases"
            className="rounded-full border border-white/25 bg-white/5 px-6 py-3 text-sm font-medium text-cream backdrop-blur-sm transition-colors hover:bg-white/10"
          >
            Ver cases
          </a>
        </div>
        <p className="mt-12 text-xs uppercase tracking-[0.3em] text-cream/50">
          role para descer ↓
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------ Method */
function Method() {
  return (
    <section id="metodo" className="border-t border-black/5 bg-white py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <Eyebrow>Método Mira</Eyebrow>
        <h2
          className="mt-5 max-w-2xl text-balance text-[1.7rem] font-bold leading-tight tracking-tight text-ink-900 md:text-4xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Três camadas para construir uma marca, da essência à expressão.
        </h2>
        <div className="mt-10 grid gap-4 md:mt-12 md:grid-cols-3 md:gap-5">
          {METHOD.map((p) => (
            <div
              key={p.id}
              className="rounded-3xl border border-black/10 bg-paper p-6 shadow-sm md:p-7 transition-colors hover:border-accent-500/50"
            >
              <span
                className="text-5xl font-bold text-accent-500"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {p.number}
              </span>
              <h3
                className="mt-4 text-xl font-semibold text-ink-900"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {p.label}
              </h3>
              <p className="mt-2 text-sm text-stone-500">{p.tagline}</p>
              <ul className="mt-6 flex flex-wrap gap-1.5 border-t border-black/5 pt-5">
                {pillarItems(p)
                  .filter((it) => !it.optional)
                  .map((it) => (
                    <li
                      key={it.id}
                      className="rounded-full border border-black/10 bg-white px-2.5 py-1 text-xs text-stone-600"
                    >
                      {it.label}
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- CTA */
function CTA() {
  return (
    <section id="contato" className="bg-white px-4 pb-16 pt-4 sm:px-6 md:pb-24">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-ink-900 px-6 py-14 text-center md:rounded-[2.5rem] md:px-8 md:py-16 text-cream">
        <div className="starfield pointer-events-none absolute inset-0 opacity-50" />
        <div className="relative">
          <Eyebrow tone="dark" center>
            Brand Studio
          </Eyebrow>
          <h2
            className="mx-auto mt-5 max-w-2xl text-balance text-3xl font-bold tracking-tight md:text-5xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Vamos construir a sua marca juntos?
          </h2>
          <p className="mx-auto mt-4 max-w-md text-fog">
            Conte sua ideia pra gente. A Mira dá à sua marca essência, narrativa
            e expressão, tudo num Brand System digital e exclusivo.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <a
              href="mailto:contato@somosmira.com.br?subject=Quero%20construir%20minha%20marca%20com%20a%20Mira"
              className="inline-flex items-center gap-2 rounded-full bg-accent-500 px-7 py-3 text-sm font-semibold text-ink-900 transition-transform hover:scale-[1.03]"
            >
              Começar um projeto
              <RocketIcon />
            </a>
            <a
              href="https://wa.me/5548984291699"
              className="rounded-full border border-white/20 bg-white/5 px-7 py-3 text-sm font-medium text-cream backdrop-blur-sm transition-colors hover:bg-white/10"
            >
              Falar no WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- Footer */
function Footer() {
  return (
    <footer className="bg-white text-ink-900">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 border-t border-black/5 px-6 py-12 text-sm text-stone-500 md:flex-row md:items-end">
        <Logo height={34} tone="dark" />
        <div className="flex flex-col items-center gap-1 md:items-start">
          <a href="https://somosmira.com.br" className="py-1.5 transition-colors md:py-0 hover:text-ink-900">
            somosmira.com.br
          </a>
          <a href="https://instagram.com/somos.mira" className="py-1.5 transition-colors md:py-0 hover:text-ink-900">
            @somos.mira
          </a>
          <span>Campeche · Florianópolis · BR</span>
        </div>
        <div className="flex flex-col items-center gap-1 md:items-end">
          <Link to="/login" className="py-1.5 text-gold-700 transition-colors md:py-0 hover:text-ink-900">
            Acessar Brand System →
          </Link>
          <span>© {new Date().getFullYear()} Mira Brand Studio</span>
        </div>
      </div>
    </footer>
  );
}
