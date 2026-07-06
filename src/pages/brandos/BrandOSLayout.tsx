import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { DEMO_CLIENT } from "@/lib/content";
import { METHOD, type MethodItem, type MethodPillar } from "@/lib/method";
import { Logo } from "@/components/Logo";

/**
 * Casca do Brand OS: sidebar com a metodologia + área de conteúdo (Outlet).
 * O conteúdo do cliente vem de DEMO_CLIENT (futuramente, da sessão/API).
 */
export function BrandOSLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const client = DEMO_CLIENT; // TODO: resolver por user.clientSlug via API

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <div className="flex min-h-screen bg-ink-900 text-cream">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-white/5 bg-ink-950/60 backdrop-blur-xl transition-transform md:static md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-5">
          <Link to="/">
            <Logo height={22} />
          </Link>
          <button
            onClick={() => setOpen(false)}
            className="text-fog md:hidden"
            aria-label="Fechar menu"
          >
            ✕
          </button>
        </div>

        {/* Cabeçalho do cliente */}
        <Link
          to="/app"
          onClick={() => setOpen(false)}
          className="mx-3 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 transition-colors hover:border-accent-500/30"
        >
          <span
            className="grid size-9 place-items-center rounded-xl text-sm font-bold text-ink-900"
            style={{ background: client.accent }}
          >
            {client.name[0]}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{client.name}</p>
            <p className="truncate text-xs text-fog">Plataforma de Marca</p>
          </div>
        </Link>

        {/* Navegação por pilares */}
        <nav className="mt-4 flex-1 space-y-6 overflow-y-auto px-3 pb-6">
          {METHOD.map((pillar) => (
            <PillarNav key={pillar.id} pillar={pillar} onNavigate={() => setOpen(false)} />
          ))}
        </nav>

        {/* Rodapé / usuário */}
        <div className="border-t border-white/5 px-4 py-4">
          <p className="truncate text-sm text-cream">{user?.name}</p>
          <button
            onClick={handleLogout}
            className="mt-1 text-xs text-fog transition-colors hover:text-accent-300"
          >
            Sair
          </button>
        </div>
      </aside>

      {/* Overlay mobile */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Conteúdo */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-white/5 bg-ink-900/80 px-5 py-4 backdrop-blur-xl md:hidden">
          <button onClick={() => setOpen(true)} aria-label="Abrir menu" className="text-cream">
            ☰
          </button>
          <Logo height={20} />
        </header>
        <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-10 md:px-12 md:py-14">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function PillarNav({ pillar, onNavigate }: { pillar: MethodPillar; onNavigate: () => void }) {
  return (
    <div>
      <p className="px-3 text-xs font-semibold uppercase tracking-wider text-accent-400/80">
        {pillar.number} · {pillar.label}
      </p>
      <div className="mt-2 space-y-0.5">
        {pillar.items?.map((item) => (
          <ItemLink key={item.id} pillarId={pillar.id} item={item} onNavigate={onNavigate} />
        ))}
        {pillar.subgroups?.map((group) => (
          <div key={group.id} className="mt-2">
            <p className="px-3 py-1 text-[11px] font-medium text-fog/70">{group.label}</p>
            {group.items.map((item) => (
              <ItemLink key={item.id} pillarId={pillar.id} item={item} onNavigate={onNavigate} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function ItemLink({
  pillarId,
  item,
  onNavigate,
}: {
  pillarId: string;
  item: MethodItem;
  onNavigate: () => void;
}) {
  const hasContent = item.id in DEMO_CLIENT.pages;
  return (
    <NavLink
      to={`/app/${pillarId}/${item.id}`}
      onClick={onNavigate}
      className={({ isActive }) =>
        `flex items-center justify-between rounded-lg px-3 py-1.5 text-sm transition-colors ${
          isActive
            ? "bg-accent-500/15 text-accent-200"
            : "text-fog hover:bg-white/5 hover:text-cream"
        }`
      }
    >
      <span className="truncate">{item.label}</span>
      {!hasContent && (
        <span className="ml-2 size-1.5 shrink-0 rounded-full bg-white/15" title="Em breve" />
      )}
    </NavLink>
  );
}
