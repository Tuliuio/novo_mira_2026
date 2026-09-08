import { useState } from "react";
import type { ContentBlock } from "@/lib/content";

/** Renderiza um bloco de conteúdo do Brand System. */
export function Block({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case "lead":
      return <p className="text-xl font-medium leading-relaxed text-cream">{block.text}</p>;

    case "paragraph":
      return <p className="leading-relaxed text-fog">{block.text}</p>;

    case "list":
      return (
        <ul className="space-y-3">
          {block.items.map((item, i) => (
            <li key={i} className="flex gap-3 text-fog">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent-500" />
              <span className="leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      );

    case "quote":
      return (
        <blockquote className="rounded-2xl border-l-2 border-accent-500 bg-white/[0.03] px-6 py-5">
          <p
            className="text-2xl font-semibold leading-snug text-cream"
            style={{ fontFamily: "var(--font-display)" }}
          >
            “{block.text}”
          </p>
          {block.author && <cite className="mt-2 block text-sm not-italic text-fog">— {block.author}</cite>}
        </blockquote>
      );

    case "stat":
      return (
        <div className="grid gap-3 sm:grid-cols-3">
          {block.items.map((s, i) => (
            <div key={i} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-xs font-medium uppercase tracking-wider text-accent-400">{s.label}</p>
              <p className="mt-1 text-sm text-cream">{s.value}</p>
            </div>
          ))}
        </div>
      );

    case "colors":
      return (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {block.colors.map((c) => (
            <ColorSwatch key={c.hex} color={c} />
          ))}
        </div>
      );

    case "type":
      return (
        <div className="space-y-3">
          {block.fonts.map((f) => (
            <div key={f.name} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <div className="flex items-baseline justify-between">
                <p className="text-sm font-medium text-cream">{f.name}</p>
                <p className="text-xs text-fog">{f.role}</p>
              </div>
              <p
                className="mt-2 text-3xl text-cream"
                style={{ fontFamily: f.name === "Inter" ? "var(--font-sans)" : "var(--font-display)" }}
              >
                {f.preview}
              </p>
            </div>
          ))}
        </div>
      );

    case "image":
      return (
        <figure>
          <DriveImage src={block.src} alt={block.alt} contain={block.contain} />
          {block.caption && (
            <figcaption className="mt-2 text-center text-xs text-fog/70">{block.caption}</figcaption>
          )}
        </figure>
      );

    case "gallery":
      return (
        <div className="grid gap-3 sm:grid-cols-3">
          {block.images.map((img, i) => (
            <DriveImage key={i} src={img.src} alt={img.alt} contain />
          ))}
        </div>
      );

    case "files":
      return (
        <ul className="grid gap-2 sm:grid-cols-2">
          {block.files.map((f, i) => (
            <li key={i}>
              <a
                href={f.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 transition-colors hover:border-accent-500/30 hover:bg-white/[0.05]"
              >
                {f.kind && (
                  <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-accent-500/15 text-[10px] font-bold uppercase tracking-wide text-accent-300">
                    {f.kind}
                  </span>
                )}
                <span className="min-w-0 flex-1 truncate text-sm text-cream">{f.name}</span>
                <span className="shrink-0 text-fog" aria-hidden>
                  ↓
                </span>
              </a>
            </li>
          ))}
        </ul>
      );

    case "embed":
      return (
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
          <iframe
            src={block.src}
            title={block.title}
            className="aspect-[4/3] w-full"
            allow="autoplay"
          />
        </div>
      );
  }
}

/** Copia texto para a área de transferência, com fallback para contextos restritos. */
async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* cai no fallback abaixo */
  }
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    ta.remove();
    return ok;
  } catch {
    return false;
  }
}

/** Amostra de cor clicável — copia o hexadecimal para a área de transferência. */
function ColorSwatch({ color }: { color: { name: string; hex: string; usage?: string } }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    if (await copyText(color.hex)) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      title={`Copiar ${color.hex}`}
      className="group overflow-hidden rounded-2xl border border-white/10 text-left transition-colors hover:border-accent-500/40"
    >
      <div className="h-20" style={{ background: color.hex }} />
      <div className="bg-white/[0.03] px-4 py-3">
        <p className="text-sm font-medium text-cream">{color.name}</p>
        <p className="flex items-center gap-1.5 font-mono text-xs uppercase text-fog">
          {copied ? (
            <span className="text-accent-300">Copiado!</span>
          ) : (
            <>
              {color.hex}
              <span className="opacity-0 transition-opacity group-hover:opacity-70" aria-hidden>
                ⧉
              </span>
            </>
          )}
        </p>
        {color.usage && <p className="mt-1 text-xs text-fog/80">{color.usage}</p>}
      </div>
    </button>
  );
}

/**
 * Imagem servida pelo Google Drive. Se o arquivo ainda não estiver
 * compartilhado publicamente (ou falhar), mostra um fallback elegante
 * com link para abrir no Drive — nunca uma imagem quebrada.
 */
function DriveImage({ src, alt, contain }: { src: string; alt: string; contain?: boolean }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <a
        href={src}
        target="_blank"
        rel="noopener noreferrer"
        className="grid aspect-video place-items-center rounded-2xl border border-dashed border-white/15 bg-white/[0.02] p-6 text-center transition-colors hover:border-accent-500/30"
      >
        <span className="text-sm text-fog">{alt}</span>
        <span className="mt-1 text-xs text-fog/60">Abrir no Drive ↗</span>
      </a>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={`w-full rounded-2xl border border-white/10 ${
        contain ? "bg-white/[0.03] object-contain p-6" : "object-cover"
      }`}
    />
  );
}
