import { Link, useParams } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { DEMO_CLIENT, getClient } from "@/lib/content";
import { availableFlat, findPillar } from "@/lib/method";
import { Block } from "./blocks";

export function BrandItemPage() {
  const { pillar: pillarId = "", item: itemId = "" } = useParams();
  const { user } = useAuth();
  const client = getClient(user?.clientSlug) ?? DEMO_CLIENT;
  const pillar = findPillar(pillarId);
  const page = client.pages[itemId];

  // Navegação anterior/próximo só entre os elementos que o cliente possui.
  const flat = availableFlat((id) => id in client.pages);
  const idx = flat.findIndex((f) => f.pillarId === pillarId && f.id === itemId);
  const prev = idx > 0 ? flat[idx - 1] : null;
  const next = idx >= 0 && idx < flat.length - 1 ? flat[idx + 1] : null;

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
        <EmptyState />
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

function EmptyState() {
  return (
    <div className="mt-4">
      <div className="rounded-3xl border border-dashed border-white/15 bg-white/[0.02] px-8 py-14 text-center">
        <p className="text-fog">Este elemento não faz parte do seu Brand System.</p>
        <Link
          to="/app"
          className="mt-3 inline-block text-sm text-accent-300 transition-colors hover:text-accent-200"
        >
          ← Voltar ao início
        </Link>
      </div>
    </div>
  );
}
