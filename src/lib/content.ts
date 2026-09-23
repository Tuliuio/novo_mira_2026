/**
 * Conteúdo do Brand System de um cliente.
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
  | { type: "type"; fonts: { name: string; role: string; preview: string }[] }
  /* --- Blocos de ativos (fonte: Google Drive) --- */
  | { type: "image"; src: string; alt: string; caption?: string; contain?: boolean }
  | { type: "gallery"; images: { src: string; alt: string }[] }
  | { type: "files"; files: { name: string; href: string; kind?: string }[] }
  | { type: "embed"; src: string; title: string };

/* ------------------------------------------------------------------ *
 * Integração Google Drive — o Drive é a fonte de verdade dos ativos.
 * Guardamos o ID do arquivo e derivamos as URLs de exibição/download.
 * (Fase 1: links diretos. Fase 2: Edge Function lista a pasta ao vivo.)
 * Obs.: para as imagens aparecerem ao cliente, o arquivo precisa estar
 * compartilhado como "qualquer pessoa com o link".
 * ------------------------------------------------------------------ */
/** Imagem embutível (preview) a partir do ID do arquivo no Drive. */
export const driveImage = (id: string, w = 1600) =>
  `https://drive.google.com/thumbnail?id=${id}&sz=w${w}`;
/** Link para abrir/baixar o arquivo original no Drive. */
export const driveFile = (id: string) => `https://drive.google.com/file/d/${id}/view`;
/** URL de preview embutível (iframe) para PDFs no Drive. */
export const drivePreview = (id: string) => `https://drive.google.com/file/d/${id}/preview`;

export interface BrandPage {
  title: string;
  subtitle?: string;
  blocks: ContentBlock[];
}

/* ------------------------------------------------------------------ *
 * Brand Hub — modelo estruturado que alimenta a área logada (/app).
 * É o "BRAND" do hub interativo, agora por cliente. Trocar de cliente =
 * preencher isto. RGB/CMYK e contraste são calculados no render.
 * ------------------------------------------------------------------ */
export interface HubLogo { name: string; role: string; src: string; file: string; drive?: string; pad: string; }
export interface HubColor { name: string; hex: string; role?: string; /** CMYK oficial (do brandbook); se ausente, é calculado do hex */ cmyk?: string; }
export interface HubPair { bg: string; fg: string; label: string; }
export interface HubType { role: string; family: string; sample: string; cssFamily?: string; }
export interface HubApplication { k: string; s: string; bg: string; fg: string; }
export interface HubPhoto { src: string; label: string; group?: string; fit?: "cover" | "contain"; pad?: string; }

/** Um bloco de leitura corrida (Essência ou Narrativa) — título + texto em parágrafos. */
export interface ArticleSection { heading: string; paragraphs: string[]; }
/** Artigo de leitura confortável, estilo "blog post" — texto corrido completo. */
export interface HubArticle {
  slug: string;
  kicker?: string;
  title: string;
  subtitle?: string;
  sections: ArticleSection[];
  /** frase de fechamento em destaque (ex.: one-liner da narrativa) */
  closing?: string;
}

export interface HubBrand {
  year: string;
  since?: string;
  drive?: { assets?: string; expressao?: string };
  /** URL (Drive) do brandbook completo em PDF — botão de download na Essência */
  brandbook?: string;
  /** URL (Drive) da pasta/arquivo de fontes — botão de download na Tipografia */
  fontsUrl?: string;
  logos: HubLogo[];
  colorsNote?: string;
  colors: HubColor[];
  pairings?: HubPair[];
  /** se preenchido, mostra esta nota no lugar dos cards de tipografia */
  typeNote?: string;
  type?: HubType[];
  essence?: { lead?: string; proposito?: string; posicionamento?: string; quote?: string; atributos?: string[] };
  /** texto corrido completo da Essência, pra leitura confortável (estilo blog post) */
  essenceArticle?: HubArticle;
  verbal?: { tom?: string; sim?: string[]; nao?: string[]; examples?: { sim: string; nao: string }[] };
  applications?: HubApplication[];
  /** fotografias reais da marca no mundo (aplicações + direção fotográfica) */
  photos?: HubPhoto[];
  /** roteiros de Narrativa (StoryBrand) — marca-mãe + sub-marcas, em texto corrido completo */
  narratives?: HubArticle[];
}

export interface ClientBrand {
  slug: string;
  name: string;
  tagline: string;
  /** cor de destaque da marca do cliente (acento da própria identidade dele) */
  accent: string;
  /** mapeia item.id (do method.ts) -> página de conteúdo */
  pages: Record<string, BrandPage>;
  /** dados estruturados do Brand Hub (área logada) */
  hub?: HubBrand;
}

/* ------------------------------------------------------------------ *
 * Cliente — Adapto (Indústria de manufatura aditiva / Impressão 3D)
 * ------------------------------------------------------------------ */
