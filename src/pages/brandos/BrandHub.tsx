import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { DEMO_CLIENT, getClient, type ClientBrand, type HubBrand } from "@/lib/content";
import { hexToRgb, rgbToCmyk, contrastRatio, contrastBadge, copyText } from "@/lib/color";
import { Logo } from "@/components/Logo";
import "./brand-hub.css";

/* Constrói o brand.md a partir do hub — sempre em sincronia. */
function buildMarkdown(client: ClientBrand): string {
  const h = client.hub!;
  const L: string[] = [];
  L.push(`# ${client.name} — Brand System`);
  L.push(`> ${client.tagline}${h.since ? "  ·  " + h.since : ""}`);
  L.push("_Documento gerado pela Mira Brand Studio._");
  if (h.essence) {
    L.push("\n## Essência");
    if (h.essence.lead) L.push(h.essence.lead);
    if (h.essence.proposito) L.push("**Propósito:** " + h.essence.proposito);
    if (h.essence.posicionamento) L.push("**Posicionamento:** " + h.essence.posicionamento);
    if (h.essence.atributos?.length) L.push("**Atributos:** " + h.essence.atributos.join(", "));
  }
  if (h.verbal) {
    L.push("\n## Tom de voz");
    if (h.verbal.tom) L.push(h.verbal.tom);
    if (h.verbal.sim?.length) L.push("**Diga:** " + h.verbal.sim.join(", "));
    if (h.verbal.nao?.length) L.push("**Evite:** " + h.verbal.nao.join(", "));
  }
  L.push("\n## Cores");
  if (h.colorsNote) L.push("_" + h.colorsNote + "_");
  h.colors.forEach((c) => {
    const rgb = hexToRgb(c.hex), k = rgbToCmyk(rgb);
    const cmyk = c.cmyk ?? `${k.c} ${k.m} ${k.y} ${k.k}`;
    L.push(`- **${c.name}** — \`${c.hex.toUpperCase()}\` · RGB ${rgb.r} ${rgb.g} ${rgb.b} · CMYK ${cmyk}${c.role ? " — " + c.role : ""}`);
  });
  if (h.drive?.assets) { L.push("\n## Logos & assets"); L.push("Pacote completo (SVG/AI/PDF, RGB+CMYK): " + h.drive.assets); }
  L.push("\n_Gerado a partir do Brand System — sempre em sincronia com o hub._");
  return L.join("\n\n");
}

interface SectionDef { id: string; label: string; }

