import { useEffect, useRef, useState } from "react";
import { Eyebrow } from "@/components/Eyebrow";
import { ArrowDot } from "@/components/SiteNav";

/** Entregas recentes — vêm primeiro, intercaladas por marca. */
const BRANDS: Record<string, string> = {
  "casa-campo": "Casa Campo",
  aloha: "Aloha",
  oka: "OKA",
  "cruz-de-malta": "Cruz de Malta",
};
const RECENT: [string, number][] = [
  ["cruz-de-malta", 1], ["aloha", 1], ["casa-campo", 1], ["oka", 1],
  ["aloha", 2], ["cruz-de-malta", 2], ["casa-campo", 2], ["oka", 2],
  ["casa-campo", 3], ["oka", 3], ["cruz-de-malta", 3], ["aloha", 3],
  ["casa-campo", 4], ["aloha", 4], ["oka", 4], ["cruz-de-malta", 4],
];

/** Imagens dos cases (em public/cases): recentes + bentos antigos da Mira. */
const IMAGES: { src: string; alt: string }[] = [
  ...RECENT.map(([slug, n]) => ({
    src: `/cases/new-${slug}-${n}.jpg`,
    alt: `${BRANDS[slug]}, aplicação da marca criada pela Mira`,
  })),
  ...Array.from({ length: 49 }, (_, i) => ({
    src: `/cases/case-${String(i + 1).padStart(2, "0")}.png`,
    alt: `Case Mira, peça ${i + 1}`,
  })),
];

/**
 * Galeria de cases — masonry (CSS columns) com revelação dirigida por scroll
 * via IntersectionObserver: cada peça sobe e aparece ao entrar pela base do
 * viewport, fica sólida no centro e sobe + some ao sair pelo topo ("vão
 * subindo e desaparecendo"). Estados em data-state; estilos em index.css.
 */
/** Quantas peças aparecem antes do "Ver todos" — mantém a seção curta. */
const PREVIEW = 12;

export function CasesGallery() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [all, setAll] = useState(false);
  const shown = all ? IMAGES : IMAGES.slice(0, PREVIEW);

  useEffect(() => {
    const root = rootRef.current;
    // Progressive enhancement: sem suporte a IO, os tiles ficam visíveis
    // (default do CSS) — a galeria nunca fica vazia.
    if (!root || typeof IntersectionObserver === "undefined") return;

    let io: IntersectionObserver | null = null;
    let removeWaiters = () => {};

    const setup = () => {
      const tiles = Array.from(root.querySelectorAll<HTMLElement>("[data-tile]"));
      const vh = window.innerHeight;
      // estado inicial por geometria (evita flash); o IO mantém atualizado
      for (const t of tiles) {
        const r = t.getBoundingClientRect();
        t.dataset.state =
          r.top < vh * 0.88 && r.bottom > vh * 0.12 ? "in" : r.top < 0 ? "out" : "pre";
      }
      io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            const el = e.target as HTMLElement;
            el.dataset.state = e.isIntersecting
              ? "in"
              : e.boundingClientRect.top < 0
                ? "out"
                : "pre";
          }
        },
        { rootMargin: "-12% 0px -12% 0px", threshold: 0 },
      );
      tiles.forEach((t) => io!.observe(t));
    };

    if (window.innerWidth > 0) {
      setup();
    } else {
      // viewport degenerado (0px) no mount: espera virar real p/ não esconder nada
      const onReady = () => {
        if (window.innerWidth > 0) {
          removeWaiters();
          setup();
        }
      };
      window.addEventListener("resize", onReady);
      window.addEventListener("scroll", onReady, { passive: true });
      removeWaiters = () => {
        window.removeEventListener("resize", onReady);
        window.removeEventListener("scroll", onReady);
      };
    }

    return () => {
      removeWaiters();
      io?.disconnect();
    };
  }, [all]);

  return (
    <section id="cases" className="relative mx-auto max-w-6xl px-6 pb-12 pt-16 md:pb-20">
      <div className="mb-10 md:mb-12">
        <div>
          <Eyebrow>Cases</Eyebrow>
          <h2
            className="mt-5 max-w-2xl text-balance text-3xl font-bold tracking-tight text-ink-900 md:text-5xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Universos que já ajudamos a construir.
          </h2>
        </div>
      </div>
      <div
        ref={rootRef}
        className="columns-2 [column-gap:1rem] md:columns-3 lg:columns-4"
      >
        {shown.map(({ src, alt }) => (
          <figure key={src} data-tile className="mb-4 break-inside-avoid">
            <img
              src={src}
              alt={alt}
              loading="lazy"
              decoding="async"
              className="block w-full rounded-2xl"
            />
          </figure>
        ))}
      </div>
      {!all && (
        <div className="relative -mt-40 flex justify-center bg-gradient-to-b from-transparent via-white/90 to-white pb-2 pt-32">
          <button
            type="button"
            onClick={() => setAll(true)}
            className="inline-flex items-center gap-2.5 rounded-full bg-ink-900 py-2 pl-2 pr-5 text-sm font-semibold text-cream transition-transform hover:scale-[1.03]"
          >
            <ArrowDot />
            Ver todos os cases ({IMAGES.length})
          </button>
        </div>
      )}
    </section>
  );
}
