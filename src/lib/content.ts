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
  accent: "#B21E28", // vermelho âncora (provisório — em documentação)
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
 * Registro de clientes — resolvido por slug (user.clientSlug).
 * Fase 2: substituir por consulta ao Supabase.
 * ------------------------------------------------------------------ */
export const CLIENTS: Record<string, ClientBrand> = {
  [DEMO_CLIENT.slug]: DEMO_CLIENT,
  [CRUZ_DE_MALTA.slug]: CRUZ_DE_MALTA,
};

/** Resolve o Brand System de um cliente pelo slug. */
export function getClient(slug: string | undefined): ClientBrand | undefined {
  if (!slug) return undefined;
  return CLIENTS[slug];
}
