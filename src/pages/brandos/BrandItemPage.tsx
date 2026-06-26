import { Link, useParams } from "react-router-dom";
import { DEMO_CLIENT } from "@/lib/content";
import { METHOD, findPillar } from "@/lib/method";
import { Block } from "./blocks";

/** Sequência plana de todos os itens (para navegação anterior/próximo). */
const FLAT = METHOD.flatMap((p) => {
  const items = p.items ?? (p.subgroups ?? []).flatMap((g) => g.items);
  return items.map((it) => ({ pillarId: p.id, id: it.id, label: it.label }));
});

export function BrandItemPage() {
  const { pillar: pillarId = "", item: itemId = "" } = useParams();
  const pillar = findPillar(pillarId);
  const page = DEMO_CLIENT.pages[itemId];

  const idx = FLAT.findIndex((f) => f.pillarId === pillarId && f.id === itemId);
  const prev = idx > 0 ? FLAT[idx - 1] : null;
  const next = idx >= 0 && idx < FLAT.length - 1 ? FLAT[idx + 1] : null;

  return (
    <article>
      <p className="text-sm font-medium text-accent-400">
        {pillar?.number} · {pillar?.label}
      </p>

      {page ? (
        <>
          <h1
            className="mt-2 text-3xl font-bold tracking-tight md:text-4xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {page.title}
          </h1>
          {page.subtitle && <p className="mt-2 text-lg text-fog">{page.subtitle}</p>}

          <div className="mt-8 space-y-7">
            {page.blocks.map((block, i) => (
              <Block key={i} block={block} />
            ))}
          </div>
        </>
      ) : (
        <EmptyState label={FLAT[idx]?.label ?? "Este item"} />
      )}

      {/* Navegação anterior/próximo */}
      <nav className="mt-14 flex items-center justify-between border-t border-white/5 pt-6 text-sm">
        {prev ? (
          <Link
            to={`/app/${prev.pillarId}/${prev.id}`}
            className="group text-fog transition-colors hover:text-cream"
          >
            <span className="block text-xs text-fog/60">Anterior</span>
            <span className="font-medium">← {prev.label}</span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            to={`/app/${next.pillarId}/${next.id}`}
            className="group text-right text-fog transition-colors hover:text-cream"
          >
            <span className="block text-xs text-fog/60">Próximo</span>
            <span className="font-medium">{next.label} →</span>
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </article>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="mt-4">
      <h1
        className="text-3xl font-bold tracking-tight md:text-4xl"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {label}
      </h1>
      <div className="mt-8 rounded-3xl border border-dashed border-white/15 bg-white/[0.02] px-8 py-14 text-center">
        <p className="text-fog">
          Este item ainda está sendo construído pela Mira.
        </p>
        <p className="mt-1 text-sm text-fog/60">
          Em breve ele aparecerá aqui no seu Brand OS.
        </p>
      </div>
    </div>
  );
}
