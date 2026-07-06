import { Link } from "react-router-dom";
import { DEMO_CLIENT } from "@/lib/content";
import { METHOD, pillarItems } from "@/lib/method";

export function BrandOverview() {
  const client = DEMO_CLIENT;

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
        Bem-vindo à sua <span className="text-cream">Plataforma de Marca</span> — o
        sistema vivo da sua marca. Navegue pelas três camadas do Método Mira no menu
        lateral para consultar cada elemento da identidade.
      </p>

      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {METHOD.map((pillar) => {
          const items = pillarItems(pillar);
          const done = items.filter((it) => it.id in client.pages).length;
          const pct = Math.round((done / items.length) * 100);
          const first = items[0];
          return (
            <Link
              key={pillar.id}
              to={`/app/${pillar.id}/${first.id}`}
              className="group rounded-3xl border border-white/10 bg-white/[0.03] p-6 transition-colors hover:border-accent-500/30"
            >
              <div className="flex items-baseline justify-between">
                <span
                  className="text-3xl font-bold text-accent-500/30"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {pillar.number}
                </span>
                <span className="text-xs text-fog">
                  {done}/{items.length}
                </span>
              </div>
              <h2 className="mt-3 text-lg font-semibold" style={{ fontFamily: "var(--font-display)" }}>
                {pillar.label}
              </h2>
              <p className="mt-1 text-sm text-fog">{pillar.tagline}</p>
              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-accent-500 transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
