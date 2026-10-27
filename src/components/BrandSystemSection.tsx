import { useState } from "react";
import { Eyebrow } from "@/components/Eyebrow";
import { copyText } from "@/lib/color";

/** Paleta real da Mira — o mockup mostra o próprio Brand System da Mira. */
const SWATCHES = [
  { name: "Ink", hex: "#141210" },
  { name: "Dourado", hex: "#E3B23C" },
  { name: "Creme", hex: "#F4EFE2" },
  { name: "Ouro velho", hex: "#8A6D1F" },
];

const NAV = ["Logos", "Cores", "Fontes", "Essência", "Narrativa", "Aplicações", "IA"];

const BENEFITS = [
  { t: "Sempre atualizado", d: "Um link só. Nunca mais uma versão velha do logo circulando." },
  { t: "Copiar e baixar num clique", d: "HEX, RGB e CMYK, logos em vetor, fontes e aplicações." },
  { t: "Para o time e os fornecedores", d: "Acesso de qualquer lugar, sem anexos nem pastas perdidas." },
  { t: "Pronto para IA", d: "Sua marca vira instrução para as ferramentas de IA do seu time." },
];

const COMPARE: [string, string][] = [
  ["Um PDF de 80 páginas", "Um link vivo, navegável"],
  ["Versões perdidas no Drive", "Sempre a versão mais recente"],
  ["Copiar cor do print", "HEX, RGB e CMYK num clique"],
  ["Fica pronto e para no tempo", "Cresce junto com a marca"],
];

