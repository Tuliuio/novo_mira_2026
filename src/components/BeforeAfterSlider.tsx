import { useCallback, useEffect, useRef, useState } from "react";
import type { HubLogo } from "@/lib/content";

/**
 * Slider de antes/depois — arrasta para revelar a nova versão de um logo
 * (ou qualquer outra comparação de imagem) sobre a antiga.
 */
export function BeforeAfterSlider({
  before,
  after,
  aspect = 16 / 9,
}: {
  before: HubLogo;
  after: HubLogo;
  aspect?: number;
}) {
  const [pos, setPos] = useState(50); // % da largura em que o corte acontece
  const [dragging, setDragging] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);

  const setFromClientX = useCallback((clientX: number) => {
    const el = frameRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const pct = ((clientX - r.left) / r.width) * 100;
    setPos(Math.min(100, Math.max(0, pct)));
  }, []);

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e: PointerEvent) => setFromClientX(e.clientX);
    const onUp = () => setDragging(false);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [dragging, setFromClientX]);

  return (
    <div className="ba">
      <div
        className="ba-frame"
        ref={frameRef}
        style={{ aspectRatio: aspect, background: after.pad }}
        onPointerDown={(e) => {
          setDragging(true);
          setFromClientX(e.clientX);
        }}
      >
        <div className="ba-side ba-after">
          <img src={after.src} alt={after.name} draggable={false} />
        </div>
        <div className="ba-side ba-before" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)`, background: before.pad }}>
          <img src={before.src} alt={before.name} draggable={false} />
        </div>
        <div className="ba-line" style={{ left: `${pos}%` }}>
          <div className="ba-handle" aria-hidden="true">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 6 3 12l5 6M16 6l5 6-5 6" />
            </svg>
          </div>
        </div>
        <span className="ba-tag ba-tag-before" style={{ opacity: pos > 14 ? 1 : 0 }}>Antes</span>
        <span className="ba-tag ba-tag-after" style={{ opacity: pos < 86 ? 1 : 0 }}>Depois</span>
      </div>
      <div className="ba-cap">
        <span><b>{before.name}</b> — {before.role}</span>
        <span className="ba-arrow">→</span>
        <span><b>{after.name}</b> — {after.role}</span>
      </div>
    </div>
  );
}
