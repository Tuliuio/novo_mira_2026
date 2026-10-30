/**
 * Tríade Brasil + Domini — diagnóstico de marca e presença (HTML/CSS autossuficiente).
 *
 * Mesmo padrão do /propostas/costao: o conteúdo vive em
 * /public/clients/triade-domini/diagnostico.html (prints em ./diagnostico/) e é
 * exibido via <iframe>. Rota sem acento de propósito.
 */
export function TriadeDomini() {
  return (
    <iframe
      src="/clients/triade-domini/diagnostico.html"
      title="Diagnóstico Tríade + Domini · Mira Brand Studio"
      className="block h-screen w-full border-0 bg-[#141210]"
    />
  );
}