/* --------------------------------------------- Mockup do Brand System */
function BrandSystemMock() {
  const [copied, setCopied] = useState<string | null>(null);
  async function copy(hex: string) {
    if (await copyText(hex)) {
      setCopied(hex);
      setTimeout(() => setCopied((c) => (c === hex ? null : c)), 1400);
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-ink-900 shadow-[0_40px_80px_-40px_rgba(12,10,7,0.6)]">
      {/* barra do navegador */}
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
        <span className="size-2.5 rounded-full bg-white/15" />
        <span className="size-2.5 rounded-full bg-white/15" />
        <span className="size-2.5 rounded-full bg-white/15" />
        <span className="ml-3 truncate rounded-full bg-white/5 px-3 py-1 text-[11px] text-fog">
          somosmira.com.br/app · Brand System
        </span>
      </div>

      <div className="flex h-[420px]">
        {/* menu lateral */}
        <nav className="hidden w-36 shrink-0 border-r border-white/10 p-4 sm:block">
          <img src="/mira-wordmark-light.png" alt="Mira" className="h-5 w-auto" />
          <ul className="mt-6 space-y-2.5 text-[12px] text-fog">
            {NAV.map((n, i) => (
              <li key={n} className={i === 1 ? "text-accent-400" : ""}>
                {n}
              </li>
            ))}
          </ul>
        </nav>

        {/* conteúdo rolando sozinho (pausa no hover) */}
        <div className="relative flex-1 overflow-hidden">
          <div className="bs-scroll space-y-5 p-5">
            <div className="grid place-items-center rounded-xl bg-ink-950 py-10">
              <img src="/mira-wordmark-light.png" alt="" className="h-12 w-auto" />
            </div>

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-fog">Cores · clique para copiar</p>
              <div className="mt-2.5 grid grid-cols-2 gap-2.5">
                {SWATCHES.map((s) => (
                  <button
                    key={s.hex}
                    type="button"
                    onClick={() => copy(s.hex)}
                    className="overflow-hidden rounded-lg border border-white/10 text-left transition-transform hover:scale-[1.02]"
                  >
                    <span className="block h-14" style={{ background: s.hex }} />
                    <span className="flex items-center justify-between bg-ink-800 px-2.5 py-1.5 text-[11px]">
                      <span className="text-cream">{s.name}</span>
                      <span className="text-fog">{copied === s.hex ? "Copiado ✓" : s.hex}</span>
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-ink-800 p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-fog">Fontes</p>
              <div className="mt-2 flex items-end gap-5">
                <span className="text-5xl font-bold text-cream" style={{ fontFamily: "var(--font-display)" }}>
                  Aa
                </span>
                <span className="pb-1.5 text-[12px] leading-snug text-fog">
                  <span className="block text-cream">Sora · títulos</span>
                  Inter · textos
                </span>
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-ink-800 p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-fog">Essência</p>
              <p className="mt-2 text-lg font-semibold text-cream" style={{ fontFamily: "var(--font-display)" }}>
                Cada marca é um universo.
              </p>
            </div>

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-fog">Aplicações</p>
              <div className="mt-2.5 grid grid-cols-2 gap-2.5">
                {["01", "05", "09", "14"].map((n) => (
                  <img
                    key={n}
                    src={`/cases/case-${n}.png`}
                    alt=""
                    loading="lazy"
                    className="aspect-square w-full rounded-lg object-cover"
                  />
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-accent-500/25 bg-ink-950 p-4 font-mono text-[11px] leading-relaxed text-fog">
              <span className="text-accent-400"># brand.md</span>
              <br />
              cores: ink #141210 · dourado #E3B23C
              <br />
              fontes: Sora (títulos), Inter (textos)
            </div>
          </div>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-ink-900 to-transparent" />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------ Seção */
export function BrandSystemSection() {
  return (
    <section id="brand-system" className="border-t border-black/5 bg-white py-24">
      <div className="mx-auto max-w-6xl px-6">
        <Eyebrow>A entrega Mira</Eyebrow>
        <h2
          className="mt-5 max-w-3xl text-balance text-3xl font-bold tracking-tight text-ink-900 md:text-5xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Sua marca não cabe num PDF.
        </h2>
        <p className="mt-5 max-w-2xl text-balance text-lg text-stone-500">
          Todo projeto da Mira é entregue num Brand System digital e exclusivo:
          um lugar vivo onde a marca inteira mora, da essência às aplicações.
        </p>

        <div className="mt-14 grid items-center gap-12 lg:grid-cols-[1.15fr_1fr]">
          <BrandSystemMock />
          <ul className="space-y-7">
            {BENEFITS.map((b) => (
              <li key={b.t} className="flex gap-4">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent-500" />
                <div>
                  <p className="font-semibold text-ink-900" style={{ fontFamily: "var(--font-display)" }}>
                    {b.t}
                  </p>
                  <p className="mt-1 text-[15px] leading-relaxed text-stone-500">{b.d}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* manual tradicional × Brand System */}
        <div className="mt-20 overflow-hidden rounded-3xl border border-black/10">
          <div className="grid grid-cols-2 bg-paper text-xs font-semibold uppercase tracking-[0.18em]">
            <p className="px-5 py-4 text-stone-400 md:px-8">Manual tradicional</p>
            <p className="border-l border-black/10 px-5 py-4 text-gold-700 md:px-8">Brand System Mira</p>
          </div>
          {COMPARE.map(([a, b]) => (
            <div key={a} className="grid grid-cols-2 border-t border-black/5 text-[15px]">
              <p className="px-5 py-4 text-stone-400 line-through decoration-stone-300 md:px-8">{a}</p>
              <p className="border-l border-black/10 px-5 py-4 font-medium text-ink-900 md:px-8">{b}</p>
            </div>
          ))}
        </div>

        {/* IA — o diferencial mais atual */}
        <div className="relative mt-6 overflow-hidden rounded-3xl bg-ink-900 px-8 py-12 text-cream md:px-14 md:py-16">
          <div className="starfield pointer-events-none absolute inset-0 opacity-40" />
          <div className="relative grid items-center gap-10 md:grid-cols-[1.3fr_1fr]">
            <div>
              <Eyebrow tone="dark">Pronto para IA</Eyebrow>
              <h3
                className="mt-5 text-balance text-2xl font-bold tracking-tight md:text-4xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Sua marca, falando a língua da IA.
              </h3>
              <p className="mt-4 max-w-lg text-fog">
                O Brand System gera um guia da marca para colar em qualquer chat
                de IA e uma skill pronta para o Claude Code e o Codex. Toda peça
                gerada já sai com suas cores, fontes e tom de voz.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-ink-950/70 p-5 font-mono text-[12px] leading-relaxed text-fog backdrop-blur-sm">
              <p className="text-accent-400">marca-sua-marca-SKILL.md</p>
              <p className="mt-2">→ use sempre as cores da marca</p>
              <p>→ títulos em Sora, textos em Inter</p>
              <p>→ tom de voz: próximo, seguro, sem jargão</p>
              <p className="mt-2 text-cream/70">✓ gerado do Brand System</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
