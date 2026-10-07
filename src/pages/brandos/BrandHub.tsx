import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { DEMO_CLIENT, getClient, type ClientBrand, type HubBrand, type HubArticle, type HubLogo, type HubVerbal } from "@/lib/content";
import { hexToRgb, rgbToCmyk, contrastRatio, copyText } from "@/lib/color";
import { Logo } from "@/components/Logo";
import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";
import "./brand-hub.css";

function colorLine(c: HubBrand["colors"][number]): string {
  const rgb = hexToRgb(c.hex), k = rgbToCmyk(rgb);
  const cmyk = c.cmyk ?? `${k.c} ${k.m} ${k.y} ${k.k}`;
  return `- **${c.name}** — \`${c.hex.toUpperCase()}\` · RGB ${rgb.r} ${rgb.g} ${rgb.b} · CMYK ${cmyk}${c.role ? " — " + c.role : ""}`;
}

/* Constrói o brand.md completo a partir do hub — sempre em sincronia. */
/* Expressão verbal em markdown — mesma fonte para o brand.md e a SKILL.md */
function verbalLines(v: HubVerbal): string[] {
  const L: string[] = ["\n## Expressão verbal"];
  if (v.naming?.length) L.push(v.naming.map((n) => `**${n.label}:** ${n.value}`).join("  \n"));
  if (v.tom) L.push("**Tom de voz:** " + v.tom);
  if (v.eNaoE?.length) L.push("| É | Não é |\n|---|---|\n" + v.eNaoE.map((x) => `| ${x.e} | ${x.nao} |`).join("\n"));
  if (v.sim?.length) L.push("**Diga:** " + v.sim.join(", "));
  if (v.nao?.length) L.push("**Evite:** " + v.nao.join(", "));
  if (v.superlativo) L.push("**Regra do superlativo:** " + v.superlativo);
  if (v.examples?.length) {
    L.push("**Exemplos (assim sim / assim não):**");
    v.examples.forEach((e) => L.push(`- ✅ ${e.sim}\n- ❌ ${e.nao}`));
  }
  if (v.territorio) {
    L.push("### Território de atuação");
    if (v.territorio.faz.length) L.push("**O que faz:**\n" + v.territorio.faz.map((x) => "- " + x).join("\n"));
    if (v.territorio.naoFaz.length) L.push("**O que não faz:**\n" + v.territorio.naoFaz.map((x) => "- " + x).join("\n"));
  }
  if (v.recursos?.length) {
    L.push("### Recursos comunicacionais");
    L.push(v.recursos.map((r, i) => `${i + 1}. **${r.title}.**${r.text ? " " + r.text : ""}`).join("\n"));
  }
  if (v.manifesto?.length) L.push("### Manifesto\n" + v.manifesto.join("\n\n"));
  if (v.mensagens?.length) {
    L.push("### Mensagens-chave");
    v.mensagens.forEach((m) => L.push(`**${m.label}:**\n` + m.items.map((x) => "- " + x).join("\n")));
  }
  if (v.pitch) L.push("### Pitch elevator\n" + v.pitch);
  return L;
}

function buildMarkdown(client: ClientBrand): string {
  const h = client.hub!;
  const L: string[] = [];
  L.push(`# ${client.name} — Brand System`);
  L.push(`> ${client.tagline}${h.since ? "  ·  " + h.since : ""}`);
  L.push("_Documento gerado pela Mira Brand Studio a partir do Brand System interativo._");

  if (h.essence) {
    L.push("\n## Essência");
    if (h.essence.lead) L.push(h.essence.lead);
    if (h.essence.proposito) L.push("**Propósito:** " + h.essence.proposito);
    if (h.essence.posicionamento) L.push("**Posicionamento:** " + h.essence.posicionamento);
    if (h.essence.quote) L.push("> " + h.essence.quote);
    if (h.essence.atributos?.length) L.push("**Atributos:** " + h.essence.atributos.join(", "));
  }
  if (h.verbal) L.push(...verbalLines(h.verbal));

  L.push("\n## Cores");
  if (h.colorsNote) L.push("_" + h.colorsNote + "_");
  h.colors.forEach((c) => L.push(colorLine(c)));
  if (h.pairings?.length) {
    L.push("**Pares aprovados (fundo → texto):**");
    h.pairings.forEach((p) => L.push(`- ${p.label} — ${p.bg.toUpperCase()} → ${p.fg.toUpperCase()} (contraste ${contrastRatio(p.bg, p.fg).toFixed(1)}:1)`));
  }

  if (h.type?.length) {
    L.push("\n## Tipografia");
    h.type.forEach((t) => L.push(`- **${t.role}:** ${t.family}${t.usage ? " — " + t.usage : ""}`));
    if (h.fontsUrl) L.push("Arquivos das fontes: " + h.fontsUrl);
  } else if (h.typeNote) {
    L.push("\n## Tipografia");
    L.push("_" + h.typeNote + "_");
  }

  if (h.support?.length) {
    L.push("\n## Elementos de apoio");
    h.support.forEach((x) => L.push(`**${x.name}** — ${x.paragraphs.join(" ")}${x.uses?.length ? "\nUsos: " + x.uses.join(", ") : ""}`));
  }

  if (h.logos?.length) {
    L.push("\n## Logos");
    h.logos.forEach((lg) => L.push(`- **${lg.group ? lg.group + " · " : ""}${lg.name}** — ${lg.role}`));
  }
  if (h.drive?.assets) L.push("Pacote de assets (SVG/AI/PDF, RGB+CMYK): " + h.drive.assets);
  if (h.brandbook) L.push("Brandbook completo (PDF): " + h.brandbook);

  L.push("\n_Sempre em sincronia com o Brand System do cliente._");
  return L.join("\n\n");
}

