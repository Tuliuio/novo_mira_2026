import { Children, useCallback, useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Slider horizontal com scroll-snap nativo (o dedo arrasta como no
 * Instagram), setas no desktop e pontos de paginação. Os pontos podem
 * receber uma cor cada (ex.: o fundo de cada variação do logo), aí
 * funcionam também como seletor de cor.
 */
export function Slider({
  children,
  label,
  dots,
  className = "",
}: {
  children: ReactNode;
  label: string;
  /** cor de cada ponto (mesma ordem dos slides); sem isso, pontos neutros */
  dots?: string[];
  className?: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const count = Children.count(children);
  const [index, setIndex] = useState(0);
  const [edges, setEdges] = useState({ start: true, end: count <= 1 });

  const sync = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const slides = Array.from(el.children) as HTMLElement[];
    const left = el.scrollLeft;
    let best = 0, bestD = Infinity;
    slides.forEach((s, i) => {
      const d = Math.abs(s.offsetLeft - el.offsetLeft - left - parseFloat(getComputedStyle(el).scrollPaddingLeft || "0"));
      if (d < bestD) { bestD = d; best = i; }
    });
    const end = left + el.clientWidth >= el.scrollWidth - 4;
    setIndex(end ? slides.length - 1 : best);
    setEdges({ start: left <= 4, end });
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    sync();
    let raf = 0;
    const onScroll = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(sync); };
    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { el.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); cancelAnimationFrame(raf); };
  }, [sync, count]);

  function go(i: number) {
    const el = trackRef.current;
    if (!el) return;
    const target = el.children[Math.min(Math.max(i, 0), count - 1)] as HTMLElement | undefined;
    if (!target) return;
    const pad = parseFloat(getComputedStyle(el).scrollPaddingLeft || "0");
    el.scrollTo({ left: target.offsetLeft - el.offsetLeft - pad, behavior: "smooth" });
  }

  const fits = edges.start && edges.end;

  return (
    <div className={"slider " + className + (fits ? " fits" : "")} role="region" aria-roledescription="carrossel" aria-label={label}>
      <div className="slider-track" ref={trackRef}>
        {Children.map(children, (child, i) => (
          <div className="slide" role="group" aria-roledescription="slide" aria-label={`${i + 1} de ${count}`}>{child}</div>
        ))}
      </div>
      {!fits && (
        <div className="slider-ui">
          <div className="slider-dots" role="tablist" aria-label={label + ": navegação"}>
            {Array.from({ length: count }, (_, i) => (
              <button
                key={i}
                role="tab"
                aria-selected={i === index}
                aria-label={`Ir para ${i + 1} de ${count}`}
                className={"sd" + (i === index ? " on" : "") + (dots ? " colored" : "")}
                style={dots ? { background: dots[i] } : undefined}
                onClick={() => go(i)}
              />
            ))}
          </div>
          <span className="slider-count" aria-hidden="true">{index + 1} / {count}</span>
          <div className="slider-arrows">
            <button className="sa" onClick={() => go(index - 1)} disabled={edges.start} aria-label="Anterior">‹</button>
            <button className="sa" onClick={() => go(index + 1)} disabled={edges.end} aria-label="Próximo">›</button>
          </div>
        </div>
      )}
    </div>
  );
}
