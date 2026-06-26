import { useEffect, useRef } from "react";

/** Imagens dos cases (em public/cases). Geradas a partir dos bentos da Mira. */
const IMAGES = Array.from(
  { length: 49 },
  (_, i) => `/cases/case-${String(i + 1).padStart(2, "0")}.png`,
);

/**
 * Galeria de cases — masonry (CSS columns) com revelação dirigida por scroll
 * via IntersectionObserver: cada peça sobe e aparece ao entrar pela base do
 * viewport, fica sólida no centro e sobe + some ao sair pelo topo ("vão
 * subindo e desaparecendo"). Estados em data-state; estilos em index.css.
 */
export function CasesGallery() {
  const rootRef = useRef<HTMLDivElement>(null);

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
  }, []);

  return (
    <section id="cases" className="relative mx-auto max-w-6xl px-6 pb-20 pt-16">
      <div
        ref={rootRef}
        className="columns-2 [column-gap:1rem] md:columns-3 lg:columns-4"
      >
        {IMAGES.map((src, i) => (
          <figure key={src} data-tile className="mb-4 break-inside-avoid">
            <img
              src={src}
              alt={`Case Mira — peça ${i + 1}`}
              loading="lazy"
              decoding="async"
              className="block w-full"
            />
          </figure>
        ))}
      </div>
    </section>
  );
}