/* Gera um SKILL.md pronto pra colar no Claude Code / Codex Cloud —
 * faz a IA produzir qualquer peça dentro do design system da marca. */
function buildSkill(client: ClientBrand): string {
  const h = client.hub!;
  const L: string[] = [];
  L.push("---");
  L.push(`name: marca-${client.slug}`);
  L.push(`description: Cria qualquer peça (apresentações, posts, textos, layouts) EXATAMENTE dentro da identidade da marca ${client.name}. Use sempre que gerar conteúdo para ${client.name}.`);
  L.push("---");
  L.push(`\n# Identidade da marca — ${client.name}`);
  L.push(`Ao criar qualquer coisa para **${client.name}** (${client.tagline}), siga estas regras à risca. Nunca invente cor, fonte ou tom fora do que está definido aqui.`);

  L.push("\n## Cores (use exatamente estes valores)");
  h.colors.forEach((c) => {
    const rgb = hexToRgb(c.hex), k = rgbToCmyk(rgb);
    const cmyk = c.cmyk ?? `${k.c} ${k.m} ${k.y} ${k.k}`;
    L.push(`- ${c.name}: HEX ${c.hex.toUpperCase()} · RGB ${rgb.r},${rgb.g},${rgb.b} · CMYK ${cmyk}${c.role ? ` — ${c.role}` : ""}`);
  });
  if (h.pairings?.length) {
    L.push("Combinações aprovadas (fundo → texto):");
    h.pairings.forEach((p) => L.push(`- ${p.bg.toUpperCase()} → ${p.fg.toUpperCase()} (${p.label})`));
  }

  L.push("\n## Tipografia");
  if (h.type?.length) h.type.forEach((t) => L.push(`- ${t.role}: ${t.family}${t.usage ? " — " + t.usage : ""}`));
  else if (h.typeNote) L.push(`- ${h.typeNote}`);

  if (h.verbal) L.push(...verbalLines(h.verbal));
  if (h.essence) {
    L.push("\n## Essência (o porquê)");
    if (h.essence.posicionamento) L.push("Posicionamento: " + h.essence.posicionamento);
    if (h.essence.atributos?.length) L.push("Atributos: " + h.essence.atributos.join(", "));
  }

  L.push("\n## Checklist antes de entregar qualquer peça");
  L.push("- [ ] Usei somente as cores/hex acima?\n- [ ] Usei as fontes definidas (ou o fallback mais próximo)?\n- [ ] O texto soa no tom de voz da marca?\n- [ ] Respeitei as combinações de contraste aprovadas?");
  L.push(`\n_Skill gerada pelo Brand System da Mira — fonte única da identidade de ${client.name}._`);
  return L.join("\n");
}

interface SectionDef { id: string; label: string; }

