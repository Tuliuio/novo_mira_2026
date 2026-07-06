/**
 * Método Órbita — diagrama interativo (HTML/SVG/JS autossuficiente).
 *
 * O conteúdo vive em /public/metodo.html e é exibido via <iframe> para rodar
 * exatamente como foi construído (script próprio manipulando o DOM), sem
 * conflito com o React. A rota /metodo é servida pelo SPA; o iframe carrega
 * o arquivo estático real.
 */
export function Metodo() {
  return (
    <iframe
      src="/metodo.html"
      title="Método Mira · Mira Brand Studio"
      className="block h-screen w-full border-0 bg-[#050505]"
    />
  );
}
