/**
 * Conteúdo do Brand OS de um cliente.
 *
 * Cada item do Método Mira pode receber uma página composta por "blocos"
 * tipados (texto, listas, cores, tipografia...). Isto desacopla a estrutura
 * da metodologia (method.ts) do conteúdo real de cada marca — e está pronto
 * para, no futuro, ser servido por uma API (Supabase) em vez de hardcoded.
 *
 * Conteúdo da Adapto extraído do Brandbook Adapto 2026 (entrega real da Mira).
 */

export type ContentBlock =
  | { type: "lead"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] }
  | { type: "quote"; text: string; author?: string }
  | { type: "stat"; items: { label: string; value: string }[] }
  | { type: "colors"; colors: { name: string; hex: string; usage?: string }[] }
  | { type: "type"; fonts: { name: string; role: string; preview: string }[] };

export interface BrandPage {
  title: string;
  subtitle?: string;
  blocks: ContentBlock[];
}

export interface ClientBrand {
  slug: string;
  name: string;
  tagline: string;
  /** cor de destaque da marca do cliente (acento da própria identidade dele) */
  accent: string;
  /** mapeia item.id (do method.ts) -> página de conteúdo */
  pages: Record<string, BrandPage>;
}

/* ------------------------------------------------------------------ *
 * Cliente — Adapto (Indústria de manufatura aditiva / Impressão 3D)
 * ------------------------------------------------------------------ */