export function BrandHub() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const client = getClient(user?.clientSlug) ?? DEMO_CLIENT;
  const hub = client.hub;

  const [active, setActive] = useState("");
  const [drawer, setDrawer] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    try { return (localStorage.getItem("bh-theme") as "dark" | "light") || "dark"; } catch { return "dark"; }
  });
  const [toast, setToast] = useState<{ msg: string; color: string } | null>(null);
  function toggleTheme() {
    setTheme((t) => {
      const next = t === "dark" ? "light" : "dark";
      try { localStorage.setItem("bh-theme", next); } catch { /* ignore */ }
      return next;
    });
  }
  const toastTimer = useRef<number | undefined>(undefined);
  const rootRef = useRef<HTMLDivElement>(null);

  /* Seções disponíveis (multi-cliente: só o que o hub tem) */
  const sections = useMemo<SectionDef[]>(() => {
    if (!hub) return [];
    const s: SectionDef[] = [];
    if (hub.logos.length || hub.drive?.assets) s.push({ id: "logos", label: "Logos" });
    if (hub.colors.length) s.push({ id: "cores", label: "Cores" });
    if ((hub.type && hub.type.length) || hub.typeNote) s.push({ id: "tipografia", label: "Tipografia" });
    if (hub.essence) s.push({ id: "essencia", label: "Essência" });
    if (hub.verbal) s.push({ id: "verbal", label: "Verbal" });
    if ((hub.photos && hub.photos.length) || (hub.applications && hub.applications.length) || hub.drive?.expressao) s.push({ id: "em-uso", label: "Em uso" });
    s.push({ id: "ia", label: "IA" });
    return s;
  }, [hub]);

  /* Tokens de cor da marca (--c1..--c5) */
  const brandVars = useMemo<CSSProperties>(() => {
    const v: Record<string, string> = {};
    (hub?.colors ?? []).slice(0, 5).forEach((c, i) => { v["--c" + (i + 1)] = c.hex; });
    return v as CSSProperties;
  }, [hub]);

  function showToast(msg: string, color = "var(--gold)") {
    setToast({ msg, color });
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 1600);
  }
  async function copyHex(hex: string) {
    showToast((await copyText(hex)) ? "Copiado  " + hex.toUpperCase() : "Não consegui copiar", hex);
  }
  function downloadLogo(src: string, file: string) {
    try { const a = document.createElement("a"); a.href = src; a.download = file; document.body.appendChild(a); a.click(); a.remove(); showToast("Baixando " + file); }
    catch { window.open(src, "_blank"); }
  }
  async function copyGuide() {
    showToast((await copyText(buildMarkdown(client))) ? "Guia copiado" : "Não consegui copiar", "var(--gold)");
  }
  function downloadGuide() {
    const blob = new Blob([buildMarkdown(client)], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    downloadLogo(url, client.slug + "-brand.md");
    setTimeout(() => URL.revokeObjectURL(url), 3000);
  }
  function handleLogout() { logout(); navigate("/"); }

  /* IntersectionObserver: nav ativa + reveal */
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const navIO = new IntersectionObserver(
      (ents) => ents.forEach((e) => { if (e.isIntersecting) setActive((e.target as HTMLElement).id); }),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    root.querySelectorAll("section[id]").forEach((el) => navIO.observe(el));
    const revIO = new IntersectionObserver(
      (ents) => ents.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); revIO.unobserve(e.target); } }),
      { rootMargin: "0px 0px -8% 0px" },
    );
    root.querySelectorAll(".reveal").forEach((el) => revIO.observe(el));
    return () => { navIO.disconnect(); revIO.disconnect(); };
  }, [sections]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") setDrawer(false); }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!hub) {
    return (
      <div className="grid min-h-screen place-items-center bg-ink-900 text-center text-fog">
        <div>
          <p>O Brand System deste cliente ainda está sendo montado.</p>
          <button onClick={handleLogout} className="mt-3 text-sm text-accent-300">Sair</button>
        </div>
      </div>
    );
  }

  const md = buildMarkdown(client);

  return (
    <div className="bh" data-theme={theme} ref={rootRef} style={brandVars}>
      {/* Header fixo: logo da Mira + menu + cliente, pinados juntos */}
      <header className="hub-top">
        <Link className="brandmark" to="/" aria-label="Ir para o site da Mira">
          <Logo height={22} tone={theme === "light" ? "dark" : undefined} />
        </Link>
        <nav className="nav" aria-label="Seções">
          <div className="nav-scroll">
            {sections.map((s) => (
              <a key={s.id} href={"#" + s.id} className={active === s.id ? "active" : ""}>{s.label}</a>
            ))}
          </div>
          <span className="spacer" />
          <button className="icon-btn" onClick={toggleTheme} title="Alternar tema claro/escuro" aria-label="Alternar tema">
            {theme === "light" ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" /></svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="4.5" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M19 5l-1.5 1.5M6.5 17.5 5 19" /></svg>
            )}
          </button>
          <button className="icon-btn" onClick={handleLogout} title="Sair" aria-label="Sair">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="m16 17 5-5-5-5" /><path d="M21 12H9" /></svg>
          </button>
        </nav>
        <span className="client-tag"><b>{client.name}</b> · Brand System</span>
      </header>

      <main className="wrap">
        <Hero client={client} hub={hub} />
        {sections.some((s) => s.id === "logos") && <Logos hub={hub} onDownload={downloadLogo} />}
        {sections.some((s) => s.id === "cores") && <Colors hub={hub} onCopy={copyHex} />}
        {sections.some((s) => s.id === "tipografia") && <Typography hub={hub} />}
        {sections.some((s) => s.id === "essencia") && <Essence hub={hub} />}
        {sections.some((s) => s.id === "verbal") && <Verbal hub={hub} />}
        {sections.some((s) => s.id === "em-uso") && <InUse hub={hub} />}
        <AIGuide md={md} onCopy={copyGuide} onDownload={downloadGuide} />
      </main>

      <footer>
        <div className="wrap foot">
          <span className="mira"><span className="m-dot" />Desenhado pela Mira Brand Studio</span>
          <a href="https://somosmira.com.br" style={{ color: "var(--muted)", textDecoration: "none" }}>somosmira.com.br ↗</a>
        </div>
      </footer>

      {/* Quick Ref */}
      <button className="qr-tab" onClick={() => setDrawer(true)} aria-expanded={drawer}>Ref rápida</button>
      <div className={"qr-overlay" + (drawer ? " open" : "")} onClick={() => setDrawer(false)} />
      <aside className={"qr" + (drawer ? " open" : "")} aria-hidden={!drawer} aria-label="Referência rápida">
        <div className="qr-head"><h3>Referência rápida</h3><button className="icon-btn" onClick={() => setDrawer(false)} aria-label="Fechar">✕</button></div>
        <div className="qr-body">
          <h4>Cores</h4>
          {hub.colors.map((c) => (
            <button key={c.hex} className="qr-row" onClick={() => copyHex(c.hex)}>
              <span className="qr-dot" style={{ background: c.hex }} /><span className="qr-n">{c.name}</span><span className="qr-h">{c.hex.toUpperCase()}</span>
            </button>
          ))}
          {(hub.drive?.assets || hub.drive?.expressao) && <h4>Links</h4>}
          {hub.drive?.assets && <a className="qr-link" href={hub.drive.assets} target="_blank" rel="noopener noreferrer">Pacote de marca <span>Drive ↗</span></a>}
          {hub.drive?.expressao && <a className="qr-link" href={hub.drive.expressao} target="_blank" rel="noopener noreferrer">Aplicações <span>Drive ↗</span></a>}
        </div>
      </aside>

      {/* Toast */}
      <div className={"toast" + (toast ? " show" : "")} role="status" aria-live="polite">
        <span className="tdot" style={{ background: toast?.color }} />
        <span>{toast?.msg}</span>
      </div>
    </div>
  );
}

