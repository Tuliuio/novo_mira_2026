/**
 * Link de bio — dados de cada perfil (ex.: /renata).
 *
 * Estrutura inspirada em páginas "link in bio" de conversão (funil com quiz
 * qualificador + captura de lead + vitrine de serviços + WhatsApps
 * segmentados), adaptada à identidade da Mira. Data-driven: para criar um
 * novo link basta adicionar outro BioProfile em PROFILES.
 *
 * Sem backend: a captura de lead do quiz é entregue via WhatsApp com mensagem
 * pré-preenchida (a Renata recebe o lead qualificado direto no chat).
 */

export type IconKey =
  | "whatsapp"
  | "globe"
  | "instagram"
  | "layers"
  | "rocket"
  | "mail";

export interface BioSocial {
  label: string;
  href: string;
  icon: IconKey;
}

export interface BioLink {
  label: string;
  sublabel?: string;
  href: string;
  icon: IconKey;
  primary?: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  type: "choice" | "text";
  options?: string[];
}

export interface BioService {
  name: string;
  tag: string;
  description: string;
  /** imagem de fundo do card (case da Mira, em /public/cases) */
  image?: string;
}

export interface BioWhatsApp {
  category: string;
  number: string; // só dígitos, formato wa.me
  message: string;
}

export interface BioProfile {
  slug: string;
  name: string;
  role: string;
  bio: string;
  initials: string;
  avatar?: string;
  /** número WhatsApp (só dígitos) usado nos CTAs principais */
  whatsapp: string;
  socials: BioSocial[];
  quiz: {
    trigger: { title: string; subtitle: string };
    welcome: string;
    questions: QuizQuestion[];
    result: { title: string; text: string };
  };
  services: { title: string; items: BioService[] };
  links: BioLink[];
  whatsappCards: BioWhatsApp[];
  stat?: { value: string; label: string };
  instagram?: { handle: string; href: string };
  booking?: {
    title: string;
    durationMin: number;
    guestEmail?: string;
    timezone?: string;
    /** horários oferecidos (24h) */
    slots: string[];
    /** URL do "Horário de atendimento" do Google (se a Renata configurar) */
    scheduleUrl?: string;
  };
}

const WA = "5548984291699";

const renata: BioProfile = {
    slug: "renata",
    name: "Renata",
    role: "Mira Brand Studio",
    bio: "Responda 5 perguntas e descubra o melhor caminho para construir a sua marca comigo ↓",
    initials: "R",
    avatar: "/renata.jpg", // foto em /public/renata.jpg (fallback para "R" se ausente)
    whatsapp: WA,
    socials: [
      { label: "Instagram", href: "https://instagram.com/somos.mira", icon: "instagram" },
      { label: "WhatsApp", href: `https://wa.me/${WA}`, icon: "whatsapp" },
      { label: "Site", href: "https://somosmira.com.br", icon: "globe" },
    ],
    quiz: {
      trigger: {
        title: "Como a Mira pode construir a sua marca?",
        subtitle: "Vamos entender o momento da sua marca e indicar o caminho ideal.",
      },
      welcome: "São 5 perguntas rápidas. No final, te mostro o melhor caminho para a sua marca.",
      questions: [
        {
          id: "momento",
          question: "Qual é o momento da sua marca hoje?",
          type: "choice",
          options: [
            "Estou começando agora / tenho uma ideia",
            "Já tenho marca, mas ela não comunica quem eu sou",
            "Vou bem, mas quero profissionalizar e escalar",
          ],
        },
        {
          id: "desafio",
          question: "Qual é o seu maior desafio?",
          type: "choice",
          options: [
            "Não me diferencio da concorrência",
            "Falta clareza de propósito e posicionamento",
            "Identidade visual desatualizada ou inconsistente",
            "Falta uma narrativa que conecte com meu público",
          ],
        },
        {
          id: "tem",
          question: "O que você já tem hoje?",
          type: "choice",
          options: [
            "Nada ainda — começarei do zero",
            "Tenho logo, mas falta estratégia",
            "Tenho estratégia, mas falta a parte visual",
          ],
        },
        {
          id: "porte",
          question: "Qual o porte do seu negócio?",
          type: "choice",
          options: ["Pessoal / autônomo", "Pequena empresa", "Média / grande empresa", "Indústria"],
        },
        {
          id: "objetivo",
          question: "O que você quer que a sua marca conquiste?",
          type: "text",
        },
      ],
      result: {
        title: "Encontramos o caminho da sua marca",
        text: "Com base nas suas respostas, a Renata vai te indicar a melhor frente do Método Mira. É só enviar para continuar a conversa no WhatsApp.",
      },
    },
    services: {
      title: "Como a Mira pode te ajudar",
      items: [
        {
          name: "Diagnóstico de Marca",
          tag: "Ponto de partida",
          description:
            "Uma leitura estratégica de onde a sua marca está e do que ela precisa para crescer com clareza.",
          image: "/cases/case-03.png",
        },
        {
          name: "Branding Completo",
          tag: "Método Mira",
          description:
            "Da essência à expressão: público, propósito, posicionamento, narrativa, naming, identidade visual e aplicações.",
          image: "/cases/case-11.png",
        },
        {
          name: "Plataforma de Marca",
          tag: "Plataforma digital",
          description:
            "Toda a sua marca organizada numa plataforma digital e exclusiva que a sua equipe realmente usa.",
          image: "/cases/case-20.png",
        },
        {
          name: "Naming",
          tag: "Nome & verbal",
          description: "Criação ou ajuste de nome, com checagem de viabilidade e território verbal.",
          image: "/cases/case-27.png",
        },
        {
          name: "Site / Landing page",
          tag: "Presença digital",
          description: "A expressão da marca no digital, pronta para converter.",
          image: "/cases/case-34.png",
        },
      ],
    },
    links: [
      {
        label: "Site da Mira",
        sublabel: "somosmira.com.br",
        href: "https://somosmira.com.br",
        icon: "globe",
      },
      {
        label: "Ver cases",
        sublabel: "Marcas que a Mira já construiu",
        href: "https://somosmira.com.br/#cases",
        icon: "layers",
      },
      {
        label: "Área do cliente — Plataforma de Marca",
        sublabel: "Acesse a sua marca",
        href: "/login",
        icon: "rocket",
      },
    ],
    whatsappCards: [
      {
        category: "Novo projeto",
        number: WA,
        message: "Oi, Renata! Quero construir/evoluir a minha marca com a Mira.",
      },
      {
        category: "Já sou cliente",
        number: WA,
        message: "Oi! Sou cliente da Mira e preciso de um suporte.",
      },
    ],
    instagram: { handle: "@somos.mira", href: "https://instagram.com/somos.mira" },
    booking: {
      title: "Conversa com a Mira · 30 min",
      durationMin: 30,
      guestEmail: "contato@somosmira.com.br",
      timezone: "America/Sao_Paulo",
      slots: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"],
      // scheduleUrl: "https://calendar.app.google/..." // ← link do Google Agenda
    },
};

