import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { DEMO_CLIENT, getClient } from "@/lib/content";
import { downloadClientMarkdown } from "@/lib/export";
import { METHOD, type MethodItem, type MethodPillar } from "@/lib/method";
import { Logo } from "@/components/Logo";

/**
 * Casca do Brand System: sidebar com a metodologia + área de conteúdo (Outlet).
 * O conteúdo do cliente é resolvido pelo slug da sessão (user.clientSlug).
 */
export function BrandOSLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const client = getClient(user?.clientSlug) ?? DEMO_CLIENT;
  const pageIds = new Set(Object.keys(client.pages));

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <div className="flex min-h-screen bg-ink-900 text-cream">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-white/5 bg-ink-950/60 backdrop-blur-xl transition-transform md:sticky md:top-0 md:h-screen md:translate-x-0 ${
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
            <p className="truncate text-xs text-fog">Brand System</p>
          </div>
        </Link>

        {/* Navegação por pilares */}
        <nav className="mt-4 flex-1 space-y-6 overflow-y-auto px-3 pb-6">
          {METHOD.map((pillar) => (
            <PillarNav
              key={pillar.id}
              pillar={pillar}
              pageIds={pageIds}
              onNavigate={() => setOpen(false)}
            />
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
        <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-white/5 bg-ink-900/80 px-5 py-3 backdrop-blur-xl md:px-12">
          <div className="flex items-center gap-3 md:hidden">
            <button onClick={() => setOpen(true)} aria-label="Abrir menu" className="text-cream">
              ☰
            </button>
            <Logo height={20} />
          </div>
          <p className="hidden text-xs text-fog md:block">
            {client.name} · <span className="text-fog/60">Brand System</span>
          </p>
          <button
            onClick={() => downloadClientMarkdown(client)}
            className="inline-flex items-center gap-2 rounded-full border border-accent-500/40 bg-accent-500/10 px-4 py-1.5 text-xs font-medium text-accent-200 transition-colors hover:bg-accent-500/20"
          >
            <span aria-hidden>↓</span> Baixar Brand System (.md)
          </button>
        </header>
        <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-10 md:px-12 md:py-14">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function PillarNav({
  pillar,
  pageIds,
  onNavigate,
}: {
  pillar: MethodPillar;
  pageIds: Set<string>;
  onNavigate: () => void;
}) {
  // Só renderiza itens e subgrupos que o cliente possui (sem "em breve").
  const rootItems = (pillar.items ?? []).filter((it) => pageIds.has(it.id));
  const subgroups = (pillar.subgroups ?? [])
    .map((g) => ({ ...g, items: g.items.filter((it) => pageIds.has(it.id)) }))
    .filter((g) => g.items.length > 0);

  return (
    <div>
      <p className="px-3 text-xs font-semibold uppercase tracking-wider text-accent-400/80">
        {pillar.number} · {pillar.label}
      </p>
      <div className="mt-2 space-y-0.5">
        {rootItems.length === 0 && subgroups.length === 0 ? (
          <p className="px-3 py-1.5 text-xs italic text-fog/40">Em construção</p>
        ) : (
          <>
            {rootItems.map((item) => (
              <ItemLink key={item.id} pillarId={pillar.id} item={item} onNavigate={onNavigate} />
            ))}
            {subgroups.map((group) => (
              <div key={group.id} className="mt-2">
                <p className="px-3 py-1 text-[11px] font-medium text-fog/70">{group.label}</p>
                {group.items.map((item) => (
                  <ItemLink key={item.id} pillarId={pillar.id} item={item} onNavigate={onNavigate} />
                ))}
              </div>
            ))}
          </>
        )}
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
    </NavLink>
  );
}