/* ---------------- Seções ---------------- */
function SecHead({ eyebrow, title, desc }: { eyebrow: string; title: string; desc: string }) {
  return (
    <div className="sec-head reveal">
      <div><span className="eyebrow">{eyebrow}</span><h2>{title}</h2></div>
      <p>{desc}</p>
    </div>
  );
}

function Hero({ client, hub }: { client: ClientBrand; hub: HubBrand }) {
  const primary = hub.logos[0];
  return (
    <section className="hero" id="hero">
      <div className="hero-top">
        <span className="chip"><b>{hub.year}</b> Brand System</span>
        {hub.since && <span className="chip">{hub.since}</span>}
      </div>
      {primary ? (
        <div className="hero-logo" style={{ background: primary.pad }}>
          <img src={primary.src} alt={"Logo " + client.name} />
        </div>
      ) : (
        <div className="hero-logo mono" style={{ background: "var(--surface)" }}>
          <div className="hero-mark" style={{ color: client.accent }}>{client.name}</div>
        </div>
      )}
      <div className="hero-lede"><span className="name">{client.name}</span><span className="tag">{client.tagline}</span></div>
      <div className="instruct"><span className="dot" /> Clique em qualquer cor para copiar o hex. Baixe os logos direto daqui.</div>
    </section>
  );
}

