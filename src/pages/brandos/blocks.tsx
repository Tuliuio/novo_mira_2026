import type { ContentBlock } from "@/lib/content";

/** Renderiza um bloco de conteúdo do Brand OS. */
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
            <div key={c.hex} className="overflow-hidden rounded-2xl border border-white/10">
              <div className="h-20" style={{ background: c.hex }} />
              <div className="bg-white/[0.03] px-4 py-3">
                <p className="text-sm font-medium text-cream">{c.name}</p>
                <p className="font-mono text-xs uppercase text-fog">{c.hex}</p>
                {c.usage && <p className="mt-1 text-xs text-fog/80">{c.usage}</p>}
              </div>
            </div>
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
  }
}
