/**
 * Método Mira — estrutura canônica da metodologia.
 *
 * Três pilares (Essência → Storytelling → Expressão) que organizam o
 * Brand OS de cada cliente. A navegação lateral da área interna é gerada
 * diretamente a partir daqui.
 */

export type ItemStatus = "ready" | "draft" | "empty";

export interface MethodItem {
  /** slug usado na URL: /app/:pillar/:item */
  id: string;
  label: string;
  /** condicional = nem todo projeto contrata este item */
  optional?: boolean;
}

export interface MethodSubgroup {
  id: string;
  label: string;
  items: MethodItem[];
}

export interface MethodPillar {
  id: string;
  /** "01" | "02" | "03" */
  number: string;
  label: string;
  tagline: string;
  /** lista simples (Essência, Storytelling) */
  items?: MethodItem[];
  /** agrupada (Expressão) */
  subgroups?: MethodSubgroup[];
}

export const METHOD: MethodPillar[] = [
  {
    id: "essencia",
    number: "01",
    label: "Essência",
    tagline: "Quem a marca é, por dentro.",
    items: [
      { id: "publico-ideal", label: "Público ideal" },
      { id: "proposito", label: "Propósito" },
      { id: "valores", label: "Valores" },
      { id: "diferenciais", label: "Diferenciais" },
      { id: "personalidade", label: "Personalidade" },
      { id: "posicionamento", label: "Posicionamento" },
      { id: "promessa", label: "Promessa" },
      { id: "visao-de-futuro", label: "Visão de futuro" },
      { id: "ecossistema", label: "Ecossistema de negócios", optional: true },
    ],
  },
  {
    id: "storytelling",
    number: "02",
    label: "Storytelling",
    tagline: "A narrativa que move a marca.",
    items: [
      { id: "heroi", label: "O Herói" },
      { id: "problema", label: "O Problema" },
      { id: "guia", label: "O Guia" },
      { id: "plano", label: "O Plano" },
      { id: "chamado", label: "O Chamado à Ação" },
      { id: "em-jogo", label: "O Que Está em Jogo" },
      { id: "final-feliz", label: "O Final Feliz" },
      { id: "transformacao", label: "A Transformação" },
      { id: "sintese", label: "Síntese" },
    ],
  },
  {
    id: "expressao",
    number: "03",
    label: "Expressão",
    tagline: "Como a marca se mostra ao mundo.",
    subgroups: [
      {
        id: "verbal",
        label: "Verbal",
        items: [
          { id: "tom-de-voz", label: "Tom de voz" },
          { id: "manifesto", label: "Manifesto" },
          { id: "frases-de-impacto", label: "Frases de impacto" },
          { id: "slogan", label: "Slogan" },
        ],
      },
      {
        id: "visual",
        label: "Visual",
        items: [
          { id: "naming", label: "Naming", optional: true },
          { id: "conceito-visual", label: "Conceito visual" },
          { id: "logo-simbolo", label: "Logo e símbolo" },
          { id: "cores", label: "Cores" },
          { id: "tipografias", label: "Tipografias" },
          { id: "elementos-graficos", label: "Elementos gráficos" },
          { id: "manual-de-uso", label: "Manual de uso e versões" },
        ],
      },
      {
        id: "design",
        label: "Design",
        items: [
          { id: "papelaria", label: "Papelaria", optional: true },
          { id: "templates-sociais", label: "Templates de redes sociais", optional: true },
          { id: "aplicacoes-digitais", label: "Aplicações digitais", optional: true },
          { id: "website", label: "Website / Landing page", optional: true },
          { id: "pitch", label: "Pitch institucional", optional: true },
        ],
      },
    ],
  },
];

/** Acha o pilar pelo slug. */
export function findPillar(pillarId: string): MethodPillar | undefined {
  return METHOD.find((p) => p.id === pillarId);
}

/** Lista plana de todos os itens de um pilar (achatando subgrupos). */
export function pillarItems(pillar: MethodPillar): MethodItem[] {
  if (pillar.items) return pillar.items;
  return (pillar.subgroups ?? []).flatMap((g) => g.items);
}