function Logos({ hub, onDownload }: { hub: HubBrand; onDownload: (src: string, file: string) => void }) {
  return (
    <section id="logos">
      <SecHead eyebrow="Logos" title="Assinatura da marca" desc="Cada versão em seu contexto. Os arquivos vetoriais (SVG/AI/PDF, RGB e CMYK) ficam no pacote completo no Drive." />
      {hub.logos.length > 0 ? (
        <div className="grid g2">
          {hub.logos.map((l) => (
            <div className="card reveal" key={l.file}>
              <div className="logo-vis" style={{ background: l.pad }}><img src={l.src} alt={l.name} /></div>
              <div className="logo-meta">
                <div><div className="lm-name">{l.name}</div><div className="lm-role">{l.role}</div></div>
                <button className="btn" onClick={() => onDownload(l.src, l.file)}>↓ PNG</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="note-card reveal">Os logos ainda serão publicados aqui.</div>
      )}
      {hub.drive?.assets && (
        <div style={{ marginTop: 22 }} className="reveal">
          <a className="btn btn-gold" href={hub.drive.assets} target="_blank" rel="noopener noreferrer">↗ Abrir pacote completo no Drive</a>
        </div>
      )}
    </section>
  );
}

function Colors({ hub, onCopy }: { hub: HubBrand; onCopy: (hex: string) => void }) {
  return (
    <section id="cores">
      <SecHead eyebrow="Cores" title="Paleta" desc="Clique num swatch para copiar o hex. RGB e CMYK são calculados a partir do hex — nunca digitados." />
      <div className="grid g3">
        {hub.colors.map((c) => {
          const rgb = hexToRgb(c.hex), k = rgbToCmyk(rgb);
          return (
            <button className="card swatch reveal" key={c.hex} onClick={() => onCopy(c.hex)} aria-label={"Copiar " + c.hex}>
              <div className="chipcolor" style={{ background: c.hex }}><div className="copyhint"><span>Copiar hex</span></div></div>
              <div className="sw-body">
                <div className="sw-name">{c.name}</div>
                <div className="sw-vals"><code>{c.hex.toUpperCase()}</code><br />RGB {rgb.r} {rgb.g} {rgb.b}<br />CMYK {c.cmyk ?? `${k.c} ${k.m} ${k.y} ${k.k}`}</div>
                {c.role && <div className="sw-role">{c.role}</div>}
              </div>
            </button>
          );
        })}
      </div>
      {hub.colorsNote && <div className="note-card reveal" style={{ marginTop: 22 }}><b>Nota:</b> {hub.colorsNote}</div>}
      {hub.pairings && hub.pairings.length > 0 && (
        <>
          <div className="grp-label">Pares aprovados · contraste calculado (WCAG)</div>
          <div className="grid g2">
            {hub.pairings.map((p) => {
              const bd = contrastBadge(contrastRatio(p.bg, p.fg));
              return (
                <div className="pair reveal" key={p.label}>
                  <div className="demo" style={{ background: p.bg, color: p.fg }}>
                    <div className="p-eyebrow">Etiqueta</div><div className="p-head">{p.label.split(" + ")[0]}</div>
                    <p className="p-body">Contraste testado para uso real.</p>
                  </div>
                  <div className="meta"><span className="combo">{p.label}</span><span className={"badge " + bd.level}>{bd.label}</span></div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </section>
  );
}

function Typography({ hub }: { hub: HubBrand }) {
  return (
    <section id="tipografia">
      <SecHead eyebrow="Tipografia" title="Sistema tipográfico" desc="A tipografia que sustenta a marca em todos os pontos de contato." />
      {hub.type && hub.type.length > 0 ? (
        <div className="grid" style={{ gap: 18 }}>
          {hub.type.map((t) => (
            <div className="card type-card reveal" key={t.role}>
              <span className="type-role">{t.role} — {t.family}</span>
              <div className="type-sample" style={{ fontFamily: t.cssFamily ?? undefined }}>{t.sample}</div>
              <div className="type-pangram">Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk Ll Mm Nn Oo Pp Qq Rr Ss Tt Uu Vv Ww Xx Yy Zz</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="note-card reveal"><b>Tipografia em documentação.</b> {hub.typeNote}</div>
      )}
    </section>
  );
}

function Essence({ hub }: { hub: HubBrand }) {
  const e = hub.essence!;
  return (
    <section id="essencia">
      <SecHead eyebrow="Essência" title="O porquê antes do quê" desc="Antes dos ativos, a estratégia. É daqui que toda decisão de marca deriva." />
      <div className="prose reveal">
        {e.lead && <p className="lead">{e.lead}</p>}
        {e.proposito && <><div className="grp-label">Propósito</div><p>{e.proposito}</p></>}
        {e.posicionamento && <><div className="grp-label">Posicionamento</div><p>{e.posicionamento}</p></>}
        {e.quote && <div className="quote"><p>“{e.quote}”</p></div>}
        {e.atributos && e.atributos.length > 0 && <><div className="grp-label">Atributos</div><div className="attrs">{e.atributos.map((a) => <span className="tag2" key={a}>{a}</span>)}</div></>}
      </div>
    </section>
  );
}

function Verbal({ hub }: { hub: HubBrand }) {
  const v = hub.verbal!;
  return (
    <section id="verbal">
      <SecHead eyebrow="Verbal" title="Tom de voz" desc="Como a marca soa — e o vocabulário que a mantém fiel a si mesma." />
      <div className="prose reveal">
        {v.tom && <p className="lead">{v.tom}</p>}
        {v.sim && v.sim.length > 0 && <><div className="grp-label">Vocabulário — sim</div><div className="attrs">{v.sim.map((x) => <span className="tag2" key={x}>{x}</span>)}</div></>}
        {v.nao && v.nao.length > 0 && <><div className="grp-label">Vocabulário — não</div><div className="attrs">{v.nao.map((x) => <span className="tag2" key={x}>{x}</span>)}</div></>}
        {v.examples && v.examples.length > 0 && (
          <>
            <div className="grp-label" style={{ marginTop: 30 }}>Exemplos</div>
            {v.examples.map((x, i) => (
              <div className="sim-nao" key={i}>
                <div className="sn sim"><h4>Assim sim</h4><ul><li>{x.sim}</li></ul></div>
                <div className="sn nao"><h4>Assim não</h4><ul><li>{x.nao}</li></ul></div>
              </div>
            ))}
          </>
        )}
      </div>
    </section>
  );
}

function InUse({ hub }: { hub: HubBrand }) {
  // Agrupa as fotos preservando a ordem dos grupos
  const photos = hub.photos ?? [];
  const groups: { name: string; items: typeof photos }[] = [];
  photos.forEach((p) => {
    const name = p.group ?? "Aplicações";
    let g = groups.find((x) => x.name === name);
    if (!g) { g = { name, items: [] }; groups.push(g); }
    g.items.push(p);
  });

  return (
    <section id="em-uso">
      <SecHead eyebrow="Em uso" title="A marca no mundo real" desc="A marca ao vivo — aplicações e direção fotográfica que guiam como o Cruz de Malta aparece em cada ponto de contato." />
      {groups.length > 0 ? (
        groups.map((g) => (
          <div key={g.name}>
            <div className="grp-label">{g.name}</div>
            <div className="photo-grid">
              {g.items.map((p) => (
                <figure
                  className={"photo reveal" + (p.fit === "contain" ? " contain" : "")}
                  key={p.src}
                  style={p.pad ? { background: p.pad } : undefined}
                >
                  <img src={p.src} alt={p.label} loading="lazy" />
                  <figcaption className="cap">{p.label}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        ))
      ) : hub.applications && hub.applications.length > 0 ? (
        <div className="use-grid">
          {hub.applications.map((a) => (
            <div className="use-tile reveal" key={a.k} style={{ background: a.bg, color: a.fg }}>
              <div><div className="u-k">{a.k}</div><div className="u-s">{a.s}</div></div>
            </div>
          ))}
        </div>
      ) : null}
      {hub.drive?.expressao && (
        <div style={{ marginTop: 22 }} className="reveal">
          <a className="btn" href={hub.drive.expressao} target="_blank" rel="noopener noreferrer">↗ Ver mais aplicações e moodboard no Drive</a>
        </div>
      )}
    </section>
  );
}

function AIGuide({ md, onCopy, onDownload }: { md: string; onCopy: () => void; onDownload: () => void }) {
  return (
    <section id="ia">
      <SecHead eyebrow="IA" title="Use sua marca com IA" desc="Um resumo estruturado da marca em texto puro. Cole no ChatGPT, Claude ou Midjourney antes de pedir qualquer peça — e o modelo já cria dentro da marca." />
      <div className="ai-card reveal">
        <p>Este texto é gerado a partir do próprio Brand System, então nunca fica desatualizado. Copie para o chat ou baixe o <code>brand.md</code> para o seu editor.</p>
        <div className="ai-actions">
          <button className="btn btn-gold" onClick={onCopy}>Copiar guia</button>
          <button className="btn" onClick={onDownload}>Baixar brand.md</button>
        </div>
        <pre className="ai-preview">{md}</pre>
      </div>
    </section>
  );
}
