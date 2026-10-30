import { useEffect, useState, type ComponentProps } from "react";
import { Link } from "react-router-dom";
import { Logo } from "@/components/Logo";

/** Seções da home — ordem do menu = ordem da página. */
const LINKS = [
  { id: "cases", label: "Cases" },
  { id: "momentos", label: "Serviços" },
  { id: "brand-system", label: "Brand System" },
  { id: "metodo", label: "Método" },
  { id: "contato", label: "Contato" },
];

/** Seta dentro de um círculo — padrão dos botões-pílula. */
export function ArrowDot({ dark = false }: { dark?: boolean }) {
  return (
    <span
      className={`grid size-6 place-items-center rounded-full ${
        dark ? "bg-ink-900 text-cream" : "bg-cream text-ink-900"
      }`}
      aria-hidden="true"
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14M13 6l6 6-6 6" />
      </svg>
    </span>
  );
}

/** Âncora de seção: na home rola a página; fora dela, volta para a home na seção. */
function SectionLink({
  id,
  standalone,
  ...rest
}: { id: string; standalone: boolean } & Omit<ComponentProps<"a">, "href">) {
  return standalone ? <Link to={`/#${id}`} {...rest} /> : <a href={`#${id}`} {...rest} />;
}

/**
 * Menu fixo da home. Transparente sobre o vídeo da abertura; ao rolar ganha
 * fundo de vidro, e troca para o tema claro quando o "mundo branco" passa por
 * baixo dele. Destaca a seção visível no momento.
 *
 * `standalone`: uso fora da home (ex.: diagnósticos). Fundo de vidro fixo e os
 * links levam de volta para a seção correspondente da home.
 */
export function SiteNav({ standalone = false }: { standalone?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [light, setLight] = useState(false); // true = mundo branco por baixo
  const [active, setActive] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
      const world = document.getElementById("mundo");
      setLight(!!world && world.getBoundingClientRect().top < 72);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // seção ativa = a que cruza a faixa central da tela
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    LINKS.forEach((l) => {
      const el = document.getElementById(l.id);
      if (el) io.observe(el);
    });
    const hero = document.getElementById("inicio");
    if (hero) io.observe(hero);
    return () => io.disconnect();
  }, []);

  // trava o scroll do body com o menu mobile aberto
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const shell = light
    ? "border-black/5 bg-white/80 text-ink-900"
    : scrolled || standalone
      ? "border-white/10 bg-ink-950/55 text-cream"
      : "border-transparent bg-transparent text-cream";

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 md:px-5 md:pt-4">
      <div
        className={`mx-auto flex max-w-6xl items-center justify-between gap-4 rounded-full border py-2 pl-6 pr-2 backdrop-blur-md transition-colors duration-500 ${shell}`}
      >
        <SectionLink id="inicio" standalone={standalone} aria-label="Mira, voltar ao início" className="shrink-0">
          <Logo height={20} tone={light ? "dark" : "light"} />
        </SectionLink>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Seções">
          {LINKS.map((l) => {
            const on = active === l.id;
            return (
              <SectionLink
                key={l.id}
                id={l.id}
                standalone={standalone}
                aria-current={on ? "true" : undefined}
                className={`relative rounded-full px-3.5 py-2 text-sm transition-colors ${
                  on ? "font-semibold" : "opacity-70 hover:opacity-100"
                }`}
              >
                {l.label}
                <span
                  className={`absolute inset-x-3.5 -bottom-0.5 h-px bg-accent-500 transition-transform duration-300 ${
                    on ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </SectionLink>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/login"
            className="hidden rounded-full px-3.5 py-2 text-sm opacity-70 transition-opacity hover:opacity-100 sm:inline-block"
          >
            Área do cliente
          </Link>
          <SectionLink
            id="contato"
            standalone={standalone}
            className={`hidden items-center gap-2 rounded-full py-1.5 pl-1.5 pr-4 text-sm font-semibold transition-transform hover:scale-[1.03] sm:inline-flex ${
              light ? "bg-ink-900 text-cream" : "bg-accent-500 text-ink-900"
            }`}
          >
            <ArrowDot dark={!light} />
            Vamos conversar
          </SectionLink>
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Abrir menu"
            aria-expanded={open}
            className="grid size-10 place-items-center rounded-full lg:hidden"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M4 8h16M4 16h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* menu mobile */}
      {open && (
        <div className="fixed inset-0 z-50 flex flex-col bg-ink-950/97 px-6 pb-10 pt-6 text-cream backdrop-blur-md lg:hidden">
          <div className="flex items-center justify-between">
            <Logo height={20} tone="light" />
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Fechar menu"
              className="grid size-10 place-items-center rounded-full border border-white/15"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>
          <nav className="mt-14 flex flex-col" aria-label="Seções">
            {LINKS.map((l, i) => (
              <SectionLink
                key={l.id}
                id={l.id}
                standalone={standalone}
                onClick={() => setOpen(false)}
                className="flex items-baseline gap-4 border-b border-white/10 py-5 text-3xl font-semibold"
                style={{ fontFamily: "var(--font-display)" }}
              >
                <span className="text-xs font-medium tracking-[0.2em] text-accent-400">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {l.label}
              </SectionLink>
            ))}
          </nav>
          <div className="mt-auto flex flex-col gap-3">
            <SectionLink
              id="contato"
              standalone={standalone}
              onClick={() => setOpen(false)}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-accent-500 py-3.5 text-sm font-semibold text-ink-900"
            >
              Vamos conversar
            </SectionLink>
            <Link
              to="/login"
              className="rounded-full border border-white/15 py-3.5 text-center text-sm font-medium"
            >
              Área do cliente
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