/** Seções agrupadas sob "Identidade Visual" no menu (dropdown). */
const VISUAL_IDS = ["logos", "cores", "fontes", "apoio"];

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
  const [visualMenu, setVisualMenu] = useState<{ left: number } | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const [reader, setReader] = useState<{ items: HubArticle[]; index: number } | null>(null);
  function openReader(items: HubArticle[], index = 0) { setReader({ items, index }); }
  function closeReader() { setReader(null); }
  function readerStep(delta: number) {
    setReader((r) => (r ? { items: r.items, index: Math.min(Math.max(r.index + delta, 0), r.items.length - 1) } : r));
  }
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
    if (hub.logos.length || hub.drive?.assets) s.push({ id: "logos", label: "Logo" });
    if (hub.colors.length) s.push({ id: "cores", label: "Cores" });
    if ((hub.type && hub.type.length) || hub.typeNote) s.push({ id: "fontes", label: "Fontes" });
    s.push({ id: "apoio", label: "Elementos de apoio" });
    if (hub.essence) s.push({ id: "essencia", label: "Essência" });
    if (hub.narratives && hub.narratives.length) s.push({ id: "narrativa", label: "Narrativa" });
    if (hub.verbal) s.push({ id: "expressao", label: "Expressão" });
    if ((hub.photos && hub.photos.length) || (hub.applications && hub.applications.length) || hub.conceptDeck) s.push({ id: "aplicacoes", label: "Aplicações" });
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
  function downloadText(text: string, filename: string) {
    const blob = new Blob([text], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    downloadLogo(url, filename);
    setTimeout(() => URL.revokeObjectURL(url), 3000);
  }
  function downloadGuide() { downloadText(buildMarkdown(client), client.slug + "-brand.md"); }
  function downloadSkill() { downloadText(buildSkill(client), "marca-" + client.slug + "-SKILL.md"); }
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
    function onKey(e: KeyboardEvent) {
      if (e.key !== "Escape") return;
      setVisualMenu(null);
      if (reader) closeReader(); else setDrawer(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [reader]);

  /* Trava o scroll do fundo enquanto o leitor (Essência/Narrativa) está aberto */
  useEffect(() => {
    document.body.style.overflow = reader ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [reader]);

  /* Fecha o dropdown de Identidade Visual ao clicar fora do menu */
  useEffect(() => {
    if (!visualMenu) return;
    const onDown = (e: PointerEvent) => { if (!navRef.current?.contains(e.target as Node)) setVisualMenu(null); };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [visualMenu]);

  function toggleVisualMenu(btn: HTMLElement) {
    if (visualMenu) { setVisualMenu(null); return; }
    const nav = navRef.current;
    if (!nav) return;
    setVisualMenu({ left: btn.getBoundingClientRect().left - nav.getBoundingClientRect().left });
  }

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
  const visualSections = sections.filter((s) => VISUAL_IDS.includes(s.id));
  const otherSections = sections.filter((s) => !VISUAL_IDS.includes(s.id));

  return (
    <div className="bh" data-theme={theme} ref={rootRef} style={brandVars}>
      {/* Header fixo: logo da Mira + menu + cliente, pinados juntos */}
      <header className="hub-top">
        <Link className="brandmark" to="/" aria-label="Ir para o site da Mira">
          <Logo height={22} tone={theme === "light" ? "dark" : undefined} />
        </Link>
        <nav className="nav" aria-label="Seções" ref={navRef}>
          <div className="nav-scroll">
            {visualSections.length > 0 && (
              <button
                className={"nav-btn" + (VISUAL_IDS.includes(active) ? " active" : "")}
                aria-expanded={!!visualMenu}
                aria-haspopup="true"
                onClick={(e) => toggleVisualMenu(e.currentTarget)}
              >
                Identidade Visual <span className={"caret" + (visualMenu ? " open" : "")} aria-hidden="true">▾</span>
              </button>
            )}
            {otherSections.map((s) => (
              <a key={s.id} href={"#" + s.id} className={active === s.id ? "active" : ""}>{s.label}</a>
            ))}
          </div>
          {visualMenu && (
            <div className="nav-menu" style={{ left: visualMenu.left }} role="menu">
              {visualSections.map((s) => (
                <a key={s.id} href={"#" + s.id} role="menuitem" className={active === s.id ? "current" : ""} onClick={() => setVisualMenu(null)}>{s.label}</a>
              ))}
            </div>
          )}
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
        {sections.some((s) => s.id === "fontes") && <Typography hub={hub} />}
        <Support hub={hub} onDownload={downloadLogo} />
        {sections.some((s) => s.id === "essencia") && (
          <Essence hub={hub} onRead={() => hub.essenceArticle && openReader([hub.essenceArticle])} />
        )}
        {sections.some((s) => s.id === "narrativa") && (
          <Narrative hub={hub} onRead={(i) => hub.narratives && openReader(hub.narratives, i)} />
        )}
        {sections.some((s) => s.id === "expressao") && <Verbal hub={hub} />}
        {sections.some((s) => s.id === "aplicacoes") && <InUse hub={hub} onDownload={downloadLogo} />}
        <AIGuide md={md} onCopy={copyGuide} onDownload={downloadGuide} onDownloadSkill={downloadSkill} />
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

      {/* Leitor — Essência / Narrativa em texto corrido */}
      <ArticleReader items={reader?.items ?? null} index={reader?.index ?? 0} onClose={closeReader} onStep={readerStep} />
    </div>
  );
}

/* ---------------- Seções ---------------- */
function SecHead({ eyebrow, title, desc }: { eyebrow: string; title: string; desc?: string }) {
  return (
    <div className="sec-head reveal">
      <div><span className="eyebrow">{eyebrow}</span><h2>{title}</h2></div>
      {desc && <p>{desc}</p>}
    </div>
  );
}

function Hero({ client, hub }: { client: ClientBrand; hub: HubBrand }) {
  const primary = hub.logos[0];
  return (
    <section className="hero" id="hero">
      <div className="hero-top">
        <span className="chip"><b>{client.name}</b> — Brand System — {hub.year}</span>
        {hub.rebrand && <span className="chip chip-gold chip-live"><span className="live-dot" aria-hidden="true" />Rebranding em andamento</span>}
      </div>
      {hub.rebrand ? (
        <>
          <BeforeAfterSlider before={hub.rebrand.before} after={hub.rebrand.after} />
          {hub.rebrand.note && <p className="hero-rebrand-note">{hub.rebrand.note}</p>}
        </>
      ) : primary ? (
        <div className="hero-logo" style={{ background: primary.pad }}>
          <img src={primary.src} alt={"Logo " + client.name} />
        </div>
      ) : (
        <div className="hero-logo mono" style={{ background: "var(--surface)" }}>
          <div className="hero-mark" style={{ color: client.accent }}>{client.name}</div>
        </div>
      )}
    </section>
  );
}

function Logos({ hub, onDownload }: { hub: HubBrand; onDownload: (src: string, file: string) => void }) {
  const groups: { name?: string; items: HubLogo[] }[] = [];
  hub.logos.forEach((l) => {
    let g = groups.find((x) => x.name === l.group);
    if (!g) { g = { name: l.group, items: [] }; groups.push(g); }
    g.items.push(l);
  });
  return (
    <section id="logos">
      <SecHead eyebrow="Logo" title="Assinatura da marca" />
      {hub.logoStory && (
        <div className="logo-story reveal">
          <div className="prose">{hub.logoStory.paragraphs.map((p, i) => <p key={i}>{p}</p>)}</div>
          {hub.logoStory.points && hub.logoStory.points.length > 0 && (
            <ul className="story-points">{hub.logoStory.points.map((p) => <li key={p}>{p}</li>)}</ul>
          )}
        </div>
      )}
      {hub.logos.length > 0 ? (
        groups.map((g) => (
        <div key={g.name ?? "logos"}>
        {g.name && <div className="grp-label">{g.name}</div>}
        <div className="grid g2">
          {g.items.map((l) => (
            <div className="card reveal" key={l.file}>
              <div className="logo-vis" style={{ background: l.pad }}><img src={l.src} alt={l.name} /></div>
              <div className="logo-meta">
                <div><div className="lm-name">{l.name}</div><div className="lm-role">{l.role}</div></div>
                <div className="logo-dl">
                  <button className="btn" onClick={() => onDownload(l.src, l.file)}>↓ PNG</button>
                  {l.svg && <button className="btn" onClick={() => onDownload(l.svg!, l.file.replace(/\.[a-z]+$/i, "") + ".svg")}>↓ SVG</button>}
                </div>
              </div>
            </div>
          ))}
        </div>
        </div>
        ))
      ) : (
        <div className="note-card reveal">O logo ainda será publicado aqui.</div>
      )}
      {hub.drive?.assets && (
        <div style={{ marginTop: 22 }} className="reveal">
          <p className="pack-note">Os arquivos vetoriais (SVG/AI/PDF, RGB e CMYK) ficam no pacote completo no Drive.</p>
          <a className="btn btn-gold" href={hub.drive.assets} target="_blank" rel="noopener noreferrer">↗ Abrir pacote completo no Drive</a>
        </div>
      )}
    </section>
  );
}

function Colors({ hub, onCopy }: { hub: HubBrand; onCopy: (hex: string) => void }) {
  return (
    <section id="cores">
      <SecHead eyebrow="Cores" title="Cores da marca" desc="Clique em cima da cor para copiar o seu código hexadecimal." />
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
    </section>
  );
}

function Typography({ hub }: { hub: HubBrand }) {
  return (
    <section id="fontes">
      <SecHead eyebrow="Fontes" title="Fontes que sustentam a marca" />
      {hub.type && hub.type.length > 0 ? (
        <div className="grid" style={{ gap: 18 }}>
          {hub.type.map((t) => (
            <div className="card type-card reveal" key={t.role}>
              <span className="type-role">{t.role} — {t.family}</span>
              {t.sampleImg ? (
                <MaskImg img={t.sampleImg} alt={t.sample} className="type-sample-img" />
              ) : (
                <div className="type-sample" style={{ fontFamily: t.cssFamily ?? undefined, fontWeight: t.sampleWeight }}>{t.sample}</div>
              )}
              {t.pangramImg ? (
                <div className="type-pangram"><MaskImg img={t.pangramImg} alt="Alfabeto da família" className="type-pangram-img" /></div>
              ) : (
                <div className="type-pangram" style={{ fontFamily: t.cssFamily ?? undefined }}>Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk Ll Mm Nn Oo Pp Qq Rr Ss Tt Uu Vv Ww Xx Yy Zz</div>
              )}
              {(t.usage || t.weights) && (
                <div className="type-info">
                  {t.usage && <p className="type-usage">{t.usage}</p>}
                  {t.weights && <div className="type-weights"><span>Pesos</span>{t.weights.join(" · ")}</div>}
                </div>
              )}
              {t.download && (
                <div className="type-dl"><a className="btn" href={t.download} download>↓ Baixar {t.family}</a></div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="note-card reveal"><b>Fontes em documentação.</b> {hub.typeNote}</div>
      )}
      {hub.fontsUrl && (
        <div style={{ marginTop: 22 }} className="reveal">
          <a className="btn btn-gold" href={hub.fontsUrl} target="_blank" rel="noopener noreferrer">↓ Baixar as fontes</a>
        </div>
      )}
    </section>
  );
}

/** Texto renderizado como imagem-máscara: herda a cor do tema (fontes que não podem ser publicadas como arquivo). */
function MaskImg({ img, alt, className }: { img: { src: string; w: number; h: number }; alt: string; className: string }) {
  const url = `url("${img.src}")`;
  return (
    <div
      className={"mask-img " + className}
      role="img"
      aria-label={alt}
      style={{ aspectRatio: `${img.w} / ${img.h}`, WebkitMaskImage: url, maskImage: url }}
    />
  );
}

function Support({ hub, onDownload }: { hub: HubBrand; onDownload: (src: string, file: string) => void }) {
  const items = hub.support ?? [];
  return (
    <section id="apoio">
      <SecHead eyebrow="Elementos de apoio" title="Elementos de apoio" />
      {items.length === 0 && (
        <div className="note-card reveal"><b>Em documentação.</b> Os elementos de apoio da marca serão publicados aqui.</div>
      )}
      {items.map((s) => (
        <div className="support-item" key={s.name}>
          <div className="grp-label">{s.name}</div>
          {s.pattern && (
            <figure className="support-pattern reveal">
              <img src={s.pattern} alt={"Padrão — " + s.name} loading="lazy" />
              <button className="photo-dl" aria-label="Baixar padrão" title="Baixar padrão" onClick={() => onDownload(s.pattern!, photoFile(s.pattern!))}>↓</button>
            </figure>
          )}
          <div className="support-text reveal">
            {s.title && <h3>{s.title}</h3>}
            <div className="prose">{s.paragraphs.map((p, i) => <p key={i}>{p}</p>)}</div>
            {s.uses && s.uses.length > 0 && (
              <ul className="story-points">{s.uses.map((u) => <li key={u}>{u}</li>)}</ul>
            )}
          </div>
          {s.tiles && s.tiles.length > 0 && (
            <>
              <div className="grp-label">As peças</div>
              <div className="tile-grid">
                {s.tiles.map((t, i) => (
                  <button className="tile reveal" key={t} onClick={() => onDownload(t, photoFile(t))} aria-label={"Baixar peça " + (i + 1)} title="Baixar peça">
                    <img src={t} alt={"Peça " + (i + 1)} loading="lazy" />
                  </button>
                ))}
              </div>
            </>
          )}
          {s.photos && s.photos.length > 0 && (
            <>
              <div className="grp-label">Aplicados</div>
              <div className="photo-carousel" role="group" aria-label={s.name + " aplicados"}>
                {s.photos.map((p) => (
                  <figure className="photo reveal" key={p.src}>
                    <img src={p.src} alt={p.label} loading="lazy" />
                    <button className="photo-dl" aria-label={"Baixar " + p.label} title="Baixar imagem" onClick={() => onDownload(p.src, photoFile(p.src))}>↓</button>
                    <figcaption className="cap">{p.label}</figcaption>
                  </figure>
                ))}
              </div>
            </>
          )}
        </div>
      ))}
    </section>
  );
}

function Essence({ hub, onRead }: { hub: HubBrand; onRead: () => void }) {
  const e = hub.essence!;
  return (
    <section id="essencia">
      <SecHead eyebrow="Essência" title="Direcionamento estratégico da marca" />
      <div className="prose reveal">
        {e.lead && <p className="lead">{e.lead}</p>}
        {e.proposito && <><div className="grp-label">Propósito</div><p>{e.proposito}</p></>}
        {e.posicionamento && <><div className="grp-label">Posicionamento</div><p>{e.posicionamento}</p></>}
        {e.quote && <div className="quote"><p>“{e.quote}”</p></div>}
        {e.atributos && e.atributos.length > 0 && <><div className="grp-label">Atributos</div><div className="attrs">{e.atributos.map((a) => <span className="tag2" key={a}>{a}</span>)}</div></>}
        <div className="read-more">
          {hub.essenceArticle && (
            <button className="btn btn-gold" onClick={onRead}>Ler a essência completa ↗</button>
          )}
        </div>
      </div>
    </section>
  );
}

function Narrative({ hub, onRead }: { hub: HubBrand; onRead: (index: number) => void }) {
  const items = hub.narratives ?? [];
  return (
    <section id="narrativa">
      <SecHead eyebrow="Narrativa" title="O roteiro de comunicação da marca" />
      <div className="narr-grid">
        {items.map((n, i) => (
          <div className="narr-card reveal" key={n.slug}>
            <div>
              {/* com uma só narrativa, o título repetiria o da seção */}
              {items.length > 1 && <h3 className="narr-title">{n.title}</h3>}
              {n.subtitle && <p className="narr-sub">{n.subtitle}</p>}
            </div>
            {n.closing && <p className="narr-closing">“{n.closing}”</p>}
            <div className="narr-actions">
              <button className="btn btn-gold" onClick={() => onRead(i)}>Ler narrativa completa ↗</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ArticleReader({
  items, index, onClose, onStep,
}: { items: HubArticle[] | null; index: number; onClose: () => void; onStep: (delta: number) => void }) {
  const open = !!items;
  const a = items ? items[index] : null;
  return (
    <>
      <div className={"reader-overlay" + (open ? " open" : "")} onClick={onClose} aria-hidden={!open} />
      <div className={"reader" + (open ? " open" : "")} role="dialog" aria-modal="true" aria-hidden={!open}>
        {a && (
          <>
            <div className="reader-bar">
              <button className="btn" onClick={onClose}>✕ Fechar</button>
              <div className="reader-nav">
                {items && items.length > 1 && (
                  <>
                    <button className="btn" onClick={() => onStep(-1)} disabled={index === 0}>← Anterior</button>
                    <button className="btn" onClick={() => onStep(1)} disabled={index === items.length - 1}>Próximo →</button>
                  </>
                )}
                {a.presentationUrl && (
                  <a className="btn btn-gold" href={a.presentationUrl} target="_blank" rel="noopener noreferrer">↗ Ver apresentação</a>
                )}
              </div>
            </div>
            <div className="reader-inner">
              {a.kicker && <div className="reader-kicker">{a.kicker}</div>}
              <h1>{a.title}</h1>
              {a.subtitle && <p className="reader-sub">{a.subtitle}</p>}
              <article>
                {a.sections.map((s) => (
                  <div key={s.heading}>
                    <h2>{s.heading}</h2>
                    {s.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
                  </div>
                ))}
              </article>
              {a.closing && <div className="reader-closing">“{a.closing}”</div>}
            </div>
          </>
        )}
      </div>
    </>
  );
}

function Verbal({ hub }: { hub: HubBrand }) {
  const v = hub.verbal!;
  const [all, setAll] = useState(false);
  const hasMore = !!(v.territorio || v.recursos?.length || v.manifesto?.length || v.mensagens?.length || v.pitch);
  return (
    <section id="expressao">
      <SecHead eyebrow="Expressão verbal" title="Comunicação da marca" desc="Como a marca soa — e o vocabulário que a mantém fiel a si mesma." />
      {v.naming && v.naming.length > 0 && (
        <div className="vb-names reveal">
          {v.naming.map((n) => (
            <div className="vb-name" key={n.label}><span className="vb-label">{n.label}</span><span className="vb-value">{n.value}</span></div>
          ))}
        </div>
      )}
      <div className="prose reveal">
        {v.tom && <><div className="grp-label">Tom de voz</div><p className="lead">{v.tom}</p></>}
        {v.eNaoE && v.eNaoE.length > 0 && (
          <div className="vb-isnot">
            <div className="vb-isnot-h"><span>É</span><span>Não é</span></div>
            {v.eNaoE.map((x) => <div className="vb-isnot-r" key={x.e}><span>{x.e}</span><span>{x.nao}</span></div>)}
          </div>
        )}
        {v.sim && v.sim.length > 0 && <><div className="grp-label">Vocabulário — sim</div><div className="attrs">{v.sim.map((x) => <span className="tag2" key={x}>{x}</span>)}</div></>}
        {v.nao && v.nao.length > 0 && <><div className="grp-label">Vocabulário — não</div><div className="attrs">{v.nao.map((x) => <span className="tag2" key={x}>{x}</span>)}</div></>}
        {v.superlativo && <div className="note-card" style={{ marginTop: 22 }}><b>Regra do superlativo.</b> {v.superlativo}</div>}
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
      {hasMore && all && (
        <div className="vb-more">
          {v.territorio && (
            <>
              <div className="grp-label">Território de atuação</div>
              <div className="sim-nao">
                <div className="sn sim"><h4>O que faz</h4><ul>{v.territorio.faz.map((x) => <li key={x}>{x}</li>)}</ul></div>
                <div className="sn nao"><h4>O que não faz</h4><ul>{v.territorio.naoFaz.map((x) => <li key={x}>{x}</li>)}</ul></div>
              </div>
            </>
          )}
          {v.recursos && v.recursos.length > 0 && (
            <>
              <div className="grp-label">Recursos comunicacionais</div>
              <ol className="vb-recursos">
                {v.recursos.map((r) => <li key={r.title}><b>{r.title}.</b>{r.text && " " + r.text}</li>)}
              </ol>
            </>
          )}
          {v.manifesto && v.manifesto.length > 0 && (
            <>
              <div className="grp-label">Manifesto</div>
              <div className="vb-manifesto">{v.manifesto.map((p, i) => <p key={i}>{p}</p>)}</div>
            </>
          )}
          {v.mensagens && v.mensagens.length > 0 && (
            <>
              <div className="grp-label">Mensagens-chave</div>
              <div className="vb-msgs">
                {v.mensagens.map((m) => (
                  <div className="vb-msg" key={m.label}>
                    <span className="vb-label">{m.label}</span>
                    <ul>{m.items.map((x) => <li key={x}>{x}</li>)}</ul>
                  </div>
                ))}
              </div>
            </>
          )}
          {v.pitch && (
            <>
              <div className="grp-label">Pitch elevator</div>
              <div className="quote"><p>{v.pitch}</p></div>
            </>
          )}
        </div>
      )}
      {hasMore && (
        <div className="read-more">
          <button className="btn btn-gold" onClick={() => setAll((x) => !x)} aria-expanded={all}>
            {all ? "Ver menos ↑" : "Ver tudo ↓"}
          </button>
        </div>
      )}
    </section>
  );
}

/** Nome de arquivo para download a partir do caminho da imagem. */
function photoFile(src: string) {
  return src.split("/").pop() ?? "imagem.jpg";
}

function InUse({ hub, onDownload }: { hub: HubBrand; onDownload: (src: string, file: string) => void }) {
  // Agrupa as fotos preservando a ordem dos grupos
  const photos = hub.photos ?? [];
  const groups: { name: string; items: typeof photos }[] = [];
  photos.forEach((p) => {
    const name = p.group ?? "Aplicações";
    let g = groups.find((x) => x.name === name);
    if (!g) { g = { name, items: [] }; groups.push(g); }
    g.items.push(p);
  });
  // Ordem de navegação do lightbox = ordem visual (grupo a grupo)
  const flat = groups.flatMap((g) => g.items);
  const [open, setOpen] = useState<number | null>(null);
  const current = open === null ? null : flat[open];

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      else if (e.key === "ArrowRight") setOpen((i) => (i === null ? i : (i + 1) % flat.length));
      else if (e.key === "ArrowLeft") setOpen((i) => (i === null ? i : (i - 1 + flat.length) % flat.length));
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = prevOverflow; };
  }, [open, flat.length]);

  const step = (d: number) => setOpen((i) => (i === null ? i : (i + d + flat.length) % flat.length));

  return (
    <section id="aplicacoes">
      <SecHead eyebrow="Aplicações" title="A marca no mundo real" />
      {groups.length > 0 ? (
        groups.map((g) => (
          <div key={g.name}>
            {/* "Aplicações" já é o nome da seção — não repete como rótulo */}
            {g.name !== "Aplicações" && <div className="grp-label">{g.name}</div>}
            <div className="photo-carousel" role="group" aria-label={g.name}>
              {g.items.map((p) => (
                <figure
                  className={"photo zoomable reveal" + (p.fit === "contain" ? " contain" : "")}
                  key={p.src}
                  style={p.pad ? { background: p.pad } : undefined}
                  role="button"
                  tabIndex={0}
                  aria-label={"Ampliar: " + p.label}
                  onClick={() => setOpen(flat.indexOf(p))}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setOpen(flat.indexOf(p)); } }}
                >
                  <img src={p.src} alt={p.label} loading="lazy" />
                  <button
                    className="photo-dl"
                    aria-label={"Baixar " + p.label}
                    title="Baixar imagem"
                    onClick={(e) => { e.stopPropagation(); onDownload(p.src, photoFile(p.src)); }}
                  >↓</button>
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
      {hub.conceptDeck && (
        <div style={{ marginTop: 22 }} className="reveal">
          <a className="btn btn-gold" href={hub.conceptDeck} target="_blank" rel="noopener noreferrer">↗ Ver apresentação do conceito visual (PDF)</a>
        </div>
      )}
      {current && open !== null && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={current.label} onClick={() => setOpen(null)}>
          <button className="lb-btn lb-close" aria-label="Fechar" onClick={() => setOpen(null)}>✕</button>
          {flat.length > 1 && <button className="lb-btn lb-prev" aria-label="Anterior" onClick={(e) => { e.stopPropagation(); step(-1); }}>‹</button>}
          <figure className="lb-figure" onClick={(e) => e.stopPropagation()}>
            <img src={current.src} alt={current.label} style={current.pad ? { background: current.pad } : undefined} />
            <figcaption className="lb-bar">
              <span className="lb-count">{open + 1} / {flat.length}</span>
              <span className="lb-cap">{current.group ? current.group + " · " : ""}{current.label}</span>
              <button className="btn btn-gold" onClick={() => onDownload(current.src, photoFile(current.src))}>↓ Baixar</button>
            </figcaption>
          </figure>
          {flat.length > 1 && <button className="lb-btn lb-next" aria-label="Próxima" onClick={(e) => { e.stopPropagation(); step(1); }}>›</button>}
        </div>
      )}
    </section>
  );
}

function AIGuide({ md, onCopy, onDownload, onDownloadSkill }: { md: string; onCopy: () => void; onDownload: () => void; onDownloadSkill: () => void }) {
  return (
    <section id="ia">
      <SecHead eyebrow="IA" title="Insumos para uso de IA na marca" />
      <div className="ai-card reveal">
        <p>
          Gerado a partir do próprio Brand System, então nunca fica desatualizado. Duas formas de usar:
          o <code>brand.md</code> para colar em qualquer chat, ou a <code>SKILL.md</code> — uma skill pronta
          pra soltar no Claude Code / Codex Cloud, que faz apresentações e peças saírem sempre no seu
          design system (mesmas cores, tipografia e tom).
        </p>
        <div className="ai-actions">
          <button className="btn btn-gold" onClick={onCopy}>Copiar guia</button>
          <button className="btn" onClick={onDownload}>Baixar brand.md</button>
          <button className="btn" onClick={onDownloadSkill}>Baixar skill (SKILL.md)</button>
        </div>
        <pre className="ai-preview">{md}</pre>
      </div>
    </section>
  );
}