export const DEMO_CLIENT: ClientBrand = {
  slug: "adapto",
  name: "Adapto",
  tagline: "Você imagina. A gente faz acontecer.",
  accent: "#6338CE",
  pages: {
    /* ---------------------------------------------------- 01 Essência */
    proposito: {
      title: "Propósito",
      subtitle: "Por que a Adapto existe além do produto.",
      blocks: [
        {
          type: "lead",
          text: "A Adapto existe para reduzir a distância entre uma necessidade real e a capacidade de torná-la física, viável e funcional.",
        },
        {
          type: "paragraph",
          text: "Em mercados tradicionais, ideias, demandas específicas e problemas operacionais são caros demais para produzir, demoram demais para serem resolvidos e não justificam moldes, ferramentas ou processos industriais clássicos. A Adapto surge exatamente nesse vazio.",
        },
        {
          type: "quote",
          text: "A marca não existe para tornar possível imprimir objetos, mas para resolver problemas físicos, viabilizar produções personalizadas e materializar ideias que antes ficavam só no “será que dá?”.",
        },
      ],
    },
    "visao-de-futuro": {
      title: "Visão de futuro",
      subtitle: "Onde a marca quer chegar.",
      blocks: [
        {
          type: "lead",
          text: "Ser a principal referência em manufatura aditiva aplicada e produção personalizada em escala no estado — reconhecida pela confiabilidade, capacidade produtiva e inteligência na solução de problemas físicos.",
        },
        {
          type: "list",
          items: [
            "A marca é lembrada antes mesmo de o cliente saber exatamente o que precisa.",
            "Empresas e indústrias recorrem à Adapto como parceira técnica, não como fornecedor genérico.",
            "A impressão 3D deixa de ser protagonista — o resultado é o foco.",
            "Crescer com organização, clareza e reputação, não apenas em volume.",
          ],
        },
      ],
    },
    valores: {
      title: "Valores",
      subtitle: "O que guia decisões, entregas e relações. Não são aspiracionais — já aparecem na prática.",
      blocks: [
        {
          type: "list",
          items: [
            "Funcionalidade acima de estética — tudo precisa funcionar, durar e resolver. Beleza é consequência.",
            "Responsabilidade produtiva — produzir algo físico implica impacto, custo e responsabilidade.",
            "Clareza técnica — explica o que faz, como faz e até onde vai. Não vende ilusão.",
            "Viabilidade real — se não faz sentido técnico ou financeiro, não força soluções artificiais.",
            "Evolução contínua — aprendizado e adaptação, do artesanato à indústria.",
          ],
        },
      ],
    },
    diferenciais: {
      title: "Diferenciais",
      subtitle: "O que torna a Adapto difícil de copiar.",
      blocks: [
        {
          type: "lead",
          text: "O grande diferencial não é tecnológico, mas estrutural: capacidade de produção em escala em manufatura aditiva, num mercado dominado por pequenos operadores.",
        },
        {
          type: "stat",
          items: [
            { label: "Confiabilidade", value: "Entrega com repetibilidade" },
            { label: "Recorrência", value: "Parceria técnica contínua" },
            { label: "Autoridade silenciosa", value: "Escala onde quase ninguém tem" },
          ],
        },
      ],
    },
    personalidade: {
      title: "Personalidade",
      subtitle: "Como a marca age, fala e se posiciona.",
      blocks: [
        {
          type: "stat",
          items: [
            { label: "É", value: "Segura, competente, didática, resolutiva, surpreendentemente acessível" },
            { label: "Não é", value: "Futurista exagerada, tech demais, maker cool, startup barulhenta" },
          ],
        },
        {
          type: "quote",
          text: "A marca fala com quem precisa resolver, não com quem quer impressionar.",
        },
      ],
    },
    "publico-ideal": {
      title: "Público ideal (ICP)",
      subtitle: "A Adapto se organiza por tipos de problema e demanda — não por segmentos amplos.",
      blocks: [
        {
          type: "paragraph",
          text: "Público prioritário (Core ICP) — Pessoa Jurídica, em dois grupos complementares:",
        },
        {
          type: "list",
          items: [
            "A. Produção personalizada em escala: brindes corporativos, séries especiais, moldes para resina, peças repetitivas. Buscam volume, prazo, confiabilidade e capacidade produtiva real.",
            "B. Resolução de problemas físicos específicos: indústrias, manutenção, engenharia, operações técnicas. Buscam solução, funcionalidade e rapidez.",
          ],
        },
        {
          type: "quote",
          text: "Esse público geralmente não sabe que a solução existe. A venda começa pela educação.",
        },
        {
          type: "paragraph",
          text: "Secundários (não estruturantes): pessoa física curiosa, hobbyistas, confeitaria (transitório), demandas artesanais isoladas. Podem existir, mas não definem a marca.",
        },
      ],
    },
    posicionamento: {
      title: "Posicionamento",
      subtitle: "Como a marca deve ser entendida.",
      blocks: [
        {
          type: "lead",
          text: "Uma indústria de manufatura aditiva sob demanda, com capacidade de produção em escala, especializada em transformar necessidades reais em soluções físicas viáveis.",
        },
        {
          type: "list",
          items: [
            "Indústria — produção.",
            "Serviço — adaptação e desenvolvimento.",
            "Inteligência aplicada — não venda de tecnologia.",
          ],
        },
        { type: "quote", text: "A impressão 3D é meio. O resultado é o valor." },
      ],
    },
    promessa: {
      title: "Promessa central",
      subtitle: "O compromisso que sustenta a relação com o mercado.",
      blocks: [
        {
          type: "quote",
          text: "Se isso precisa existir no mundo físico, nós encontramos uma forma viável de produzir.",
        },
        {
          type: "paragraph",
          text: "A promessa não é velocidade, nem inovação, nem tecnologia. Ela se manifesta em encantamento (o cliente não imaginava que era possível), segurança (confia que será entregue) e resultado (o objeto cumpre sua função).",
        },
      ],
    },

    /* ------------------------------------------------ 02 Storytelling */
    heroi: {
      title: "O Herói",
      subtitle: "O herói não é a Adapto — é o cliente.",
      blocks: [
        {
          type: "lead",
          text: "O herói é o cliente PJ que precisa resolver algo no mundo físico: uma empresa, indústria ou operação técnica com uma necessidade real.",
        },
        {
          type: "list",
          items: [
            "Precisa materializar algo, mas não domina os meios para resolvê-la.",
            "Não sabe exatamente o que pedir.",
            "Muitas vezes nem sabe que a solução existe.",
          ],
        },
      ],
    },
    problema: {
      title: "O Problema",
      subtitle: "As três camadas que impedem o herói de avançar.",
      blocks: [
        {
          type: "stat",
          items: [
            { label: "Externo", value: "Produzir é caro e demora; a indústria tradicional é lenta e engessada" },
            { label: "Interno", value: "Insegurança e medo de errar — “será que isso dá pra fazer?”" },
            { label: "Filosófico", value: "Ideias reais não deveriam morrer por limitações produtivas" },
          ],
        },
      ],
    },
    guia: {
      title: "O Guia",
      subtitle: "A Adapto entra como guia — ao lado do herói, não acima dele.",
      blocks: [
        {
          type: "paragraph",
          text: "Empatia: “Nós sabemos como é ter uma necessidade real e não encontrar quem resolva.” A marca já percorreu esse caminho — evoluiu do artesanal para a escala.",
        },
        {
          type: "list",
          items: [
            "Autoridade — capacidade de produção em escala.",
            "Experiência com indústria, brindes, moldes e peças técnicas.",
            "Repetibilidade, confiabilidade e entrega.",
          ],
        },
      ],
    },
    plano: {
      title: "O Plano",
      subtitle: "Simples e conceitual: o cliente só precisa dar o primeiro passo.",
      blocks: [
        {
          type: "list",
          items: [
            "1. Entender o problema real — o cliente chega com uma necessidade, não com um pedido fechado.",
            "2. Traduzir a necessidade em solução viável.",
            "3. Produzir com escala e responsabilidade — a solução vira física, funcional e confiável.",
          ],
        },
      ],
    },
    chamado: {
      title: "O Chamado à Ação",
      subtitle: "Sem CTA não existe história que avance.",
      blocks: [
        {
          type: "quote",
          text: "Traga sua necessidade. Nós encontramos uma forma viável de produzir.",
        },
        {
          type: "list",
          items: [
            "Veja o que é possível produzir.",
            "Entenda como a manufatura aditiva pode resolver seu problema.",
            "Fale com quem já produz em escala.",
          ],
        },
      ],
    },
    "em-jogo": {
      title: "O Que Está em Jogo",
      subtitle: "O que acontece se o herói não agir.",
      blocks: [
        {
          type: "list",
          items: [
            "A ideia não sai do papel.",
            "O problema continua.",
            "O custo aumenta e o prazo estoura.",
            "A solução vira improviso.",
          ],
        },
        {
          type: "quote",
          text: "Se eu não resolver isso agora, vou perder tempo, dinheiro ou oportunidade.",
        },
      ],
    },
    "final-feliz": {
      title: "O Final Feliz",
      subtitle: "Como é o mundo depois que o herói vence.",
      blocks: [
        {
          type: "list",
          items: [
            "A necessidade vira objeto físico.",
            "O problema é resolvido e a produção acontece.",
            "A entrega é confiável; o cliente ganha segurança e resultado.",
          ],
        },
        {
          type: "stat",
          items: [
            { label: "Surpresa", value: "“eu não sabia que dava”" },
            { label: "Confiança", value: "“funcionou”" },
            { label: "Alívio", value: "“foi resolvido”" },
          ],
        },
      ],
    },
    transformacao: {
      title: "A Transformação",
      subtitle: "Quem o herói se torna depois da jornada.",
      blocks: [
        {
          type: "stat",
          items: [
            { label: "Antes", value: "Dependente da indústria tradicional, limitado e inseguro" },
            { label: "Depois", value: "Capaz de viabilizar soluções: mais ágil, confiante e competitivo" },
          ],
        },
      ],
    },
    sintese: {
      title: "Síntese",
      subtitle: "A história da marca em uma linha.",
      blocks: [
        {
          type: "quote",
          text: "Empresas com necessidades reais enfrentam um sistema produtivo lento e inviável. A Adapto entra como parceira técnica para tornar possível, viável e escalável aquilo que parecia impossível de produzir.",
        },
      ],
    },

    /* -------------------------------------------------- 03 Expressão */
    "tom-de-voz": {
      title: "Tom de voz",
      subtitle: "Como a Adapto soa.",
      blocks: [
        {
          type: "lead",
          text: "Educativo e resolutivo — a venda acontece no momento em que o cliente entende o potencial da tecnologia.",
        },
        {
          type: "stat",
          items: [
            { label: "É", value: "Didático, seguro, pragmático" },
            { label: "Não é", value: "Hypado, jargão vazio, futurista" },
            { label: "Assinatura", value: "“A gente faz acontecer.”" },
          ],
        },
      ],
    },
    manifesto: {
      title: "Manifesto",
      blocks: [
        {
          type: "paragraph",
          text: "Toda boa ideia merece existir no mundo físico. Mas a indústria tradicional é lenta, cara e engessada — e boas soluções morrem no “será que dá?”.",
        },
        {
          type: "paragraph",
          text: "A Adapto existe pra mudar isso. Somos uma indústria de manufatura aditiva com capacidade de produção em escala. Você traz o problema; nós materializamos a solução — com viabilidade, funcionalidade e responsabilidade.",
        },
        { type: "quote", text: "Você imagina. A gente faz acontecer." },
      ],
    },
    "frases-de-impacto": {
      title: "Frases de impacto",
      blocks: [
        {
          type: "list",
          items: [
            "Você imagina. A gente faz acontecer.",
            "Se isso precisa existir no mundo físico, nós encontramos uma forma viável de produzir.",
            "A impressão 3D é meio. O resultado é o valor.",
            "É preciso adaptar-se.",
            "Você traz o problema, nós materializamos a solução.",
          ],
        },
      ],
    },
    slogan: {
      title: "Slogan",
      blocks: [{ type: "quote", text: "Você imagina. A gente faz acontecer." }],
    },
    naming: {
      title: "Naming",
      subtitle: "De Adaptbot 3D para Adapto.",
      blocks: [
        {
          type: "paragraph",
          text: "O novo nome preserva a essência da origem — a capacidade de adaptar soluções — mas evolui na forma: mais curto, fluido e fácil de pronunciar, reduzindo ruídos e aumentando a memorização.",
        },
        {
          type: "paragraph",
          text: "Ao deixar de lado o caráter descritivo e limitante de “3D”, Adapto se posiciona de forma mais ampla e estratégica: uma solução prática, confiável e escalável.",
        },
        { type: "quote", text: "Por isso, a Adaptbot 3D agora é Adapto. É preciso adaptar-se." },
      ],
    },
    "conceito-visual": {
      title: "Conceito visual",
      subtitle: "Adaptação da matéria-prima em soluções concretas.",
      blocks: [
        {
          type: "paragraph",
          text: "A identidade nasce do conceito de transformar matéria em possibilidades. No logotipo, o primeiro “A” aparece em sua forma original e o segundo surge estilizado — simbolizando a transformação da matéria conforme a necessidade de cada projeto.",
        },
        {
          type: "paragraph",
          text: "A tipografia sem serifa reforça uma comunicação clara, acessível e contemporânea, alinhada ao universo tecnológico e à proposta de tornar ideias viáveis com precisão e agilidade.",
        },
      ],
    },
    "logo-simbolo": {
      title: "Logo e símbolo",
      subtitle: "Uma marca que pratica a própria adaptação.",
      blocks: [
        {
          type: "paragraph",
          text: "A construção prevê variações: da versão completa à intermediária, até a forma mais essencial — o “A” central, elemento com personalidade própria e forte reconhecimento.",
        },
        {
          type: "paragraph",
          text: "Essa flexibilidade mantém a marca consistente e legível mesmo em escalas reduzidas — favicon, avatar ou aplicações em brindes — garantindo presença em qualquer ponto de contato.",
        },
      ],
    },
    cores: {
      title: "Cores",
      subtitle: "Paleta principal e usos.",
      blocks: [
        {
          type: "colors",
          colors: [
            { name: "Roxo Adapto", hex: "#6338CE", usage: "Protagonismo — transformação, inteligência, profundidade. PANTONE 2097 C" },
            { name: "Azul claro", hex: "#D0FCF8", usage: "Apoio — contraste, leveza, segurança e fluidez. PANTONE 9480 C" },
            { name: "Preto", hex: "#1E1E1E", usage: "Base — robustez, solidez e qualidade. PANTONE 419 C" },
          ],
        },
      ],
    },
    tipografias: {
      title: "Tipografias",
      subtitle: "Sistema tipográfico.",
      blocks: [
        {
          type: "type",
          fonts: [
            { name: "PP Radio Grotesk", role: "Títulos e textos — família extensa", preview: "Você imagina." },
            { name: "Vampiro One", role: "O “a” da logo — uso parcimonioso", preview: "adapto" },
            { name: "Inter", role: "Apoio — textos longos, alta leiturabilidade", preview: "A gente faz acontecer." },
          ],
        },
      ],
    },
    "elementos-graficos": {
      title: "Elementos gráficos",
      subtitle: "A linguagem visual de apoio.",
      blocks: [
        {
          type: "paragraph",
          text: "Os elementos partem do próprio “A” central, explorado em diferentes composições para ganhar força e recorrência.",
        },
        {
          type: "paragraph",
          text: "A linguagem incorpora formas orgânicas de linhas contínuas que começam e terminam no mesmo ponto — fluxos que remetem ao percurso do filamento e ao processo de construção da matéria, reforçando o caráter tecnológico e o conceito de adaptação.",
        },
      ],
    },
    "manual-de-uso": {
      title: "Manual de uso e versões",
      subtitle: "Proteção e redução.",
      blocks: [
        {
          type: "list",
          items: [
            "Área de proteção equivalente à altura de “X” ao redor do logo.",
            "Redução máxima: 3 cm (versão completa) / 2 cm (versões reduzidas).",
            "Variações: completa → intermediária → “A” central, conforme a escala e o ponto de contato.",
          ],
        },
      ],
    },
  },
};