export const DEMO_CLIENT: ClientBrand = {
  slug: "adapto",
  name: "Adapto",
  tagline: "Você imagina. A gente faz acontecer.",
  accent: "#6338CE",
  hub: {
    year: "2026",
    since: "Manufatura aditiva",
    logos: [],
    colors: [
      { name: "Roxo Adapto", hex: "#6338CE", role: "Protagonismo — transformação e profundidade. PANTONE 2097 C" },
      { name: "Azul claro", hex: "#D0FCF8", role: "Apoio — leveza, segurança e fluidez. PANTONE 9480 C" },
      { name: "Preto", hex: "#1E1E1E", role: "Base — robustez e solidez. PANTONE 419 C" },
    ],
    pairings: [
      { bg: "#6338CE", fg: "#D0FCF8", label: "Roxo + Azul claro" },
      { bg: "#1E1E1E", fg: "#D0FCF8", label: "Preto + Azul claro" },
      { bg: "#D0FCF8", fg: "#1E1E1E", label: "Azul claro + Preto" },
    ],
    type: [
      { role: "Títulos", family: "PP Radio Grotesk", sample: "Você imagina." },
      { role: "Apoio", family: "Inter", sample: "A gente faz acontecer.", cssFamily: "var(--font-sans)" },
    ],
    essence: {
      lead: "A impressão 3D é meio. O resultado é o valor.",
      proposito: "Reduzir a distância entre uma necessidade real e a capacidade de torná-la física, viável e funcional.",
      posicionamento: "Uma indústria de manufatura aditiva sob demanda, com capacidade de produção em escala, especializada em transformar necessidades reais em soluções físicas viáveis.",
      quote: "Se isso precisa existir no mundo físico, nós encontramos uma forma viável de produzir.",
      atributos: ["Segura", "Competente", "Didática", "Resolutiva", "Acessível"],
    },
    verbal: {
      tom: "Educativo e resolutivo — a venda acontece quando o cliente entende o potencial da tecnologia. Didático, seguro e pragmático.",
      sim: ["A gente faz acontecer", "Você traz o problema, nós materializamos a solução", "Viável", "Escala"],
      nao: ["Hype", "Futurista exagerado", "Jargão vazio", "Maker cool"],
    },
  },
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

/* ------------------------------------------------------------------ *
 * Cliente — Cruz de Malta (Restaurante · Pelotas/RS · 60 anos)
 * Essência extraída de "Cruz de Malta – Essência de Marca (v2)" (Drive).
 * Narrativa ainda não entregue. Expressão em andamento (logo pronta;
 * cores e tipografia em documentação).
 * ------------------------------------------------------------------ */
export const CRUZ_DE_MALTA: ClientBrand = {
  slug: "cruz-de-malta",
  name: "Cruz de Malta",
  tagline: "O restaurante mais tradicional de Pelotas.",
  accent: "#E71E2E", // vermelho âncora (amostrado dos logos)
  hub: {
    year: "2026",
    since: "Desde 1967",
    drive: {
      assets: "https://drive.google.com/drive/folders/1rRtiCoDLGGgFoMN42ZWh74cnqHuTnzHc",
      expressao: "https://drive.google.com/drive/folders/1vmNRp891cFr4xx25i4_f_j8vua02B8eU",
    },
    brandbook: "https://drive.google.com/file/d/1k-LIns2b6glB9AmibZn_8ZSaJOOW9kOu/view",
    logos: [
      { name: "Assinatura principal", role: "Positiva sobre vermelho", src: "/clients/cruz-de-malta/logo-02.png", file: "cruz-de-malta-principal.png", drive: "https://drive.google.com/file/d/1o9NtFtu25cT_fdzQxvh1l1ZCnpjmrX7p/view", pad: "var(--c1)" },
      { name: "Vermelho sobre branco", role: "Fundos claros", src: "/clients/cruz-de-malta/logo-01.png", file: "cruz-de-malta-vermelho.png", drive: "https://drive.google.com/file/d/1mub_QSel8s7k0r2Ct3WAW3UTczwhiDxM/view", pad: "#ffffff" },
      { name: "Sobre creme", role: "Peças de tradição", src: "/clients/cruz-de-malta/logo-03.png", file: "cruz-de-malta-creme.png", drive: "https://drive.google.com/file/d/1CmSEVGo1-OcA5guaNKYzgiiEPeEZdGuS/view", pad: "var(--c3)" },
      { name: "Branco sobre bordô", role: "Uso sóbrio", src: "/clients/cruz-de-malta/logo-04.png", file: "cruz-de-malta-bordo.png", drive: "https://drive.google.com/file/d/1jKgYnnbgoHozdskD7jErK91_71WcK1yu/view", pad: "var(--c2)" },
    ],
    colorsNote: "Paleta provisória — extraída dos logos entregues, aguardando documentação oficial das cores.",
    colors: [
      { name: "Vermelho Cruz", hex: "#E71E2E", role: "Cor âncora da marca" },
      { name: "Bordô", hex: "#891623", role: "Profundidade e sobriedade" },
      { name: "Creme", hex: "#F8E2C0", role: "Tradição e acolhimento" },
      { name: "Tinta", hex: "#19191A", role: "Texto e contraste" },
      { name: "Papel", hex: "#FFFFFF", role: "Respiro e fundos claros" },
    ],
    pairings: [
      { bg: "#E71E2E", fg: "#FFFFFF", label: "Vermelho + Papel" },
      { bg: "#F8E2C0", fg: "#891623", label: "Creme + Bordô" },
      { bg: "#19191A", fg: "#F8E2C0", label: "Tinta + Creme" },
      { bg: "#891623", fg: "#F8E2C0", label: "Bordô + Creme" },
    ],
    typeNote:
      "O sistema tipográfico do Cruz de Malta ainda está sendo definido pela Mira — uma fonte com propósito, que carregue tradição e atualidade. Enquanto isso, a assinatura vintage do logo é a referência de personalidade. Assim que fechada, ela aparece aqui com amostra viva, pangrama e ficha técnica.",
    essence: {
      lead: "Tirar o Cruz do lugar de “antigo” e levá-lo ao de “tradicional”. Antigo é o que ficou para trás; tradicional é o que mantém relevância, independentemente do tempo.",
      proposito: "Manter viva — e servida à mesa — a comida de verdade que fez do Cruz de Malta parte da história de Pelotas. Seis décadas sem uma única pausa: o restaurante mais antigo em funcionamento da cidade.",
      posicionamento: "Ser, na mente do público, o primeiro nome quando o desejo é uma comida de verdade que reúne a família à mesa — para a tradição gastronômica de Pelotas o que o Mercado Público é para a cidade.",
      quote: "Vai no Cruz da Bento. É o restaurante mais antigo de Pelotas, comida de verdade e você come como se estivesse em casa.",
      atributos: ["Tradicional", "Consistente", "Autêntico", "Acolhedor", "Confiável", "Caprichado", "Farto", "Familiar", "Honesto", "Variado"],
    },
    essenceArticle: {
      slug: "essencia-cruz-de-malta",
      kicker: "Essência de Marca · Mira Brand Studio",
      title: "Essência de Marca",
      subtitle: "Tirar o Cruz do lugar de “antigo” e levá-lo ao de “tradicional”. Antigo é o que ficou para trás; tradicional é o que mantém relevância, independentemente do tempo.",
      sections: [
        {
          heading: "01 · Propósito",
          paragraphs: [
            "Manter viva — e servida à mesa — a comida de verdade que fez do Cruz de Malta parte da história de Pelotas há 60 anos.",
            "Desde 1967, um mesmo endereço serve Pelotas à mesa: a Avenida Bento Gonçalves, 143. É ali que a casa construiu a sua história. Em 1º de agosto de 2000, Adriano e Cacilda assumiram o Cruz e o conduzem desde então — filhos de uma terra onde o campo, o gado e a comida fazem parte da vida.",
            "São seis décadas sem uma única pausa: o restaurante mais antigo em funcionamento de Pelotas. O que manteve a marca relevante não foi ficar parada no tempo — foi o contrário: atualização constante, com a tradição preservada a cada passo.",
            "“Não é a lembrança de um sabor que um dia existiu, é o sabor que continua ali, igual, visita após visita.”",
          ],
        },
        {
          heading: "02 · Público ideal",
          paragraphs: [
            "O público central do Cruz de Malta é maduro, 60+ na maioria — gente movida por memória e pertencimento, que quando vem traz a família junto, fazendo a tradição atravessar as gerações.",
            "A decisão de compra passa mais pela confiança do que pela pesquisa. O cliente chega por indicação, por memória ou por reputação — e boa parte já entra sabendo o que vai pedir. Não busca novidade, e sim tradição e a certeza de um bom atendimento e de um bom sabor.",
            "Quatro perfis se destacam. O cliente local, que fez do Cruz parte da rotina e valoriza tradição e consistência acima da novidade. A saudade de Pelotas, de quem nasceu ou morou na cidade, hoje vive fora e, quando volta, reencontra o sabor que guarda na memória. As famílias, que enchem a casa nos fins de semana e nas datas que reúnem várias gerações — aniversários, batizados, comemorações. E os representantes e viajantes, sobretudo à noite, um público cativo que já tem o Cruz como parada certa em Pelotas.",
            "A necessidade prática é consistência, refeição completa e farta, atendimento atento e sem pressa. A necessidade emocional é reencontrar um sabor querido, reunir quem se ama, sentir-se parte da história de Pelotas. E o problema que o Cruz resolve é achar, num mercado de opções passageiras, comida de verdade em que se possa confiar.",
            "“A maior necessidade desse público é ter um lugar certo — o primeiro a vir à cabeça quando bate a vontade de comer de verdade.”",
          ],
        },
        {
          heading: "03 · Valores",
          paragraphs: [
            "Os princípios que sustentaram a casa por 60 anos, apontados pelos próprios donos, são cinco.",
            "Autenticidade — comida de verdade, sem atalho. Tempero da casa, molho fresco, nada de pacote. É o valor que faz do Cruz o único dos dois turnos sem buffet.",
            "Consistência — o mesmo padrão, visita após visita. O prato de hoje é o de dez anos atrás, ou melhor.",
            "Acolhimento — o cliente é tratado como quem se quer encantar, não despachar. Atenção sem pressa, olho no olho.",
            "Humildade — vida simples e trabalho honesto. Capital próprio, contas em dia, os pés no chão. Trabalha-se para servir bem e durar.",
            "Resiliência — a dedicação que manteve o Cruz de pé por seis décadas, num setor em que a maioria não resiste. Transforma tempo em patrimônio.",
            "“Vividos todos os dias, esses valores criam o que o público mais valoriza: confiança.”",
          ],
        },
        {
          heading: "04 · Diferenciais",
          paragraphs: [
            "O diferencial mais forte é o único que nenhum concorrente consegue copiar: o tempo somado à verdade. São 60 anos ininterruptos no mesmo endereço, com a mesma consistência. Ninguém mais abre amanhã com seis décadas de história em Pelotas.",
            "Um cardápio genuinamente multiétnico, do churrasco gaúcho ao bacalhau português, do galeto ao camarão. O tempero próprio da casa, com comida feita na hora, sem atalho. E uma conexão de raiz com o campo, do gado à mesa, uma origem que a família carrega no sangue.",
            "Tradicional, consistente, autêntico, acolhedor, confiável, caprichado, farto, familiar, honesto, variado — dez atributos que resumem o que só esta marca entrega.",
            "“Num mercado onde tudo muda o tempo todo, encontrar a mesma qualidade de sempre virou o atributo mais raro e mais amado do Cruz: a consistência.”",
          ],
        },
        {
          heading: "05 · Personalidade",
          paragraphs: [
            "A marca é tradicional, acolhedora, autêntica, humilde e resiliente. Não é antiga e parada no tempo, nem caricata, happy hour, bar ou novidade da vez.",
            "“O que muitos montam, o Cruz de Malta simplesmente é. Essa autenticidade é o território que a marca tem para ocupar.”",
          ],
        },
        {
          heading: "06 · Posicionamento",
          paragraphs: [
            "Tirar o Cruz do lugar de “antigo” e levá-lo ao de “tradicional” — porque são coisas muito diferentes. Antigo é o que ficou para trás; tradicional é o que mantém relevância, independentemente do tempo. O Cruz não é peça parada no tempo: é um negócio vivo, experiente, sólido e resiliente.",
            "Reposicionar é também alinhar expectativas: fazer com que o que a marca comunica, o que o cliente percebe e o que ele espera sejam a mesma coisa. Quem chega já sabe que vai a uma casa tradicional e recebe isso como qualidade, não como surpresa.",
            "“Ser para a tradição gastronômica o que o Café Aquários, o Mercado Público e os doces são para Pelotas: parte obrigatória da cidade.”",
            "Há um trunfo que os donos já usam e que vale ouro: o “Cruz da Bento”. O endereço vira sobrenome da marca, ancora a casa no mapa da cidade e a separa de vez de quem carrega nome parecido — e há um encontro feliz: Bento é também o sobrenome da Cacilda. A rua, a família e a marca dizem a mesma coisa.",
            "“Vai no Cruz da Bento. É o restaurante mais antigo de Pelotas, comida de verdade e você come como se estivesse em casa.”",
          ],
        },
        {
          heading: "07 · Promessa central",
          paragraphs: [
            "“Entregar com primor tudo o que se busca quando bate a vontade de uma comida de verdade e saborosa, dessas que reúnem a família à mesa.”",
            "Na prática, o cliente recebe uma refeição completa e caprichada, com atendimento atento e sem pressa, e a experiência de comer numa casa com seis décadas de história. Mais do que comer bem, o desejo que o Cruz atende é o de reencontrar quem se ama, reviver uma lembrança e criar outra.",
          ],
        },
        {
          heading: "08 · Visão de futuro",
          paragraphs: [
            "Nos próximos 3 a 5 anos, consolidar aquilo que já é por direito: a referência de tradição gastronômica de Pelotas e, com o tempo, do sul do Rio Grande do Sul.",
            "Quando falar de Pelotas for falar do Cruz de Malta. Quando a marca for a primeira lembrança de uma comida de verdade. Quando o ecossistema em volta dela estiver de pé, elevando o nome da casa. Quando o Cruz valer, como marca, muito mais do que vale hoje.",
            "“Nunca cresceu apressado e não é agora que vai começar. Cresce com a solidez de quem já tem 60 anos e pretende ter mais 60.”",
          ],
        },
        {
          heading: "09 · Ecossistema de negócios",
          paragraphs: [
            "O Cruz de Malta opera um modelo clássico de restaurante de serviço completo (full-service): venda direta ao consumidor, à la carte, com atendimento de mesa. Cada visita é uma venda; o faturamento se sustenta no giro do salão, nos dois turnos, todos os dias.",
            "O canal principal é próprio e presencial, sem intermediários entre a marca e a mesa. Há ainda um canal secundário de delivery, com pedidos por WhatsApp e entrega própria, sem depender de plataformas.",
            "O ponto é um endereço de 60 anos que é ativo de marca por si só. O saber-fazer são as receitas e o tempero da casa que garantem a consistência. E as pessoas são a equipe e a gestão familiar que conhecem o cliente pelo nome.",
            "No horizonte, o modelo aponta para a integração vertical: com a pecuária própria, o Cruz pode evoluir para um formato do campo à mesa (farm-to-table) e para uma linha de produtos com o nome da casa — uma direção, não uma pressa.",
          ],
        },
      ],
    },
    verbal: {
      tom: "Acolhedor e orgulhoso, sem pretensão. Fala com quem já é de casa e com quem ainda vai ser. Direto, caloroso, com o pé no chão de quem trabalha há 60 anos.",
      sim: ["Comida de verdade", "Feito na hora", "Tradição de Pelotas", "Como se estivesse em casa", "O Cruz da Bento"],
      nao: ["Gourmet", "Experiência gastronômica premium", "Disruptivo", "O melhor da cidade (superlativo vazio)", "Happy hour"],
      examples: [
        { sim: "Há 60 anos, a mesma comida de verdade. É só chegar.", nao: "A experiência gastronômica mais autêntica e premium de Pelotas." },
        { sim: "Parmegiana, peixe com camarão e a receita que não muda.", nao: "Pratos autorais que ressignificam a tradição regional." },
      ],
    },
    photos: [
      { src: "/clients/cruz-de-malta/fotografia/fachada.jpg", label: "Fachada — o Cruz da Bento", group: "Aplicações" },
      { src: "/clients/cruz-de-malta/fotografia/cardapio.jpg", label: "Cardápio", group: "Aplicações" },
      { src: "/clients/cruz-de-malta/fotografia/embalagem.jpg", label: "Embalagem", group: "Aplicações" },
      { src: "/clients/cruz-de-malta/fotografia/sacola.jpg", label: "Sacola", group: "Aplicações" },
      { src: "/clients/cruz-de-malta/fotografia/taca.jpg", label: "Taça", group: "Aplicações" },
      { src: "/clients/cruz-de-malta/fotografia/avental.jpg", label: "Avental", group: "Aplicações" },
      { src: "/clients/cruz-de-malta/fotografia/campo.jpg", label: "O campo — a origem", group: "Direção fotográfica" },
      { src: "/clients/cruz-de-malta/fotografia/em-casa.jpg", label: "O Cruz na sua casa", group: "Direção fotográfica" },
      { src: "/clients/cruz-de-malta/fotografia/delivery.jpg", label: "Delivery", group: "Direção fotográfica" },
      { src: "/clients/cruz-de-malta/fotografia/cacilda.jpg", label: "A cozinha da Cilda", group: "Direção fotográfica" },
    ],
    narratives: [
      {
        slug: "cruz-de-malta",
        kicker: "Narrativa de Marca · StoryBrand · Público principal",
        title: "Cruz de Malta",
        subtitle: "Herói: o cliente fiel, movido por memória e tradição. Voz da marca: acolhedora e orgulhosa, sem pretensão.",
        sections: [
          {
            heading: "01 · O herói",
            paragraphs: [
              "Quem é: o público central do Cruz de Malta é maduro, 60+ na maioria — mas o costume atravessa gerações, trazido pela família de quem valoriza memória e pertencimento. É quem chega por indicação, por memória ou por reputação, e boa parte já entra sabendo o que vai pedir.",
              "O que ele quer: sentar-se à mesa da comida de verdade que já conhece, cercado por quem ama, com a certeza de que vai ser exatamente como sempre foi.",
            ],
          },
          {
            heading: "02 · O problema",
            paragraphs: [
              "Vilão: um mercado de opções passageiras, onde tudo muda o tempo todo e nada dura.",
              "Externo: encontrar, entre tantos restaurantes novos e modismos de ocasião, um lugar que sirva a mesma comida de verdade de sempre — sem depender da sorte.",
              "Interno: o receio de que a próxima novidade decepcione, ou pior, de que o lugar de sempre tenha mudado sem avisar.",
              "Filosófico: quem já tem 60 anos de história não devia precisar provar nada a cada visita — a confiança devia vir de graça, construída ao longo do tempo.",
            ],
          },
          {
            heading: "03 · O guia",
            paragraphs: [
              "Empatia: “sabemos que, quando bate a vontade de uma comida de verdade, você não quer surpresa — quer a certeza de encontrar exatamente o que já ama”.",
              "Autoridade: 60 anos ininterruptos no mesmo endereço, a Avenida Bento Gonçalves, 143 — o restaurante mais antigo em funcionamento de Pelotas. Cardápio genuinamente multiétnico, do churrasco gaúcho ao bacalhau português, do galeto ao camarão, com tempero da casa, feito na hora, sem atalho. Conduzido por Adriano e Cacilda desde 2000, com raízes de família que vêm do campo.",
            ],
          },
          {
            heading: "04 · O plano",
            paragraphs: [
              "Processo: venha como sempre veio, sem reserva, sem cerimônia. Peça o que já ama, ou deixe a casa apresentar o cardápio inteiro, do galeto ao camarão. Saia como sempre saiu: satisfeito, e já pensando na próxima vez.",
              "Acordo (promessas): a mesma receita de sempre. Tempero da casa, feito na hora. Atendimento sem pressa, olho no olho.",
            ],
          },
          {
            heading: "05 · A ação",
            paragraphs: [
              "Direta: venha para o Cruz da Bento.",
              "Transicional: siga o Instagram, veja o cardápio, peça pelo WhatsApp (delivery próprio, sem plataforma).",
            ],
          },
          {
            heading: "06 · O que se evita",
            paragraphs: [
              "A decepção de um lugar que prometia tradição e entregou modismo. A comida que muda de sabor a cada visita. A sensação de ter arriscado um jantar em vez de ter certeza dele.",
            ],
          },
          {
            heading: "07 · O sucesso",
            paragraphs: [
              "Ele sai como entrou: em casa. A mesma comida de sempre, a família reunida à mesa, e mais uma visita que confirma por que sempre volta.",
              "Transformação de identidade: de quem procura, ansioso, um lugar em que confiar, para quem já sabe — é no Cruz da Bento.",
            ],
          },
        ],
        closing: "Há 60 anos, a mesma comida de verdade. É só chegar — a família reunida, o tempero de sempre e a certeza de que nada mudou.",
      },
    ],
  },
  pages: {
    /* ---------------------------------------------------- 01 Essência */
    proposito: {
      title: "Propósito",
      subtitle: "Por que o Cruz de Malta existe, além do prato.",
      blocks: [
        {
          type: "lead",
          text: "Manter viva — e servida à mesa — a comida de verdade que fez do Cruz de Malta parte da história de Pelotas há 60 anos.",
        },
        {
          type: "paragraph",
          text: "Desde 1967, um mesmo endereço serve Pelotas à mesa: a Avenida Bento Gonçalves, 143. É ali que a casa construiu a sua história. Em 1º de agosto de 2000, Adriano e Cacilda assumiram o Cruz e o conduzem desde então — filhos de uma terra onde o campo, o gado e a comida fazem parte da vida.",
        },
        {
          type: "paragraph",
          text: "São seis décadas sem uma única pausa: o restaurante mais antigo em funcionamento de Pelotas. O que manteve a marca relevante não foi ficar parada no tempo — foi o contrário: atualização constante, com a tradição preservada a cada passo.",
        },
        {
          type: "quote",
          text: "Não é a lembrança de um sabor que um dia existiu, é o sabor que continua ali, igual, visita após visita.",
        },
      ],
    },
    "publico-ideal": {
      title: "Público ideal",
      subtitle: "Para quem a marca existe.",
      blocks: [
        {
          type: "lead",
          text: "O público central do Cruz de Malta é maduro, 60+ na maioria — gente movida por memória e pertencimento, que quando vem traz a família junto, fazendo a tradição atravessar as gerações.",
        },
        {
          type: "paragraph",
          text: "A decisão de compra passa mais pela confiança do que pela pesquisa. O cliente chega por indicação, por memória ou por reputação — e boa parte já entra sabendo o que vai pedir. Não busca novidade, e sim tradição e a certeza de um bom atendimento e de um bom sabor.",
        },
        {
          type: "list",
          items: [
            "Cliente local — fez do Cruz parte da rotina; valoriza tradição e consistência acima da novidade.",
            "Saudade de Pelotas — nasceu ou morou na cidade, hoje vive fora e, quando volta, reencontra o sabor que guarda na memória.",
            "Famílias — enchem a casa nos fins de semana e nas datas que reúnem várias gerações: aniversários, batizados, comemorações.",
            "Representantes e viajantes — sobretudo à noite, um público cativo que já tem o Cruz como parada certa em Pelotas.",
          ],
        },
        {
          type: "stat",
          items: [
            { label: "Necessidade prática", value: "Consistência, refeição completa e farta, atendimento atento e sem pressa" },
            { label: "Necessidade emocional", value: "Reencontrar um sabor querido, reunir quem se ama, sentir-se parte da história de Pelotas" },
            { label: "Problema que resolve", value: "Achar, num mercado de opções passageiras, comida de verdade em que se possa confiar" },
          ],
        },
        {
          type: "quote",
          text: "A maior necessidade desse público é ter um lugar certo — o primeiro a vir à cabeça quando bate a vontade de comer de verdade.",
        },
      ],
    },
    valores: {
      title: "Valores",
      subtitle: "Os princípios que sustentaram a casa por 60 anos — apontados pelos próprios donos.",
      blocks: [
        {
          type: "list",
          items: [
            "Autenticidade — comida de verdade, sem atalho. Tempero da casa, molho fresco, nada de pacote. É o valor que faz do Cruz o único dos dois turnos sem buffet.",
            "Consistência — o mesmo padrão, visita após visita. O prato de hoje é o de dez anos atrás, ou melhor.",
            "Acolhimento — o cliente é tratado como quem se quer encantar, não despachar. Atenção sem pressa, olho no olho.",
            "Humildade — vida simples e trabalho honesto. Capital próprio, contas em dia, os pés no chão. Trabalha-se para servir bem e durar.",
            "Resiliência — a dedicação que manteve o Cruz de pé por seis décadas, num setor em que a maioria não resiste. Transforma tempo em patrimônio.",
          ],
        },
        {
          type: "quote",
          text: "Vividos todos os dias, esses valores criam o que o público mais valoriza: confiança.",
        },
      ],
    },
    diferenciais: {
      title: "Diferenciais",
      subtitle: "O que só esta marca entrega.",
      blocks: [
        {
          type: "lead",
          text: "O diferencial mais forte é o único que nenhum concorrente consegue copiar: o tempo somado à verdade. São 60 anos ininterruptos no mesmo endereço, com a mesma consistência. Ninguém mais abre amanhã com seis décadas de história em Pelotas.",
        },
        {
          type: "list",
          items: [
            "Cardápio genuinamente multiétnico — do churrasco gaúcho ao bacalhau português, do galeto ao camarão.",
            "Tempero próprio da casa — comida feita na hora, sem atalho.",
            "Conexão de raiz com o campo — do gado à mesa, uma origem que a família carrega no sangue.",
          ],
        },
        {
          type: "list",
          items: [
            "Tradicional — 60 anos, o mais antigo em funcionamento de Pelotas.",
            "Consistente — a mesma qualidade a cada visita.",
            "Autêntico — comida de verdade, sem atalho.",
            "Acolhedor — atendimento humano, sem pressa.",
            "Confiável — o cliente sabe o que vai encontrar.",
            "Caprichado — tempero da casa, molho fresco, feito na hora.",
            "Farto — porção generosa, refeição completa.",
            "Familiar — a casa de reunir quem se ama.",
            "Honesto — preço justo pelo que entrega.",
            "Variado — do churrasco ao bacalhau, a cidade inteira à mesa.",
          ],
        },
        {
          type: "quote",
          text: "Num mercado onde tudo muda o tempo todo, encontrar a mesma qualidade de sempre virou o atributo mais raro e mais amado do Cruz: a consistência.",
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
            { label: "É", value: "Tradicional, acolhedora, autêntica, humilde, resiliente" },
            { label: "Não é", value: "Antiga e parada no tempo, caricata, happy hour, bar, novidade da vez" },
          ],
        },
        {
          type: "quote",
          text: "O que muitos montam, o Cruz de Malta simplesmente é. Essa autenticidade é o território que a marca tem para ocupar.",
        },
      ],
    },
    posicionamento: {
      title: "Posicionamento",
      subtitle: "O lugar que a marca ocupa na mente do público.",
      blocks: [
        {
          type: "lead",
          text: "Tirar o Cruz do lugar de “antigo” e levá-lo ao de “tradicional” — porque são coisas muito diferentes. Antigo é o que ficou para trás; tradicional é o que mantém relevância, independentemente do tempo. O Cruz não é peça parada no tempo: é um negócio vivo, experiente, sólido e resiliente.",
        },
        {
          type: "paragraph",
          text: "Reposicionar é também alinhar expectativas: fazer com que o que a marca comunica, o que o cliente percebe e o que ele espera sejam a mesma coisa. Quem chega já sabe que vai a uma casa tradicional e recebe isso como qualidade, não como surpresa.",
        },
        {
          type: "quote",
          text: "Ser para a tradição gastronômica o que o Café Aquários, o Mercado Público e os doces são para Pelotas: parte obrigatória da cidade.",
        },
        {
          type: "paragraph",
          text: "Há um trunfo que os donos já usam e que vale ouro: o “Cruz da Bento”. O endereço vira sobrenome da marca, ancora a casa no mapa da cidade e a separa de vez de quem carrega nome parecido — e há um encontro feliz: Bento é também o sobrenome da Cacilda. A rua, a família e a marca dizem a mesma coisa.",
        },
        {
          type: "quote",
          text: "Vai no Cruz da Bento. É o restaurante mais antigo de Pelotas, comida de verdade e você come como se estivesse em casa.",
        },
      ],
    },
    promessa: {
      title: "Promessa central",
      subtitle: "O compromisso que sustenta a relação com o público.",
      blocks: [
        {
          type: "quote",
          text: "Entregar com primor tudo o que se busca quando bate a vontade de uma comida de verdade e saborosa, dessas que reúnem a família à mesa.",
        },
        {
          type: "paragraph",
          text: "Na prática, o cliente recebe uma refeição completa e caprichada, com atendimento atento e sem pressa, e a experiência de comer numa casa com seis décadas de história. Mais do que comer bem, o desejo que o Cruz atende é o de reencontrar quem se ama, reviver uma lembrança e criar outra.",
        },
      ],
    },
    "visao-de-futuro": {
      title: "Visão de futuro",
      subtitle: "Onde a marca quer chegar.",
      blocks: [
        {
          type: "lead",
          text: "Nos próximos 3 a 5 anos, consolidar aquilo que já é por direito: a referência de tradição gastronômica de Pelotas e, com o tempo, do sul do Rio Grande do Sul.",
        },
        {
          type: "list",
          items: [
            "Quando falar de Pelotas for falar do Cruz de Malta.",
            "Quando a marca for a primeira lembrança de uma comida de verdade.",
            "Quando o ecossistema em volta dela estiver de pé, elevando o nome da casa.",
            "Quando o Cruz valer, como marca, muito mais do que vale hoje.",
          ],
        },
        {
          type: "quote",
          text: "Nunca cresceu apressado e não é agora que vai começar. Cresce com a solidez de quem já tem 60 anos e pretende ter mais 60.",
        },
      ],
    },
    ecossistema: {
      title: "Ecossistema de negócios",
      subtitle: "Como o negócio se sustenta e para onde pode crescer.",
      blocks: [
        {
          type: "lead",
          text: "O Cruz de Malta opera um modelo clássico de restaurante de serviço completo (full-service): venda direta ao consumidor, à la carte, com atendimento de mesa. Cada visita é uma venda; o faturamento se sustenta no giro do salão, nos dois turnos, todos os dias.",
        },
        {
          type: "paragraph",
          text: "O canal principal é próprio e presencial — sem intermediários entre a marca e a mesa. Há ainda um canal secundário de delivery, com pedidos por WhatsApp e entrega própria, sem depender de plataformas.",
        },
        {
          type: "stat",
          items: [
            { label: "Ponto", value: "Um endereço de 60 anos que é ativo de marca por si só" },
            { label: "Saber-fazer", value: "As receitas e o tempero da casa que garantem a consistência" },
            { label: "Pessoas", value: "Equipe e gestão familiar que conhecem o cliente pelo nome" },
          ],
        },
        {
          type: "paragraph",
          text: "No horizonte, o modelo aponta para a integração vertical: com a pecuária própria, o Cruz pode evoluir para um formato do campo à mesa (farm-to-table) e para uma linha de produtos com o nome da casa — uma direção, não uma pressa.",
        },
      ],
    },

    /* -------------------------------------------------- 03 Expressão */
    "conceito-visual": {
      title: "Conceito visual",
      subtitle: "A direção da nova expressão da marca.",
      blocks: [
        {
          type: "lead",
          text: "Manter as cores principais já reconhecidas, ajustar os elementos da logo, respeitar a história e construir uma identidade com frescor e estratégia — uma estética vintage, tradicional e atual, sem caricato.",
        },
        {
          type: "stat",
          items: [
            { label: "Antigo", value: "→ Tradicional" },
            { label: "Genérico", value: "→ Único" },
            { label: "Ríspido", value: "→ Sério, mas saboroso" },
            { label: "Datas repetitivas", value: "→ Solução a longo prazo" },
            { label: "Sem documentação", value: "→ Padrão organizado" },
          ],
        },
        {
          type: "paragraph",
          text: "O sistema visual explora o “Cruz da Bento” — o endereço e a fachada — e o universo tradicional e gaúcho da casa, fazendo da tradição um diferencial positivo.",
        },
      ],
    },
    "logo-simbolo": {
      title: "Logo e símbolo",
      subtitle: "Lapidar sem mudança brusca, respeitando a história.",
      blocks: [
        {
          type: "paragraph",
          text: "A logo é lapidada sem ruptura: a cruz ganha personalidade própria, para ser reconhecida como a do Cruz de Malta, com o racional documentado e padronizado. O número que trocava a cada ano dá lugar a um selo comemorativo independente e removível, construindo expectativa rumo aos 60 anos.",
        },
        {
          type: "image",
          src: "/clients/cruz-de-malta/logo-02.png",
          alt: "Logo Cruz de Malta — assinatura principal",
          caption: "Assinatura principal — versão positiva sobre vermelho",
          contain: true,
        },
        {
          type: "gallery",
          images: [
            { src: "/clients/cruz-de-malta/logo-01.png", alt: "Logo Cruz de Malta — vermelho sobre branco" },
            { src: "/clients/cruz-de-malta/logo-03.png", alt: "Logo Cruz de Malta — vermelho sobre creme" },
            { src: "/clients/cruz-de-malta/logo-04.png", alt: "Logo Cruz de Malta — branco sobre bordô" },
          ],
        },
        {
          type: "files",
          files: [
            { name: "Logo Cruz de Malta — RGB (.ai)", href: driveFile("1jKgYnnbgoHozdskD7jErK91_71WcK1yu"), kind: "AI" },
            { name: "Logo Cruz de Malta — RGB (.pdf)", href: driveFile("1mub_QSel8s7k0r2Ct3WAW3UTczwhiDxM"), kind: "PDF" },
            { name: "Logo Cruz de Malta — CMYK (.ai)", href: driveFile("1sV1bmrgAKeMxRfrJNeXDfnf9ANIu2EKV"), kind: "AI" },
            { name: "Logo Cruz de Malta — CMYK (.pdf)", href: driveFile("1CmSEVGo1-OcA5guaNKYzgiiEPeEZdGuS"), kind: "PDF" },
          ],
        },
      ],
    },
  },
};

