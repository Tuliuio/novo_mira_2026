import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { CasesGallery } from "@/components/CasesGallery";
import { ScrollVideo } from "@/components/ScrollVideo";
import { METHOD } from "@/lib/method";

export function Home() {
  return (
    <div className="min-h-screen bg-ink-900">
      <Nav />
      {/* Abertura — vídeo de descida do espaço, scrubado pelo scroll */}
      <ScrollVideo src="/descent.mp4" poster="/descent-poster.jpg" trackVh={300}>
        <HeroContent />
      </ScrollVideo>
      {/* Mundo "solo" — branco. Sobe POR CIMA do vídeo ainda travado (margem
          negativa), então os cases entram antes do vídeo terminar. */}
      <div className="relative z-10 -mt-[130vh] bg-white text-ink-900">
        {/* borda suave de emergência: o vídeo desbota no branco */}
        <div className="pointer-events-none absolute inset-x-0 -top-[20vh] h-[20vh] bg-gradient-to-b from-transparent to-white" />
        <CasesGallery />
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

/* --------------------------------------------------------------- Nav */
function Nav() {
  const [light, setLight] = useState(false); // true = mundo branco (solo)
  useEffect(() => {
    const onScroll = () => setLight(window.scrollY > window.innerHeight * 1.7);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        light ? "text-ink-900" : "text-cream"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Logo height={24} tone={light ? "dark" : "light"} />
        <nav className="hidden items-center gap-8 text-sm opacity-80 md:flex">
          <a href="#cases" className="transition-opacity hover:opacity-100">Cases</a>
        </nav>
        <Link
          to="/login"
          aria-label="Área do cliente"
          title="Área do cliente"
          className="inline-flex items-center justify-center rounded-full border border-accent-500/40 bg-accent-500/10 p-2.5 text-gold-700 transition-colors hover:bg-accent-500/20"
        >
          <RocketIcon />
        </Link>
      </div>
    </header>
  );
}

/* ------------------------------------------------- Conteúdo do reader */
function HeroContent() {
  return (
    <div className="relative flex h-full flex-col items-center justify-center px-6 text-center text-cream">
      {/* scrim sutil para legibilidade sobre o vídeo */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink-950/50 via-transparent to-ink-950/40" />
      <div className="relative max-w-3xl">
        <span className="inline-flex items-center gap-2 rounded-full border border-accent-500/30 bg-ink-950/40 px-4 py-1.5 text-xs font-medium tracking-wide text-accent-300 backdrop-blur-sm">
          <span className="size-1.5 rounded-full bg-accent-500" />
          Brand studio · desde 2020 · +300 marcas
        </span>
        <h1
          className="mx-auto mt-7 max-w-3xl text-balance text-4xl font-bold leading-[1.05] tracking-tight drop-shadow-[0_2px_24px_rgba(0,0,0,0.5)] md:text-6xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Cada marca é um universo
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-balance text-lg text-cream/80 drop-shadow-[0_2px_16px_rgba(0,0,0,0.5)]">
          A Mira constrói marcas com método e profundidade, da essência à
          expressão, e entrega tudo num Brand OS vivo.
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
        <p className="mt-14 text-xs uppercase tracking-[0.3em] text-cream/50">
          role para descer ↓
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------ Method */
function Method() {
  return (
    <section id="metodo" className="border-t border-black/5 bg-white py-24">
      <div className="mx-auto max-w-6xl px-6">
        <p className="text-sm font-medium text-gold-700">Método Mira</p>
        <h2
          className="mt-1 max-w-2xl text-balance text-2xl font-bold tracking-tight text-ink-900 md:text-4xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Três camadas para construir uma marca, da essência à expressão.
        </h2>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {METHOD.map((p) => (
            <div
              key={p.id}
              className="rounded-3xl border border-black/10 bg-paper p-7 shadow-sm transition-colors hover:border-accent-500/50"
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
    <section id="contato" className="bg-white px-6 pb-24 pt-4">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2.5rem] bg-ink-900 px-8 py-16 text-center text-cream">
        <div className="starfield pointer-events-none absolute inset-0 opacity-50" />
        <div className="relative">
          <p className="text-sm font-medium tracking-wide text-accent-400">
            Brand studio · Florianópolis, Brasil
          </p>
          <h2
            className="mx-auto mt-3 max-w-2xl text-balance text-3xl font-bold tracking-tight md:text-5xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Vamos construir a sua marca juntos?
          </h2>
          <p className="mx-auto mt-4 max-w-md text-fog">
            Conte sua ideia pra gente. A Mira dá à sua marca essência, narrativa
            e expressão, tudo num Brand OS vivo.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <a
              href="mailto:contato@somosmira.com.br?subject=Quero%20construir%20minha%20marca%20com%20a%20Mira"
              className="inline-flex items-center gap-2 rounded-full bg-accent-500 px-7 py-3 text-sm font-semibold text-ink-900 transition-transform hover:scale-[1.03]"
            >
              Iniciar um projeto
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
        <Logo height={26} tone="dark" />
        <div className="flex flex-col items-center gap-1 md:items-start">
          <a href="https://somosmira.com.br" className="transition-colors hover:text-ink-900">
            somosmira.com.br
          </a>
          <a href="https://instagram.com/somos.mira" className="transition-colors hover:text-ink-900">
            @somos.mira
          </a>
          <span>Campeche · Florianópolis · BR</span>
        </div>
        <div className="flex flex-col items-center gap-1 md:items-end">
          <Link to="/login" className="text-gold-700 transition-colors hover:text-ink-900">
            Acessar Brand OS →
          </Link>
          <span>© {new Date().getFullYear()} Mira Brand Studio</span>
        </div>
      </div>
    </footer>
  );
}
