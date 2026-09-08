import { Link } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { DEMO_CLIENT, getClient } from "@/lib/content";
import { METHOD, pillarItems } from "@/lib/method";

export function BrandOverview() {
  const { user } = useAuth();
  const client = getClient(user?.clientSlug) ?? DEMO_CLIENT;

  return (
    <div>
      <div className="flex items-center gap-4">
        <span
          className="grid size-14 place-items-center rounded-2xl text-xl font-bold text-ink-900"
          style={{ background: client.accent }}
        >
          {client.name[0]}
        </span>
        <div>
          <h1 className="text-3xl font-bold tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
            {client.name}
          </h1>
          <p className="text-fog">{client.tagline}</p>
        </div>
      </div>

      <p className="mt-8 max-w-xl leading-relaxed text-fog">
        Bem-vindo ao seu <span className="text-cream">Brand System</span> — o
        sistema vivo da sua marca. Navegue pelas camadas do Método Mira no menu
        lateral para consultar cada elemento da identidade.
      </p>

      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {METHOD.map((pillar) => {
          const items = pillarItems(pillar).filter((it) => it.id in client.pages);
          const empty = items.length === 0;

          const inner = (
            <>
              <div className="flex items-baseline justify-between">
                <span
                  className="text-3xl font-bold text-accent-500/30"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {pillar.number}
                </span>
                <span className="text-xs text-fog">
                  {empty
                    ? "Em construção"
                    : `${items.length} ${items.length === 1 ? "elemento" : "elementos"}`}
                </span>
              </div>
              <h2 className="mt-3 text-lg font-semibold" style={{ fontFamily: "var(--font-display)" }}>
                {pillar.label}
              </h2>
              <p className="mt-1 text-sm text-fog">{pillar.tagline}</p>
            </>
          );

          if (empty) {
            return (
              <div
                key={pillar.id}
                className="rounded-3xl border border-dashed border-white/10 bg-white/[0.02] p-6 opacity-60"
              >
                {inner}
              </div>
            );
          }

          return (
            <Link
              key={pillar.id}
              to={`/app/${pillar.id}/${items[0].id}`}
              className="group rounded-3xl border border-white/10 bg-white/[0.03] p-6 transition-colors hover:border-accent-500/30"
            >
              {inner}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