// Tom — herda tudo da Renata; sobrescreve identidade e mensagens.
const tom: BioProfile = {
  ...renata,
  slug: "tom",
  name: "Tom",
  initials: "T",
  avatar: "/tom.jpg", // foto em /public/tom.jpg (fallback para "T" se ausente)
  quiz: {
    ...renata.quiz,
    result: {
      ...renata.quiz.result,
      text: "Com base nas suas respostas, o Tom vai te indicar a melhor frente do Método Mira. É só enviar para continuar a conversa no WhatsApp.",
    },
  },
  whatsappCards: [
    {
      category: "Novo projeto",
      number: WA,
      message: "Oi, Tom! Quero construir/evoluir a minha marca com a Mira.",
    },
    {
      category: "Já sou cliente",
      number: WA,
      message: "Oi! Sou cliente da Mira e preciso de um suporte.",
    },
  ],
};

export const PROFILES: Record<string, BioProfile> = { renata, tom };

/** Monta um link wa.me com mensagem pré-preenchida. */
export function waLink(number: string, message: string): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

/**
 * Link do Google Agenda (template) para criar um evento pré-preenchido.
 * `date` = "YYYY-MM-DD", `time` = "HH:mm". Sem backend: abre o Google Agenda
 * do usuário já com o evento de N minutos e a Renata como convidada.
 */
export function googleCalendarLink(opts: {
  date: string;
  time: string;
  durationMin: number;
  title: string;
  details?: string;
  guestEmail?: string;
  timezone?: string;
}): string {
  const [y, m, d] = opts.date.split("-").map(Number);
  const [hh, mm] = opts.time.split(":").map(Number);
  const start = new Date(y, m - 1, d, hh, mm);
  const end = new Date(start.getTime() + opts.durationMin * 60000);
  const fmt = (dt: Date) =>
    dt.getFullYear().toString() +
    String(dt.getMonth() + 1).padStart(2, "0") +
    String(dt.getDate()).padStart(2, "0") +
    "T" +
    String(dt.getHours()).padStart(2, "0") +
    String(dt.getMinutes()).padStart(2, "0") +
    "00";
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: opts.title,
    dates: `${fmt(start)}/${fmt(end)}`,
  });
  if (opts.details) params.set("details", opts.details);
  if (opts.guestEmail) params.set("add", opts.guestEmail);
  if (opts.timezone) params.set("ctz", opts.timezone);
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
