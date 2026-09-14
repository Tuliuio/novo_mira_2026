/**
 * Costão × Mira — proposta de desenvolvimento & autonomia digital
 * (HTML/CSS/JS autossuficiente).
 *
 * Mesmo padrão do /oka e /metodo: o conteúdo vive em /public/costao.html e é
 * exibido via <iframe> para rodar exatamente como foi construído, sem conflito
 * com o React. A rota /propostas/costao é servida pelo SPA; o iframe carrega o
 * arquivo estático. (Sem acento na URL de propósito — acento em path quebra.)
 */
export function Costao() {
  return (
    <iframe
      src="/costao.html"
      title="Costão × Mira · Proposta de desenvolvimento & autonomia digital"
      className="block h-screen w-full border-0 bg-[#050505]"
    />
  );
}
