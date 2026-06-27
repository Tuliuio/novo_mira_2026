import { useEffect, useRef, type ReactNode } from "react";

interface ScrollVideoProps {
  src: string;
  poster?: string;
  /** altura da trilha de scroll em vh (maior = scrub mais lento/cinematográfico) */
  trackVh?: number;
  /** conteúdo sobreposto (some conforme a descida avança) */
  children?: ReactNode;
}

/**
 * Vídeo travado no topo (sticky, fullscreen, sem controles).
 *
 * Desktop: o tempo do vídeo é dirigido pelo scroll (scrub quadro a quadro).
 * Mobile (pointer coarse): o iOS não renderiza frames via `currentTime` sem
 * um play por gesto (dá tela preta), então o vídeo TOCA sozinho (autoplay
 * mudo inline + loop) como abertura — o conteúdo ainda some no scroll.
 */
export function ScrollVideo({ src, poster, trackVh = 300, children }: ScrollVideoProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    const video = videoRef.current;
    const overlay = overlayRef.current;
    if (!track || !video) return;

    // progresso (0..1) do scroll dentro da trilha
    const progress = () => {
      const total = track.offsetHeight - window.innerHeight;
      if (total <= 0) return 0;
      const scrolled = -track.getBoundingClientRect().top;
      return Math.min(1, Math.max(0, scrolled / total));
    };
    const fadeOverlay = (p: number) => {
      if (!overlay) return;
      overlay.style.opacity = String(Math.max(0, 1 - p * 1.7));
      overlay.style.transform = `translateY(${p * -48}px)`;
    };

    const coarse =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(hover: none) and (pointer: coarse)").matches;

    /* ---------- Mobile: autoplay (evita frame preto do scrub no iOS) ------- */
    if (coarse) {
      video.loop = true;
      video.muted = true;
      const play = () => video.play().catch(() => {});
      play();
      const onTouch = () => {
        play();
        window.removeEventListener("touchstart", onTouch);
      };
      window.addEventListener("touchstart", onTouch, { passive: true });
      const onScrollM = () => fadeOverlay(progress());
      window.addEventListener("scroll", onScrollM, { passive: true });
      onScrollM();
      return () => {
        window.removeEventListener("scroll", onScrollM);
        window.removeEventListener("touchstart", onTouch);
      };
    }

    /* ---------- Desktop: scroll-scrubbing -------------------------------- */
    let raf = 0;
    let target = 0;

    const tick = () => {
      raf = 0;
      const dur = video.duration;
      if (!dur || !isFinite(dur)) return;
      const cur = video.currentTime;
      const diff = target - cur;
      if (Math.abs(diff) > 0.015) {
        try {
          video.currentTime = cur + diff * 0.2; // easing → scrub suave
        } catch {
          /* seek ainda não disponível */
        }
        raf = requestAnimationFrame(tick);
      } else {
        try {
          video.currentTime = target;
        } catch {
          /* noop */
        }
      }
    };

    const onScroll = () => {
      const p = progress();
      target = p * (video.duration || 0);
      fadeOverlay(p);
      if (!raf) raf = requestAnimationFrame(tick);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    video.addEventListener("loadedmetadata", onScroll);
    video.addEventListener("loadeddata", onScroll);
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      video.removeEventListener("loadedmetadata", onScroll);
      video.removeEventListener("loadeddata", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section ref={trackRef} className="relative" style={{ height: `${trackVh}vh` }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-ink-950">
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          muted
          playsInline
          preload="auto"
          tabIndex={-1}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        />
        {children && (
          <div ref={overlayRef} className="absolute inset-0 z-10">
            {children}
          </div>
        )}
      </div>
    </section>
  );
}