/* ------------------------------------------------------------------ *
 * Cliente — Jujoo (Milkshakeria · milkshakes e sobremesas premium)
 * Dados extraídos do "Brandbook Jujoo V1" (Drive). Cores e tipografia
 * documentadas. Sem fotografia ainda — "em uso" = lockups do slogan.
 * ------------------------------------------------------------------ */
export const JUJOO: ClientBrand = {
  slug: "jujoo",
  name: "Jujoo",
  tagline: "Milkshakeria — o seu momentoo de alegria.",
  accent: "#63288A",
  hub: {
    year: "2026",
    since: "Milkshakeria",
    drive: {
      assets: "https://drive.google.com/drive/folders/1-BIc7c07zxNWFi-qfz94TmWwfUp9zth4",
      expressao: "https://drive.google.com/drive/folders/17k_n-w2H6i8S8GRUZADQk58OzkOUslTz",
    },
    brandbook: "https://drive.google.com/file/d/1nMR2lh5TVU1nremF_y3Bf1ja2b-yjSXO/view",
    fontsUrl: "https://drive.google.com/drive/folders/1iC5e9aNEI1IsXF0LmDdo_q01nJ0Ai_UC",
    logos: [
      { name: "Assinatura principal", role: "Positiva sobre roxo", src: "/clients/jujoo/jujoo-principal.png", file: "jujoo-principal.png", drive: "https://drive.google.com/file/d/139T46kIm2elpX1pUm6H92qtAmNFJDGHJ/view", pad: "var(--c1)" },
      { name: "Roxo sobre branco", role: "Fundos claros", src: "/clients/jujoo/jujoo-roxo.png", file: "jujoo-roxo.png", drive: "https://drive.google.com/file/d/139T46kIm2elpX1pUm6H92qtAmNFJDGHJ/view", pad: "#ffffff" },
      { name: "Sobre pêssego", role: "Peças da marca", src: "/clients/jujoo/jujoo-pessego.png", file: "jujoo-pessego.png", pad: "var(--c2)" },
      { name: "Branco sobre caramelo", role: "Uso quente", src: "/clients/jujoo/jujoo-caramelo.png", file: "jujoo-caramelo.png", pad: "var(--c3)" },
    ],
    colors: [
      { name: "Roxo Jujoo", hex: "#63288A", role: "Cor âncora — PANTONE 526 C", cmyk: "63 88 6 1" },
      { name: "Pêssego", hex: "#FFD8BD", role: "Leveza e apetite — PANTONE 475 C", cmyk: "3 14 20 0" },
      { name: "Caramelo", hex: "#B76F3D", role: "Sabor e calor — PANTONE 7572 C", cmyk: "21 48 67 8" },
    ],
    pairings: [
      { bg: "#63288A", fg: "#FFD8BD", label: "Roxo + Pêssego" },
      { bg: "#FFD8BD", fg: "#63288A", label: "Pêssego + Roxo" },
      { bg: "#63288A", fg: "#FFFFFF", label: "Roxo + Papel" },
    ],
    type: [
      { role: "Display / Marca", family: "Koni Black", sample: "Jujoo" },
      { role: "Ornamento", family: "Koni Ornament Black", sample: "Milkshakes" },
      { role: "Texto", family: "PP Radio Grotesk", sample: "O seu momentoo de alegria!" },
    ],
    essence: {
      lead: "Não é apenas sobremesa. É o seu momentoo de alegria — uma experiência jovem e confiável de milkshakes e sobremesas premium, com qualidade consistente e operação ágil.",
      proposito: "Proporcionar momentos simples de felicidade por meio de experiências deliciosas, rápidas e confiáveis. Ser ponto de encontro, recompensa do dia e pausa prazerosa — transformar um consumo rápido num pequeno momento memorável.",
      posicionamento: "Gourmet acessível: o território entre a sobremesaria artesanal lenta e o fast food genérico. Instagramável, ágil na medida e replicável — com cara de franquia pronta para crescer.",
      quote: "Sempre gostoso. Sempre ágil. Sempre certo.",
      atributos: ["Jovem", "Alegre", "Acessível", "Convidativa", "Contemporânea", "Premium", "Consistente", "Ágil", "Instagramável", "Confiável"],
    },
    verbal: {
      tom: "Jovem e alegre, sem ser infantil. Convidativa e acessível, com a energia de quem entrega um momento de prazer rápido e certeiro. O “oo” é assinatura da marca — aparece no “Jujoo” e no “momentoo”.",
      sim: ["O seu momentoo de alegria", "Sempre gostoso, sempre ágil", "Milkshakes e sobremesas premium", "Gourmet acessível", "Sabores pensados pra funcionar"],
      nao: ["Infantil demais", "Gourmet elitista", "Artesanal improvisado", "Monte do seu jeito (personalização infinita)", "Mais do mesmo"],
      examples: [
        { sim: "O seu momentoo de alegria: milkshake premium, rápido e sempre gostoso.", nao: "A mais sofisticada e exclusiva experiência gastronômica de sobremesas autorais." },
        { sim: "Sabores pensados pra funcionar. É só escolher e aproveitar.", nao: "Monte do seu jeito com infinitas combinações." },
      ],
    },
    photos: [
      { src: "/clients/jujoo/slogan-roxo.png", label: "O seu momentoo de alegria", group: "Assinatura em uso", fit: "contain", pad: "var(--c2)" },
      { src: "/clients/jujoo/slogan-pessego.png", label: "Versão positiva", group: "Assinatura em uso", fit: "contain", pad: "var(--c1)" },
      { src: "/clients/jujoo/slogan-caramelo.png", label: "Versão quente", group: "Assinatura em uso", fit: "contain", pad: "#ffffff" },
    ],
  },
  pages: {},
};

