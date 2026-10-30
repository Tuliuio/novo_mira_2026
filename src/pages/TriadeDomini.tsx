import { SiteNav } from "@/components/SiteNav";

/**
 * Tríade Brasil + Domini — diagnóstico de marca e presença (HTML/CSS autossuficiente).
 *
 * Mesmo padrão do /propostas/costao: o conteúdo vive em
 * /public/clients/triade-domini/diagnostico.html (prints em ./diagnostico/) e é
 * exibido via <iframe>. Rota sem acento de propósito. O menu do site fica fixo
 * por cima, numa faixa própria, para a pessoa poder navegar pelo site.
 */
export function TriadeDomini() {
  return (
    <div className="h-dvh bg-[#141210] pt-[68px] md:pt-[76px]">
      <SiteNav standalone />
      <iframe
        src="/clients/triade-domini/diagnostico.html"
        title="Diagnóstico Tríade + Domini · Mira Brand Studio"
        className="block h-full w-full border-0 bg-[#141210]"
      />
    </div>
  );
}
