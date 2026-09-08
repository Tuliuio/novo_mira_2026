/**
 * Exportação do Brand System de um cliente para Markdown.
 *
 * Gera um .md limpo e completo que o cliente pode usar no dia a dia —
 * copiar cores, tom de voz, tipografia — e alimentar ferramentas de
 * marketing/IA. Percorre o Método Mira na ordem canônica e só inclui
 * os elementos que o cliente realmente possui.
 */
import type { ClientBrand, ContentBlock } from "./content";
import { METHOD, pillarItems } from "./method";

function blockToMd(b: ContentBlock): string {
  switch (b.type) {
    case "lead":
    case "paragraph":
      return b.text;
    case "list":
      return b.items.map((i) => `- ${i}`).join("\n");
    case "quote":
      return `> ${b.text}${b.author ? `\n>\n> — ${b.author}` : ""}`;
    case "stat":
      return b.items.map((s) => `- **${s.label}:** ${s.value}`).join("\n");
    case "colors":
      return b.colors
        .map((c) => `- **${c.name}** — \`${c.hex}\`${c.usage ? ` — ${c.usage}` : ""}`)
        .join("\n");
    case "type":
      return b.fonts.map((f) => `- **${f.name}** — ${f.role}`).join("\n");
    case "image":
      return `![${b.alt}](${b.src})${b.caption ? `\n\n*${b.caption}*` : ""}`;
    case "gallery":
      return b.images.map((im) => `![${im.alt}](${im.src})`).join("\n\n");
    case "files":
      return b.files.map((f) => `- [${f.name}](${f.href})`).join("\n");
    case "embed":
      return `[${b.title}](${b.src})`;
  }
}

/** Converte todo o Brand System de um cliente em um documento Markdown. */
export function clientToMarkdown(client: ClientBrand): string {
  const out: string[] = [];
  out.push(`# ${client.name} — Brand System`);
  if (client.tagline) out.push(`> ${client.tagline}`);
  out.push(
    `_Documento gerado pela Mira Brand Studio — Método Mira: Essência · Narrativa · Expressão._`,
  );

  for (const pillar of METHOD) {
    const items = pillarItems(pillar).filter((it) => it.id in client.pages);
    if (items.length === 0) continue;

    out.push(`\n---\n`);
    out.push(`## ${pillar.number} · ${pillar.label}`);

    for (const it of items) {
      const page = client.pages[it.id];
      out.push(`### ${page.title}`);
      if (page.subtitle) out.push(`_${page.subtitle}_`);
      for (const b of page.blocks) out.push(blockToMd(b));
    }
  }

  return out.join("\n\n") + "\n";
}

/** Dispara o download do .md no navegador do cliente. */
export function downloadClientMarkdown(client: ClientBrand) {
  const md = clientToMarkdown(client);
  const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${client.slug}-brand-system.md`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