/* ------------------------------------------------------------------ *
 * Cliente — Casa Campo (Parque de jardins temáticos, eventos e hospedagem)
 * Essência extraída de "Casa Campo - Essência de Marca (v3)" (12 pontos).
 * Narrativa (StoryBrand, Parque + Eventos + Hospedagem) já entregue.
 * Expressão em andamento — cores/tipografia abaixo são a identidade atual
 * (pré-Mira), mantida como base provisória até o novo sistema visual fechar.
 * ------------------------------------------------------------------ */
const CASA_CAMPO: ClientBrand = {
  slug: "casa-campo",
  name: "Casa Campo",
  tagline: "Um dia que vira memória.",
  accent: "#0e3e4a",
  hub: {
    year: "2026",
    since: "Abertura do parque em novembro de 2026",
    logos: [
      { name: "Assinatura sobre azul-petróleo", role: "Aplicação padrão, fundos escuros", src: "/clients/casa-campo/logo-01.jpg", file: "casa-campo-petroleo.jpg", pad: "#0e3e4a" },
      { name: "Assinatura sobre verde-sálvia", role: "Aplicação alternativa, fundos claros", src: "/clients/casa-campo/logo-02.jpg", file: "casa-campo-salvia.jpg", pad: "#8fbf97" },
    ],
    colorsNote: "Identidade atual (pré-Mira) — a Expressão está em desenvolvimento. Paleta e tipografia abaixo seguem como base provisória até o novo sistema visual fechar.",
    colors: [
      { name: "Verde-sálvia", hex: "#8fbf97", role: "Natureza e jardins — cor de apoio" },
      { name: "Azul-petróleo", hex: "#0e3e4a", role: "Âncora da marca — profundidade e sofisticação" },
      { name: "Âmbar", hex: "#eda656", role: "Calor e acolhimento — pôr do sol" },
      { name: "Branco-gelo", hex: "#f5f6f5", role: "Respiro e fundos claros" },
    ],
    pairings: [
      { bg: "#0e3e4a", fg: "#f5f6f5", label: "Petróleo + Branco-gelo" },
      { bg: "#8fbf97", fg: "#0e3e4a", label: "Sálvia + Petróleo" },
      { bg: "#0e3e4a", fg: "#eda656", label: "Petróleo + Âmbar" },
    ],
    type: [
      { role: "Títulos", family: "Poppins (Negrito)", sample: "Um dia que vira memória." },
      { role: "Texto", family: "Poppins (Leve)", sample: "Jardins, eventos e hospedagem num só lugar." },
      { role: "Assinatura / acento", family: "Buffalo", sample: "Casa Campo" },
    ],
    essence: {
      lead: "Um dia que vira memória: parque, eventos e hospedagem somados numa experiência de excelência em meio à natureza, ao lado de quem se ama.",
      proposito: "Reunir jardins temáticos, eventos e hospedagem sob uma só marca-mãe — o Parque Casa Campo — dando à experiência a potência de um grande parque, à altura da região de Balneário Camboriú.",
      posicionamento: "Ocupar a categoria de parque: 60 mil m² com jardins temáticos e a maior coleção de cactos do Brasil, somando eventos (mais de 20 anos, 2 mil realizados) e hospedagem dentro do próprio parque — combinação que nenhum concorrente da região tem.",
      quote: "Aqui não tem fim.",
      atributos: ["Deslumbrante", "Natural", "Impecável", "Surpreendente", "Inesquecível", "Estruturada", "Bem servida", "Acolhedora"],
    },
    essenceArticle: {
      slug: "essencia-casa-campo",
      kicker: "Essência de Marca · Mira Brand Studio · setembro de 2026",
      title: "Essência de Marca",
      subtitle: "Um dia que vira memória: parque, eventos e hospedagem somados numa experiência de excelência em meio à natureza, ao lado de quem se ama.",
      sections: [
        {
          heading: "01 · História",
          paragraphs: [
            "A Casa Campo é obra de Seu Zouhair Haidar, empreendedor de origem libanesa com o comércio no sangue. Visionário e incansável, fez carreira no varejo e construiu com a família uma rede de restaurantes árabes que chega a 25 anos. Ao longo desse caminho, guardou duas convicções: investir em terra e, um dia, trabalhar com turismo.",
            "A Casa Campo começou como o sonho de um espaço para reunir família e amigos: uma grande área verde a poucos minutos da BR-101, com vista para as montanhas e um pôr do sol de tirar o fôlego. O lugar mostrou potencial para muito mais, e a família Haidar se uniu a parceiros experientes do setor para colocar em prática um complexo de eventos em Itajaí, com quatro espaços e a bagagem de mais de 20 anos e 2 mil eventos realizados.",
            "Em 2025, a visita a um parque de flores acendeu uma ideia ainda maior. Seu Zouhair percorreu os principais parques do gênero no Sul, voltou decidido e, em pouco mais de um ano, pôs de pé um projeto de outra escala no mesmo terreno, rodeado pelos espaços de eventos: trilhas, 11 mil m² de jardins temáticos assinados pelo paisagista Beto Amaral e a maior coleção de cactos do Brasil. A abertura está marcada para novembro de 2026.",
            "É a trajetória de um empreendedor que transforma visão em obra. Os eventos trouxeram experiência e credibilidade; o parque traz escala e um público muito maior. Com duas forças desse tamanho no mesmo lugar, faz sentido somá-las, mostrando a grandeza do que a Casa Campo está se tornando.",
          ],
        },
        {
          heading: "02 · Contexto",
          paragraphs: [
            "O Litoral Norte catarinense se tornou um dos polos de turismo mais movimentados do país. Balneário Camboriú consolidou parques e atrações de padrão internacional. Itajaí, logo ao lado, tem porto, rota de cruzeiros e acesso privilegiado, mas ainda busca atrações à altura dessa posição. A prefeitura abraçou o projeto desde o início.",
            "A Casa Campo está no centro desse mapa: entre Itajaí, Brusque e Blumenau, três das maiores cidades do estado, a poucos minutos da BR-101 e perto da BR-470, do aeroporto e do porto. É uma região próspera, movida pela indústria e pelo comércio, com renda e disposição para lazer de qualidade.",
            "Ao mesmo tempo, cresce a procura por lazer ligado à natureza e ao bem-estar, movimento que ganhou força depois da pandemia e transformou parques de flores, como os da Serra Gaúcha, em destinos procurados. É nesse cenário que a Casa Campo muda de patamar: os eventos já têm datas fechadas para este ano e o próximo, as hospedagens estão em expansão e o parque abre em novembro, às portas da alta temporada.",
            "Foi nesse momento que a Casa Campo procurou a Mira, com a ideia de criar uma marca para o Garden. Ao conhecer o projeto de perto, ficou claro que o pedido era maior. Não se tratava de criar mais uma frente, e sim de olhar para a marca como um todo e dar a ela a potência de um grande parque, à altura das referências da região de Balneário Camboriú.",
            "Em resumo, o momento é raro: uma região que quer turismo, um público que procura natureza e um verão logo depois da abertura. A urgência é de posição. A Casa Campo precisa chegar a novembro já percebida como destino, e não como uma novidade à espera de ser descoberta.",
          ],
        },
        {
          heading: "03 · Desafios",
          paragraphs: [
            "Os desafios da Casa Campo não estão nos produtos em si, no espaço, na estrutura de eventos, nos jardins e na energia de quem toca o projeto. Isso tudo já existe. O desafio é fazer tudo isso ser percebido no tamanho que se deseja transparecer.",
            "O primeiro é somar eventos e Garden sob uma só marca. Os eventos já têm marca, público e forma de venda próprios. O Garden nasceu depois e vem ganhando status de parque de forma rápida. É preciso organizar as duas frentes sem enfraquecer nenhuma, e isso é urgente, porque placas, site, outdoor e souvenirs dependem dessa decisão.",
            "A esse desafio se soma a construção do valor percebido. O parque foi pensado para público médio e alto, e a marca precisa mostrar, antes do primeiro ingresso, tudo o que a experiência entrega.",
            "Resolvidos os dois, o negócio muda de patamar. A marca passa a falar com uma só voz em cada ponto de contato, o parque traz público em escala e os eventos crescem com esse fluxo. É assim que a Casa Campo abre como um novo destino da região, e não como mais uma atração.",
          ],
        },
        {
          heading: "04 · Serviços e Produtos",
          paragraphs: [
            "O parque ocupa 60 mil m², dos quais cerca de 11 mil m² são de jardins plantados, com projeto para chegar a 20 mil. São diversos jardins temáticos — Tropical, Rural, das Mulheres, das Águas, das Artes, Francês, Rochoso, das Rosas, Japonês, do Sol e o do marinheiro, com uma âncora em homenagem a Itajaí. O destaque é a maior coleção de cactos do Brasil, comprada inteira de um produtor que se dedicou a ela por mais de 40 anos. Completam a visita trilhas ecológicas, escadaria na mata, mirante, ponte pênsil, tirolesa e playground, com café, restaurante e quiosques para alimentação, loja de plantas e loja de souvenirs na saída. Somam-se a isso as experiências pensadas para prolongar o passeio, como piqueniques com cestas montadas e visitas guiadas pelos jardins.",
            "A estrutura de eventos é o negócio que já opera. São quatro espaços com identidade própria — Cedro, até 500 pessoas; Granato, até 150; Rústico, até 120; e Brisa, até 80 —, cada um com cozinha própria, além da capela para cerimônias, renovações de votos e ensaios fotográficos. A entrega inclui buffet e bebidas, equipe completa de serviço e estacionamento interno. Casamentos são a maior demanda, seguidos de bodas, formaturas, aniversários e eventos corporativos.",
            "As hospedagens completam o conjunto e transformam a visita em estadia. São casas e cabanas planejadas para conforto, privacidade e bem-estar em meio à natureza, que atendem tanto os noivos e convidados dos eventos quanto quem vem passar o fim de semana no parque. São 20 unidades em 2026, com previsão de 50 até o fim de 2027 e projeção de 100 em 2028.",
            "Quando se fala do parque, o que a marca entrega não é só uma lista de atrações, e sim um dia inteiro num só lugar. A ideia é que o visitante caminhe, pare para ler as placas com nome científico e pequenas histórias de cada jardim, faça uma trilha, coma bem, estenda uma toalha no gramado e saia com uma lembrança da loja. Para 2028, está prevista a ampliação com um parque temático noturno, unindo natureza, arte, tecnologia e iluminação cênica.",
            "As frentes de parque, eventos e hospedagem não competem entre si, elas se complementam. Quem vem passear descobre um lugar para casar ou celebrar, e quem vem a um evento conhece o parque e volta com a família. É mais um sinal de que a marca precisa ser apresentada como um destino só, e não como negócios separados.",
          ],
        },
        {
          heading: "05 · Modelo de Negócio",
          paragraphs: [
            "A Casa Campo é o que o próprio projeto chama de complexo multifuncional: várias camadas de receita no mesmo terreno. No parque, a previsão é cobrar ingresso na casa dos R$ 50 a R$ 60 por pessoa, valor que se soma ao estacionamento, à loja de souvenirs, à loja de plantas, aos quiosques, ao café e ao restaurante, além de experiências e passeios cobrados à parte, como a tirolesa e os piqueniques. Para 2028, a ampliação noturna abre mais uma frente.",
            "Os eventos funcionam por locação dos espaços, com serviços agregados: buffet e bebidas, que podem ser da casa ou de parceiros conforme o padrão do evento, equipe de garçons, copa, limpeza e segurança, e a capela para cerimônias e ensaios. Cada um dos quatro espaços tem cozinha própria, o que permite eventos simultâneos. As locações costumam ser fechadas com bastante antecedência. As hospedagens somam a terceira camada: recebem convidados dos eventos, visitantes do parque e podem ser alugadas nos períodos de menor movimento de eventos, com a expansão de 20 para 100 unidades até 2028.",
            "As pontas se equilibram por natureza. Comparado a um evento, o ingresso do parque é de valor menor e volume alto, e cresce com o consumo de experiências, produtos e facilidades durante o passeio. Os eventos são de ticket alto e volume limitado, porque dependem da agenda e do número de espaços disponíveis. Quem contrata um evento já tem o acesso ao parque incluído, e quem visita o parque conhece o espaço e vira cliente em potencial dos eventos e das hospedagens.",
            "O que faz o modelo girar é o tempo de permanência. Quanto mais o visitante caminha, lê as placas, faz a trilha, senta para comer e fotografa, maior o consumo dentro do parque, e a saída foi desenhada para passar pela loja de souvenirs. Do outro lado da conta está a manutenção: o jardim é o produto, e ele só se sustenta impecável, todos os dias, com equipe dedicada a isso.",
            "É um modelo que depende de duas coisas que a marca controla diretamente: a quantidade de gente que atravessa a portaria e a sensação de que o dia valeu o que custou. Por isso o próximo passo é entender exatamente quem é esse público e o que ele procura.",
          ],
        },
        {
          heading: "06 · Público e Necessidades",
          paragraphs: [
            "O público do parque é sobretudo familiar. Vêm os pais com crianças pequenas, que precisam de espaço aberto. Vêm os casais, de todas as idades, atrás de um passeio bonito e sem pressa. Vêm os grupos de excursões, muitas vezes de pessoas mais velhas, que admiram jardinagem e passeiam para observar e conhecer. Vêm os moradores e turistas da região, ou que desembarcam dos cruzeiros no porto de Itajaí. São pessoas de renda média e alta. Para elas, o passeio é um programa de fim de semana ou de férias, que quase sempre termina em fotografia: o registro faz parte do que se leva para casa.",
            "Não podemos esquecer que há um fio que atravessa todos esses públicos: o afeto. Flores simbolizam isso, sendo há séculos uma linguagem com a qual as pessoas dizem o que sentem. Não é à toa que o mesmo lugar recebe casamentos, bodas, batizados, aniversários e ensaios de noivos. Quem vem ao parque vem passar um tempo com quem ama. Quem contrata um evento está celebrando um vínculo. Isso dá à Casa Campo uma aura romântica que não é enfeite, e sim matéria-prima: uma marca emotiva e profunda, que fala de amor com potência, nunca de forma ingênua.",
            "Nos eventos, o público já está mapeado e segue valendo: noivos entre 25 e 35 anos das classes A e B, pais e familiares acima de 40 que participam da decisão e pagam por confiança, empresas e comissões de formatura que precisam de estrutura completa, e casais que escolhem casar longe de casa. As hospedagens atendem esses convidados e quem quer esticar o passeio e dormir no parque. A escolha passa por indicação e pelo que se vê nas redes, mas é a visita ao local que costuma fechar a decisão.",
            "No fundo, todos procuram a mesma coisa: sair da rotina, viver algo bonito ao lado de quem gosta e ter certeza de que valeu a pena. Vale delimitar quem a marca não persegue: não é quem busca adrenalina de parque de aventura, nem quem procura o programa mais barato do fim de semana. A Casa Campo existe para quem escolhe o contrário disso, e é essa escolha que define o clima do lugar, a experiência e a forma de falar com as pessoas. É desse recorte que nascem os valores da marca.",
          ],
        },
        {
          heading: "07 · Valores",
          paragraphs: [
            "Os valores que norteiam a Casa Campo não foram inventados para este documento. Eles já operam no dia a dia do negócio e explicam como as decisões são tomadas: valem para as obras que acontecem, para cada conversa, para cada escolha de fornecedor, para cada atendimento e para cada relação com quem trabalha ou consome junto. São cinco.",
            "Atitude. Aqui quem decide é quem faz. O fundador está no trator e na enxada, o paisagista mora dentro do parque, a arquiteta está no local todos os dias: estratégia e execução andam juntas, e o trabalho pesado não é delegado, é acompanhado de perto.",
            "Convicção. A Casa Campo entra onde outros enxergam risco, com a certeza de que vai dar certo. Foi assim nos 25 anos de restaurantes e é assim agora, com um parque erguido numa região que ainda não tinha nada parecido. Essa certeza contagia equipe, parceiros e quem chega para somar.",
            "Dinamismo. Uma visita vira decisão, uma decisão vira obra, e o lugar muda visivelmente de uma semana para a outra. Se um caminho não funciona, resolve-se por outro, sem parar. É um valor que cobra o mesmo ritmo de todos os parceiros.",
            "Excelência. O jardim é o produto, e produto se cuida todos os dias. O padrão vale igual para o gramado, para o banheiro e para a forma de receber: nada fica pela metade, e o bonito aqui é consequência do bem feito.",
            "Franqueza. A casa fala de frente, diz o que gostou e o que não gostou, e espera o mesmo de quem trabalha com ela. É um valor que economiza tempo e constrói confiança rápido.",
            "Juntos, os cinco funcionam como filtro: definem o que a Casa Campo aceita e o que recusa pelo caminho. São eles que explicam por que um projeto desse tamanho saiu do papel em pouco mais de um ano, e é a partir deles que se reconhecem as qualidades da marca.",
          ],
        },
        {
          heading: "08 · Qualidades",
          paragraphs: [
            "Este projeto existe, entre outras coisas, para construir a percepção de qualidades que ainda não são percebidas, porque o negócio segue em construção. Para entender o caminho que já está sendo trilhado, observamos o que se diz hoje sobre a Casa Campo Eventos, que tem nota 5,0 no Google. Quatro atributos já aparecem espontaneamente. Outros quatro são os que queremos ouvir sobre a Casa Campo como um todo depois da abertura.",
            "O que já se diz hoje — Deslumbrante: a beleza é a primeira reação, a ponto de aparecer como \"o complexo de eventos mais lindo de Santa Catarina\". Natural: natureza é a palavra mais repetida nas avaliações, descrita como viva e presente em todos os cenários. Estruturada: salões, estacionamento amplo, buffet e hospedagem, tudo percebido como robusto e completo. Bem servida: equipe elogiada pelo nome que dá ao serviço, com \"tudo perfeito\" e \"equipe maravilhosa\".",
            "O que queremos passar a ouvir de quem vive a experiência e conhece o espaço do parque — Surpreendente: ninguém espera encontrar algo daquele tamanho ali, e a frase que se quer ouvir é \"eu não imaginava que existia isso aqui\". Linda: a reação imediata de quem chega, dita sem pensar, diante dos jardins, da vista e do pôr do sol. Impecável: cuidado em cada detalhe, com canteiro tratado, ambiente limpo, cheiroso e bem pensado, em qualquer dia da semana. Inesquecível: a visita que vira memória, é fotografada, contada para quem não foi e desperta vontade de voltar.",
          ],
        },
        {
          heading: "09 · Promessas e Diferenciais",
          paragraphs: [
            "A promessa da Casa Campo é uma experiência de excelência em meio à natureza, ao lado de quem se ama. Vale para a família que chega no domingo de manhã, para o casal que quer um passeio sem pressa e para os noivos que escolhem ali o dia mais importante da vida deles. É a mesma entrega em escalas diferentes.",
            "Vale separar o que é diferencial do que é lugar-comum. Gastronomia, exclusividade e bom atendimento são ditos por praticamente todos os espaços da região e, por isso, não diferenciam ninguém.",
            "Os diferenciais reais da Casa Campo são quatro: a soma de parque, eventos e hospedagem reunidos no mesmo espaço, combinação que nenhum concorrente da região tem; jardins temáticos que oferecem vários universos num passeio só, numa natureza desenhada e não apenas encontrada; a maior coleção de cactos do Brasil, cultivada por décadas por um único produtor e hoje impossível de replicar; e um acesso privilegiado, a poucos minutos da BR-101, entre Itajaí, Brusque e Blumenau, perto do aeroporto e do porto.",
            "O mais forte deles é a soma. Um parque de flores não recebe casamentos, um espaço de eventos não tem coleção botânica, e nenhum dos dois entrega tudo isso a quinze minutos da rodovia. Estrutura se copia com tempo e dinheiro, mas a coleção, a escala já construída e o ritmo de quem toca o projeto, não. É com esse conjunto que a marca entra no mercado.",
          ],
        },
        {
          heading: "10 · Análise de Mercado",
          paragraphs: [
            "A Casa Campo não tem, na região, um concorrente que entregue exatamente o que ela vai entregar. O que existe é disputa em três frentes, e cada uma pede uma leitura própria.",
            "A primeira é a dos parques de flores e jardins do Sul, com destaque para o Mátria e os parques de Gramado. São eles que definem a expectativa do público para esse tipo de passeio, e é de lá que vem boa parte das referências do projeto. Também é de lá que vêm as brechas: na visita do Seu Zouhair, o que mais chamou atenção foi o jardim malcuidado, a comida ruim e o estacionamento precário. Estão, além disso, a cinco ou seis horas de carro, longe demais para o catarinense que quer um programa de fim de semana.",
            "A segunda frente é a das atrações turísticas de Balneário Camboriú, como o Aventura Jurássica, o parque temático da NASA, o Oceanic Aquarium, o Cristo Luz e o Unipraias. Elas disputam o dia livre e o orçamento de lazer da mesma família. O que fazem bem é evidente: padrão de primeiro mundo, operação automatizada, manutenção rigorosa, venda casada em passaporte e mídia por toda a cidade. A diferença é de natureza: são atrações de estímulo e adrenalina, construídas em torno de temas e equipamentos, enquanto a Casa Campo se constrói em torno da paisagem e da contemplação.",
            "A terceira frente é a dos espaços de eventos da região, e ali a disputa é de vocabulário. Z Social Complex, em Brusque, promete \"o espaço ideal para eventos incríveis\" e se apresenta como moderno, urbano e versátil. O Colina fala em \"viver momentos únicos\", com um tom leve e elegante. O GH Estaleiro, na praia, se posiciona como luxuoso e singular. A Quinta Borba, com chalés na mata, aposta no romântico e natural. Todos prometem praticamente a mesma coisa: experiência única, exclusividade, natureza e bom atendimento. Quando todos dizem o mesmo, ninguém diz nada.",
            "Considerando tudo isso, a Casa Campo se encaixa num espaço que hoje ninguém ocupa: tem a escala e a contemplação dos parques de flores do Sul, mas fica a poucos minutos de quem mora e passeia no litoral catarinense; tem o padrão de operação das grandes atrações de Balneário Camboriú, mas entrega calma em vez de adrenalina; e tem a estrutura de eventos que os concorrentes têm, com algo que nenhum deles pode oferecer ao redor.",
          ],
        },
        {
          heading: "11 · Posicionamento",
          paragraphs: [
            "Hoje, para quem já conhece, a Casa Campo ocupa o lugar de um espaço de eventos em Itajaí, bonito e bem estruturado.",
            "Porém, ao lado disso, está nascendo o que chamamos de garden, o que dá à Casa Campo, como um todo, o status de complexo multifuncional. Esse é um termo que não nomeia categoria nenhuma: pode ser qualquer coisa, em qualquer lugar, de qualquer setor. E o resultado disso tende a ser um só: ninguém sabe em que prateleira mental guardar a Casa Campo. Por isso, é importante pensarmos que o lugar que a Casa Campo precisa ocupar é o de parque.",
            "Parque é uma categoria já existente na cabeça das pessoas: um lugar físico, tem natureza, tem lazer, tem passeio, tem ingresso, dá para ir com a família no fim de semana.",
            "Nomear a categoria é o movimento mais valioso deste projeto, porque faz o trabalho da explicação sozinho. É daí que nasce a arquitetura de marca: Parque Casa Campo como marca principal, e a Casa Campo Eventos como uma das frentes dentro dele, com seu público e sua forma de vender preservados. A palavra, aliás, já é deles: a própria apresentação institucional fala em \"um novo destino\" e chama a ampliação de 2028 de parque temático. Ou seja, não há novidade nenhuma aqui, e é justamente isso que torna o movimento fácil: parque é um termo que todo mundo já usa e entende, e que carrega junto tudo o que foi dito acima.",
            "A hospedagem também cabe nessa categoria sem perder nada. Parque não exclui hospedagem, e já existem parques com hospedagem dentro. Pelo contrário: dizer que se vai dormir dentro de um parque soa mais exclusivo do que dizer que se vai dormir num espaço de eventos.",
            "Há também aquilo com o que a marca não quer ser confundida. Não é um parque de aventura, de adrenalina e equipamentos. Não é apenas um espaço de festas e casamentos, ainda que os eventos sigam fortes. Não é um jardim de visitação pequeno, de meia hora de passeio. E não é um complexo multifuncional, porque isso não diz nada a ninguém.",
            "Se tivesse que caber numa frase, seria a que se quer ouvir de quem mora na região: vamos passar o domingo no Parque Casa Campo. Quando alguém ouvir esse nome, a primeira coisa que deve vir à cabeça é parque, no tamanho e na potência que a palavra carrega, e é dentro dele que os eventos, as hospedagens e os jardins passam a fazer sentido juntos.",
          ],
        },
        {
          heading: "12 · Visão de Futuro",
          paragraphs: [
            "O primeiro horizonte é a abertura, em novembro de 2026. A ambição aqui não é apenas inaugurar: é que a Casa Campo seja recebida como um destino que a região esperava, e não como uma novidade a ser descoberta aos poucos. Isso significa chegar ao verão já conhecida, com nome, categoria e presença definidos, e com o parque entrando nas rotas turísticas de Itajaí, nos roteiros dos cruzeiros e nas feiras do setor.",
            "O segundo horizonte é a consolidação, ao longo de 2027. Os jardins plantados devem crescer dos 11 mil para cerca de 20 mil m², as hospedagens saltam para 50 unidades até o fim do ano, e a agenda de eventos passa a ser alimentada pelo fluxo de visitantes do parque, num ciclo em que uma frente vende a outra. É quando a marca deixa de ser promessa e passa a ser medida por gente que voltou e por gente que indicou.",
            "O terceiro horizonte é a expansão, a partir de 2028, com o parque temático noturno somando arte, tecnologia e iluminação cênica ao que já existe, e a projeção de 100 unidades de hospedagem. É também quando a ambição declarada na reunião ganha escala: ser reconhecido como um dos maiores e melhores parques de flores do Brasil, com área para crescer e uma equipe que já provou que executa rápido.",
            "Por trás dos três horizontes há uma frase do próprio Seu Zouhair: aqui não tem fim. A Casa Campo é um negócio de família pensado para durar mais que uma geração, e é por isso que a marca precisa nascer maior do que o momento atual exige. Construída assim, ela comporta o que vier: novos jardins, novas hospedagens, novas frentes.",
            "Essência definida, o próximo passo é transformar tudo isso em narrativa e expressão.",
          ],
        },
      ],
    },
    verbal: {
      tom: "Acolhedor e seguro, com a autoridade de quem já fez 2 mil eventos. Fala como um guia que sabe que os dias bons com quem se ama passam rápido, e que o visitante deve viver o dia, não resolver problemas. Regra fixa de copy: a marca nunca usa travessão em nenhum texto.",
      sim: ["Um dia que vira memória", "Viver o dia, não resolver problemas", "O parque à sua porta", "Jardins temáticos e a maior coleção de cactos do Brasil", "Não precisar ir embora"],
      nao: ["Complexo multifuncional (termo vazio, não nomeia categoria)", "Mais uma atração", "Experiência gastronômica premium (lugar-comum da região)", "Adrenalina, parque de aventura", "Travessão em qualquer texto"],
      examples: [
        { sim: "Um dia comum vira memória. Venha para o Parque Casa Campo.", nao: "Complexo multifuncional de lazer com experiências premium em meio à natureza." },
        { sim: "Durma dentro do parque. É só não ir embora.", nao: "Hospedagem exclusiva com infraestrutura de padrão internacional." },
      ],
    },
    photos: [
      { src: "/clients/casa-campo/fotografia/fundador-01.jpg", label: "Seu Zouhair Haidar, fundador", group: "Bastidores" },
      { src: "/clients/casa-campo/fotografia/fundador-02.jpg", label: "No jardim, entre as rosas", group: "Bastidores" },
      { src: "/clients/casa-campo/fotografia/fundador-03.jpg", label: "Cuidando das rosas", group: "Bastidores" },
      { src: "/clients/casa-campo/fotografia/portao.jpg", label: "O portão do parque, em obras", group: "Bastidores" },
      { src: "/clients/casa-campo/fotografia/jardim-obra.jpg", label: "Plantio dos jardins temáticos", group: "Bastidores" },
      { src: "/clients/casa-campo/fotografia/canteiro.jpg", label: "Abrindo caminho, canteiro a canteiro", group: "Bastidores" },
    ],
    narratives: [
      {
        slug: "parque",
        kicker: "Narrativa de Marca · StoryBrand · Público principal",
        title: "Parque Casa Campo — marca-mãe",
        subtitle: "Herói: o visitante do parque. Eixo: “um dia que vira memória”. Voz da marca: sem travessão.",
        sections: [
          {
            heading: "Ponto de partida",
            paragraphs: [
              "Começamos pelo público que move todos os outros. O parque é a frente de maior volume e mais acessível (topo do funil), o coração emocional da marca (o afeto) e o motor de cascata que alimenta eventos e hospedagem. Este é o roteiro da marca-mãe. Eventos e hospedagem são sub-roteiros aninhados, com o mesmo tom, o mesmo guia e a mesma promessa, sem dividir o esforço de comunicação.",
            ],
          },
          {
            heading: "01 · O herói",
            paragraphs: [
              "Quem é: renda média e alta, da região ou de passagem. Escolhe o oposto da adrenalina e do programa mais barato. Cena mais representativa: a família num domingo, mas também o casal sem pressa e o grupo que passeia para contemplar.",
              "O que ele quer: viver um dia bonito ao lado de quem ama, que vire lembrança.",
            ],
          },
          {
            heading: "02 · O problema",
            paragraphs: [
              "Vilão: os dias que passam em branco. Tempo bom com quem se ama que não vira lembrança.",
              "Externo: a região oferece muitos passeios bonitos, mas um dia realmente completo e memorável, para a família toda e sem correria, quase nunca cabe num lugar só.",
              "Interno: o receio de que o passeio não valha o que custa e se perca no meio de tantos outros. O desejo de dar aos seus um dia que fique.",
              "Filosófico: os dias bons com quem se ama são poucos. Merecem um lugar à altura, feito para virar memória.",
            ],
          },
          {
            heading: "03 · O guia",
            paragraphs: [
              "Empatia: “sabemos que os dias bons com quem você ama passam rápido, e que você quer que alguns deles fiquem para sempre”.",
              "Autoridade, a soma como prova: parque, eventos e hospedagem no mesmo lugar, uma combinação que ninguém na região tem. 11 mil m² de jardins temáticos assinados por Beto Amaral. A maior coleção de cactos do Brasil. Mais de 20 anos e 2 mil eventos. Nota 5,0 no Google. A 15 minutos da BR-101.",
            ],
          },
          {
            heading: "04 · O plano",
            paragraphs: [
              "Processo: chegue com facilidade, a 15 minutos da BR-101, com o ingresso garantido. Caminhe sem pressa pelos jardins temáticos e trilhas, ouvindo a história de cada jardim, com um piquenique no gramado. Leve para casa as fotos e uma lembrança da loja.",
              "Acordo (promessas): jardim impecável todos os dias. Um dia inteiro num só lugar. Natureza para contemplar, não para correr.",
            ],
          },
          {
            heading: "05 · A ação",
            paragraphs: [
              "Direta: garanta sua visita, compre seu ingresso.",
              "Transicional: siga o Instagram, receba o aviso da abertura, baixe o mapa do parque.",
            ],
          },
          {
            heading: "06 · O que se evita",
            paragraphs: [
              "Mais um dia que passa em branco. Um passeio que ninguém vai lembrar. A sensação de que a família merecia algo que ficasse.",
            ],
          },
          {
            heading: "07 · O sucesso",
            paragraphs: [
              "Ele volta abastecido, mais perto de quem ama. A visita vira memória, foto e história contada para quem não foi, e desperta vontade de voltar e de trazer mais gente.",
              "Transformação de identidade: de alguém que coleciona passeios parecidos, para alguém que sabe onde criar memórias com quem ama.",
            ],
          },
        ],
        closing: "A gente vive em busca de um bom programa, mas poucos viram memória. O Parque Casa Campo reúne jardins, natureza e experiências num lugar só, a 15 minutos da BR-101, para transformar um dia comum em algo que a família guarda para sempre.",
      },
      {
        slug: "eventos",
        kicker: "Narrativa de Marca · StoryBrand · Frente secundária",
        title: "Eventos",
        subtitle: "Quem celebra um momento importante ao lado de quem ama. Públicos: noivos, bodas, formaturas, corporativo, destination wedding.",
        sections: [
          {
            heading: "Ponto de partida",
            paragraphs: [
              "Eventos e hospedagem falam com a mesma voz da marca-mãe. Mesma promessa (uma experiência de excelência em meio à natureza, ao lado de quem se ama, em escalas diferentes), cada frente com seu próprio herói e problema, e efeito cascata: o parque traz o público que descobre os eventos e a hospedagem, e um alimenta o outro. Não são marcas separadas, e sim sub-roteiros aninhados no roteiro do Parque Casa Campo.",
            ],
          },
          {
            heading: "01 · O herói",
            paragraphs: [
              "Quem é: o público principal são os noivos de 25 a 35 anos, classes A e B. Somam-se os pais e familiares acima de 40 que participam da decisão e pagam por confiança, as empresas e comissões de formatura, e os casais que escolhem casar longe de casa.",
              "O que ele quer: realizar um evento inesquecível, num lugar bonito e com tudo funcionando, para celebrar um momento que não se repete.",
            ],
          },
          {
            heading: "02 · O problema",
            paragraphs: [
              "Vilão: o medo de que algo dê errado no dia. A data única, que não se repete e depende de tudo se encaixar.",
              "Externo: um evento assim costuma exigir juntar vários fornecedores e lugares, o espaço, o buffet, a hospedagem, o cenário das fotos, e torcer para tudo combinar.",
              "Interno: o receio de decepcionar os convidados ou a família, de que falte algo, de que o dia não fique à altura do que representa.",
              "Filosófico: um momento que celebra um vínculo merece um lugar à altura, e a tranquilidade de saber que vai dar certo.",
            ],
          },
          {
            heading: "03 · O guia",
            paragraphs: [
              "Empatia: “sabemos que é um dia que não se repete, e que você quer viver cada minuto dele, não resolver problemas”.",
              "Autoridade: mais de 20 anos e 2 mil eventos realizados. Quatro espaços com identidade própria, de 80 a 500 pessoas, cada um com cozinha própria. Capela para cerimônias. Buffet, equipe completa e estacionamento interno. Nota 5,0. E o que ninguém na região tem: os jardins do parque como cenário e hospedagem para os convidados no mesmo lugar.",
            ],
          },
          {
            heading: "04 · O plano",
            paragraphs: [
              "Processo: visite e escolha o espaço, conheça o lugar e o cenário — a visita costuma fechar a decisão. Deixe com a equipe: buffet, serviço, cerimônia e cada detalhe com quem já fez isso 2 mil vezes. Viva o dia: celebre sem preocupação, com os convidados no parque e hospedagem ali mesmo.",
              "Acordo (promessas): um cenário que nenhum outro espaço da região tem. Equipe que cuida de tudo. Convidados que podem dormir no parque.",
            ],
          },
          {
            heading: "05 · A ação",
            paragraphs: [
              "Direta: agende uma visita, peça uma proposta.",
              "Transicional: veja os espaços, conheça casamentos já realizados, fale com a equipe de eventos.",
            ],
          },
          {
            heading: "06 · O que se evita",
            paragraphs: [
              "Um dia importante marcado por imprevistos. Convidados mal acomodados. A sensação de que faltou algo num momento que não volta.",
            ],
          },
          {
            heading: "07 · O sucesso",
            paragraphs: [
              "Um evento que os convidados não esquecem, num cenário que vira memória. Você viveu o dia em vez de resolver problemas, e o momento ficou à altura do vínculo que celebrou.",
              "Transformação de identidade: de quem teme que o grande dia não saia como sonhou, para quem confia o momento a quem sabe fazer e vive cada minuto.",
            ],
          },
        ],
        closing: "Todo grande momento merece um lugar à altura. Na Casa Campo você celebra entre jardins, com uma equipe de mais de 2 mil eventos cuidando de tudo e hospedagem para os convidados no mesmo lugar, para viver o dia em vez de resolver problemas.",
      },
      {
        slug: "hospedagem",
        kicker: "Narrativa de Marca · StoryBrand · Frente secundária",
        title: "Hospedagem",
        subtitle: "Quem quer prolongar o bom momento e ficar. Públicos: convidados dos eventos, visitantes que esticam, refúgio na natureza, descanso.",
        sections: [
          {
            heading: "Ponto de partida",
            paragraphs: [
              "Eventos e hospedagem falam com a mesma voz da marca-mãe. Mesma promessa (uma experiência de excelência em meio à natureza, ao lado de quem se ama, em escalas diferentes), cada frente com seu próprio herói e problema, e efeito cascata: o parque traz o público que descobre os eventos e a hospedagem, e um alimenta o outro. Não são marcas separadas, e sim sub-roteiros aninhados no roteiro do Parque Casa Campo.",
            ],
          },
          {
            heading: "01 · O herói",
            paragraphs: [
              "Quem é: os noivos e convidados dos eventos que querem dormir por perto, os visitantes que querem esticar o passeio e quem procura um refúgio tranquilo na natureza para descansar. Renda média e alta.",
              "O que ele quer: prolongar o bom momento e dormir dentro do parque, com conforto, privacidade e bem-estar.",
            ],
          },
          {
            heading: "02 · O problema",
            paragraphs: [
              "Vilão: a hora de ir embora. O momento bom que termina cedo demais.",
              "Externo: quem visita o parque ou vai a um evento costuma encerrar o dia e pegar a estrada, deixando a experiência pela metade. E uma hospedagem que reúna natureza, privacidade e conforto ali perto é rara.",
              "Interno: o desejo de descansar de verdade, sem pressa e sem o barulho de sempre, e de esticar o tempo com quem se ama.",
              "Filosófico: bem-estar e natureza não deveriam ter hora para acabar.",
            ],
          },
          {
            heading: "03 · O guia",
            paragraphs: [
              "Empatia: “sabemos que o melhor de um lugar assim é não precisar ir embora”.",
              "Autoridade: casas e cabanas planejadas para conforto, privacidade e bem-estar em meio à natureza, dentro do próprio parque. Atendem noivos, convidados e visitantes. Em expansão: 20 unidades em 2026, 50 até 2027 e 100 em 2028.",
            ],
          },
          {
            heading: "04 · O plano",
            paragraphs: [
              "Processo: reserve sua casa ou cabana, escolha a data e a unidade. Durma dentro do parque, com privacidade e natureza ao redor. Acorde sem pressa, com o parque à sua porta, no seu tempo.",
              "Acordo (promessas): privacidade e silêncio. Natureza ao redor. O parque à sua porta.",
            ],
          },
          {
            heading: "05 · A ação",
            paragraphs: [
              "Direta: reserve sua estadia.",
              "Transicional: veja as casas e cabanas, consulte datas, combine com sua visita ao parque.",
            ],
          },
          {
            heading: "06 · O que se evita",
            paragraphs: [
              "Ir embora com gostinho de quero mais. Encerrar o dia cedo demais. Trocar o sossego por mais uma viagem de volta.",
            ],
          },
          {
            heading: "07 · O sucesso",
            paragraphs: [
              "Você fica. Dorme cercado de natureza, acorda sem pressa e vive o parque com calma, prolongando o bom momento com quem ama.",
              "Transformação de identidade: de quem precisa encerrar o passeio e voltar, para quem faz do lugar um refúgio e fica o tempo que quiser.",
            ],
          },
        ],
        closing: "O melhor de um lugar assim é não precisar ir embora. Na Casa Campo, casas e cabanas dentro do parque deixam você dormir cercado de natureza, com privacidade e bem-estar, e acordar com o parque à sua porta.",
      },
    ],
  },
  pages: {},
};

/* ------------------------------------------------------------------ *
 * Registro de clientes — resolvido por slug (user.clientSlug).
 * Fase 2: substituir por consulta ao Supabase.
 * ------------------------------------------------------------------ */
export const CLIENTS: Record<string, ClientBrand> = {
  [DEMO_CLIENT.slug]: DEMO_CLIENT,
  [CRUZ_DE_MALTA.slug]: CRUZ_DE_MALTA,
  [JUJOO.slug]: JUJOO,
  [CASA_CAMPO.slug]: CASA_CAMPO,
};

/** Resolve o Brand System de um cliente pelo slug. */
export function getClient(slug: string | undefined): ClientBrand | undefined {
  if (!slug) return undefined;
  return CLIENTS[slug];
}
