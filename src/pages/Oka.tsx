/**
 * OKA × Mira — proposta de (re)branding (HTML/CSS/JS autossuficiente).
 *
 * Mesmo padrão do /metodo: o conteúdo vive em /public/oka.html e é exibido
 * via <iframe> para rodar exatamente como foi construído, sem conflito com o
 * React. A rota /oka é servida pelo SPA; o iframe carrega o arquivo estático.
 */
export function Oka() {
  return (
    <iframe
      src="/oka.html"
      title="OKA × Mira · Proposta de (re)branding"
      className="block h-screen w-full border-0 bg-[#050505]"
    />
  );
}
