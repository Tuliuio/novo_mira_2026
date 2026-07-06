import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { waLink, googleCalendarLink, type BioProfile, type BioService } from "@/lib/bio";

/* --------------------------------------------------------- Ícones flat */
const PATHS: Record<string, string[]> = {
  whatsapp: [
    "M3 21l1.65 -3.8a9 9 0 1 1 3.4 2.9l-5.05 .9",
    "M9 10a.5 .5 0 0 0 1 0v-1a.5 .5 0 0 0 -1 0v1a5 5 0 0 0 5 5h1a.5 .5 0 0 0 0 -1h-1a.5 .5 0 0 0 0 1",
  ],
  globe: [
    "M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0",
    "M3.6 9h16.8M3.6 15h16.8",
    "M11.5 3a17 17 0 0 0 0 18M12.5 3a17 17 0 0 1 0 18",
  ],
  instagram: [
    "M4 4m0 4a4 4 0 0 1 4 -4h8a4 4 0 0 1 4 4v8a4 4 0 0 1 -4 4h-8a4 4 0 0 1 -4 -4z",
    "M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0",
    "M16.5 7.5l0 .01",
  ],
  layers: ["M12 3l8 4.5l-8 4.5l-8 -4.5z", "M4 12l8 4.5l8 -4.5", "M4 16.5l8 4.5l8 -4.5"],
  rocket: [
    "M4 13a8 8 0 0 1 7 7a6 6 0 0 0 3 -5a9 9 0 0 0 6 -8a3 3 0 0 0 -3 -3a9 9 0 0 0 -8 6a6 6 0 0 0 -5 3",
    "M7 14a6 6 0 0 0 -3 6a6 6 0 0 0 6 -3",
    "M15 9m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0",
  ],
  mail: ["M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z", "M3 7l9 6l9 -6"],
  bolt: ["M13 3l0 7l6 0l-8 11l0 -7l-6 0l8 -11z"],
  send: [
    "M10 14l11 -11",
    "M21 3l-6.5 18a.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a.55 .55 0 0 1 0 -1l18 -6.5",
  ],
  x: ["M18 6l-12 12", "M6 6l12 12"],
  check: ["M5 12l5 5l10 -10"],
  arrowRight: ["M5 12l14 0", "M13 18l6 -6l-6 -6"],
  chevron: ["M9 6l6 6l-6 6"],
  calendar: [
    "M4 5m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z",
    "M16 3v4M8 3v4M4 11h16",
  ],
};

function Icon({ name, size = 20 }: { name: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {(PATHS[name] ?? []).map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}

/* =================================================================== *
 * Página
 * =================================================================== */
export function LinkBio({ profile }: { profile: BioProfile }) {
  const [quizOpen, setQuizOpen] = useState(false);
  const [service, setService] = useState<BioService | null>(null);

  return (
    <div className="relative min-h-screen overflow-hidden bg-ink-900 text-cream">
      <div className="starfield pointer-events-none absolute inset-0 opacity-40" />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-80 opacity-70"
        style={{
          background:
            "radial-gradient(100% 70% at 50% -10%, rgba(227,178,60,0.16), transparent 60%)",
        }}
      />

      <main className="relative mx-auto w-full max-w-[420px] px-5 py-12">
        {/* 1 — Header / perfil */}
        <header className="flex flex-col items-center text-center">
          <Avatar profile={profile} />
          <h1 className="mt-4 text-2xl font-bold tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
            {profile.name}
          </h1>
          <p className="mt-0.5 text-sm font-medium text-accent-400">{profile.role}</p>
          <p className="mt-3 text-sm leading-relaxed text-fog">{profile.bio}</p>
        </header>

        {/* 2 — Redes sociais */}
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {profile.socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              className="grid size-11 place-items-center rounded-full border border-white/10 bg-white/5 text-cream transition-colors hover:border-accent-500/40 hover:text-accent-300"
            >
              <Icon name={s.icon} size={18} />
            </a>
          ))}
        </div>

        {/* 3 — CTA Quiz (o diferencial) */}
        <button
          onClick={() => setQuizOpen(true)}
          className="bio-pulse mt-6 flex w-full items-center gap-4 rounded-2xl border border-accent-500/40 bg-gradient-to-br from-accent-500/15 to-accent-500/5 p-4 text-left transition-colors hover:from-accent-500/20"
        >
          <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-accent-500 text-ink-900">
            <Icon name="bolt" size={20} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-semibold">{profile.quiz.trigger.title}</span>
            <span className="mt-0.5 block text-xs text-fog">{profile.quiz.trigger.subtitle}</span>
          </span>
          <span className="text-accent-400">
            <Icon name="arrowRight" size={20} />
          </span>
        </button>

        {/* 4 — Vitrine de serviços (carrossel) */}
        <div className="mt-8">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-accent-400">
            <Icon name="bolt" size={14} />
            {profile.services.title}
          </p>
          <div className="-mx-5 mt-3 flex snap-x gap-3 overflow-x-auto px-5 pb-2 [scrollbar-width:none]">
            {profile.services.items.map((item) => (
              <button
                key={item.name}
                onClick={() => setService(item)}
                className="w-44 shrink-0 snap-start overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] text-left transition-colors hover:border-accent-500/40"
              >
                <div className="relative flex h-24 items-end overflow-hidden bg-gradient-to-br from-brand-600 to-ink-800 p-3">
                  {item.image && (
                    <img
                      src={item.image}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover"
                      loading="lazy"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-900/85 via-ink-900/30 to-ink-900/10" />
                  <span className="relative rounded-full bg-ink-900/60 px-2 py-0.5 text-[10px] font-medium text-accent-300 backdrop-blur-sm">
                    {item.tag}
                  </span>
                </div>
                <div className="p-3">
                  <p className="text-sm font-semibold leading-snug">{item.name}</p>
                  <span className="mt-2 inline-block rounded-full bg-white/5 px-3 py-1 text-[11px] font-medium text-fog">
                    Ver detalhes
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 5 — Links */}
        <div className="mt-6 space-y-3">
          {profile.links.map((link) => (
            <LinkRow
              key={link.label}
              href={link.href}
              icon={link.icon}
              label={link.label}
              sublabel={link.sublabel}
            />
          ))}
        </div>

        {/* 6 — WhatsApp segmentado */}
        <div className="mt-4 space-y-3">
          {profile.whatsappCards.map((w) => (
            <a
              key={w.category}
              href={waLink(w.number, w.message)}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-2xl border border-accent-500/25 bg-accent-500/10 p-4 transition-colors hover:bg-accent-500/15"
            >
              <div className="flex items-center gap-3">
                <span className="grid size-9 place-items-center rounded-lg bg-accent-500/15 text-accent-300">
                  <Icon name="whatsapp" size={18} />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wide text-accent-300">
                    {w.category}
                  </p>
                  <p className="truncate text-xs text-fog">WhatsApp · resposta rápida</p>
                </div>
              </div>
              <span className="mt-3 flex items-center justify-center gap-2 rounded-full bg-accent-500 px-4 py-2 text-sm font-semibold text-ink-900">
                Iniciar conversa <Icon name="arrowRight" size={16} />
              </span>
            </a>
          ))}
        </div>

        {/* 7 — Agendamento (Google Agenda) */}
        {profile.booking && <BookingCalendar profile={profile} />}

        {/* 8 — Prova social */}
        {profile.stat && (
          <div className="mt-8 text-center">
            <p className="text-3xl font-bold text-accent-400" style={{ fontFamily: "var(--font-display)" }}>
              {profile.stat.value}
            </p>
            <p className="text-sm text-fog">{profile.stat.label}</p>
          </div>
        )}

        {/* 8 — Instagram */}
        {profile.instagram && (
          <a
            href={profile.instagram.href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition-colors hover:border-accent-500/40"
          >
            <span className="flex items-center gap-3">
              <Icon name="instagram" size={20} />
              <span>
                <span className="block text-sm font-semibold">Acompanhe no Instagram</span>
                <span className="block text-xs text-fog">{profile.instagram.handle}</span>
              </span>
            </span>
            <Icon name="chevron" size={18} />
          </a>
        )}

        {/* Footer */}
        <footer className="mt-12 flex flex-col items-center gap-2">
          <Link to="/" className="opacity-80 transition-opacity hover:opacity-100">
            <Logo height={22} />
          </Link>
          <p className="text-xs text-fog">Brand Studio · Florianópolis, Brasil</p>
        </footer>
      </main>

      {quizOpen && <QuizModal profile={profile} onClose={() => setQuizOpen(false)} />}
      {service && (
        <ServiceModal profile={profile} service={service} onClose={() => setService(null)} />
      )}
    </div>
  );
}

/* ----------------------------------------------------------- Avatar */
function Avatar({ profile }: { profile: BioProfile }) {
  const [failed, setFailed] = useState(false);
  if (profile.avatar && !failed) {
    return (
      <img
        src={profile.avatar}
        alt={profile.name}
        onError={() => setFailed(true)}
        className="size-24 rounded-full object-cover ring-2 ring-accent-500/40"
      />
    );
  }
  return (
    <div
      className="grid size-24 place-items-center rounded-full text-3xl font-bold text-ink-900 ring-2 ring-accent-500/40"
      style={{ background: "var(--color-accent-500)", fontFamily: "var(--font-display)" }}
    >
      {profile.initials}
    </div>
  );
}

/* ---------------------------------------------------------- LinkRow */
function LinkRow({
  href,
  icon,
  label,
  sublabel,
}: {
  href: string;
  icon: string;
  label: string;
  sublabel?: string;
}) {
  const internal = href.startsWith("/");
  const cls =
    "group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3.5 text-cream transition-all hover:border-accent-500/40 hover:bg-white/[0.06]";
  const inner = (
    <>
      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white/5 text-accent-400">
        <Icon name={icon} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold">{label}</span>
        {sublabel && <span className="block truncate text-xs text-fog">{sublabel}</span>}
      </span>
      <span className="shrink-0 text-fog transition-transform group-hover:translate-x-0.5">
        <Icon name="chevron" size={18} />
      </span>
    </>
  );
  return internal ? (
    <Link to={href} className={cls}>
      {inner}
    </Link>
  ) : (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
      {inner}
    </a>
  );
}

/* ---------------------------------------------------- Agendamento */
function nextWeekdays(count: number): { iso: string; wd: string; day: string; month: string }[] {
  const WD = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];
  const MO = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
  const out: { iso: string; wd: string; day: string; month: string }[] = [];
  const d = new Date();
  d.setDate(d.getDate() + 1);
  while (out.length < count) {
    const dow = d.getDay();
    if (dow !== 0 && dow !== 6) {
      const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
        d.getDate(),
      ).padStart(2, "0")}`;
      out.push({ iso, wd: WD[dow], day: String(d.getDate()), month: MO[d.getMonth()] });
    }
    d.setDate(d.getDate() + 1);
  }
  return out;
}

function BookingCalendar({ profile }: { profile: BioProfile }) {
  const b = profile.booking!;
  const [date, setDate] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const days = nextWeekdays(8);

  // Se a Renata tiver um "Horário de atendimento" do Google, usa o link real.
  if (b.scheduleUrl) {
    return (
      <a
        href={b.scheduleUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-8 flex items-center gap-4 rounded-2xl border border-accent-500/30 bg-accent-500/10 p-4 transition-colors hover:bg-accent-500/15"
      >
        <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-accent-500 text-ink-900">
          <Icon name="calendar" size={20} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold">Agende uma conversa de 30 min</span>
          <span className="block text-xs text-fog">Escolha um horário na agenda da Renata</span>
        </span>
        <Icon name="arrowRight" size={20} />
      </a>
    );
  }

  const link =
    date && time
      ? googleCalendarLink({
          date,
          time,
          durationMin: b.durationMin,
          title: b.title,
          details: "Conversa agendada pelo link da Renata (Mira Brand Studio).",
          guestEmail: b.guestEmail,
          timezone: b.timezone,
        })
      : null;

  return (
    <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <p className="flex items-center gap-2 text-sm font-semibold">
        <Icon name="calendar" size={18} />
        Agende uma conversa de 30 min
      </p>
      <p className="mt-1 text-xs text-fog">Escolha um dia e horário — abre no seu Google Agenda.</p>

      <div className="-mx-1 mt-4 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none]">
        {days.map((d) => (
          <button
            key={d.iso}
            onClick={() => {
              setDate(d.iso);
              setTime(null);
            }}
            className={`flex shrink-0 flex-col items-center rounded-xl border px-3 py-2 transition-colors ${
              date === d.iso
                ? "border-accent-500 bg-accent-500/15 text-cream"
                : "border-white/10 bg-white/[0.02] text-fog hover:border-accent-500/40"
            }`}
          >
            <span className="text-[10px] uppercase tracking-wide">{d.wd}</span>
            <span className="text-base font-semibold text-cream">{d.day}</span>
            <span className="text-[10px] text-fog">{d.month}</span>
          </button>
        ))}
      </div>

      {date && (
        <div className="mt-3 grid grid-cols-4 gap-2">
          {b.slots.map((s) => (
            <button
              key={s}
              onClick={() => setTime(s)}
              className={`rounded-lg border py-2 text-sm transition-colors ${
                time === s
                  ? "border-accent-500 bg-accent-500/15 text-cream"
                  : "border-white/10 bg-white/[0.02] text-fog hover:border-accent-500/40"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <a
        href={link ?? undefined}
        target="_blank"
        rel="noopener noreferrer"
        aria-disabled={!link}
        onClick={(e) => {
          if (!link) e.preventDefault();
        }}
        className={`mt-4 flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-transform ${
          link
            ? "bg-accent-500 text-ink-900 hover:scale-[1.02]"
            : "cursor-not-allowed bg-white/5 text-fog"
        }`}
      >
        <Icon name="calendar" size={18} />
        {link ? "Agendar no Google Agenda" : "Escolha dia e horário"}
      </a>
    </div>
  );
}

/* ------------------------------------------------------ Quiz modal */
type QuizStep = "welcome" | number | "lead" | "result";

function QuizModal({ profile, onClose }: { profile: BioProfile; onClose: () => void }) {
  const { questions } = profile.quiz;
  const [step, setStep] = useState<QuizStep>("welcome");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [text, setText] = useState("");
  const [lead, setLead] = useState({ name: "", whatsapp: "", instagram: "" });

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  function answer(qid: string, value: string, idx: number) {
    setAnswers((a) => ({ ...a, [qid]: value }));
    setText("");
    setStep(idx + 1 < questions.length ? idx + 1 : "lead");
  }

  function submitLead(e: FormEvent) {
    e.preventDefault();
    setStep("result");
  }

  function finish() {
    const lines = questions
      .map((q) => `• ${q.question}\n  → ${answers[q.id] || "-"}`)
      .join("\n");
    const msg =
      `Oi, Renata! Fiz o quiz no seu link de bio.\n\n` +
      `Nome: ${lead.name}\nWhatsApp: ${lead.whatsapp}\nInstagram: ${lead.instagram}\n\n` +
      `Minhas respostas:\n${lines}`;
    window.open(waLink(profile.whatsapp, msg), "_blank", "noopener,noreferrer");
    onClose();
  }

  const progress =
    typeof step === "number" ? (step + 1) / (questions.length + 1) : step === "lead" ? 0.95 : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center">
      <div className="flex h-[88vh] w-full max-w-[440px] flex-col overflow-hidden rounded-t-3xl border border-white/10 bg-ink-900 sm:h-[80vh] sm:rounded-3xl">
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
          <div
            className="grid size-9 place-items-center rounded-full text-sm font-bold text-ink-900"
            style={{ background: "var(--color-accent-500)" }}
          >
            {profile.initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold">{profile.name}</p>
            <p className="flex items-center gap-1.5 text-xs text-fog">
              <span className="size-1.5 rounded-full bg-emerald-400" /> Online
            </p>
          </div>
          <button onClick={onClose} aria-label="Fechar" className="text-fog hover:text-cream">
            <Icon name="x" size={20} />
          </button>
        </div>

        {/* Barra de progresso */}
        {step !== "welcome" && (
          <div className="h-1 bg-white/5">
            <div
              className="h-full bg-accent-500 transition-all"
              style={{ width: `${Math.round(progress * 100)}%` }}
            />
          </div>
        )}

        {/* Corpo */}
        <div className="flex-1 overflow-y-auto p-5">
          {step === "welcome" && (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div
                className="grid size-16 place-items-center rounded-full text-2xl font-bold text-ink-900"
                style={{ background: "var(--color-accent-500)", fontFamily: "var(--font-display)" }}
              >
                {profile.initials}
              </div>
              <p className="mt-4 text-lg font-semibold" style={{ fontFamily: "var(--font-display)" }}>
                Pronto para começarmos?
              </p>
              <p className="mt-2 max-w-xs text-sm text-fog">{profile.quiz.welcome}</p>
              <button
                onClick={() => setStep(0)}
                className="mt-6 rounded-full bg-accent-500 px-6 py-3 text-sm font-semibold text-ink-900 transition-transform hover:scale-[1.03]"
              >
                Iniciar
              </button>
            </div>
          )}

          {typeof step === "number" &&
            questions[step] &&
            (() => {
              const q = questions[step];
              return (
                <div>
                  <p className="text-xs font-medium text-accent-400">
                    Pergunta {step + 1} de {questions.length}
                  </p>
                  <h2 className="mt-2 text-xl font-semibold" style={{ fontFamily: "var(--font-display)" }}>
                    {q.question}
                  </h2>
                  {q.type === "choice" ? (
                    <div className="mt-5 space-y-2.5">
                      {q.options!.map((opt) => (
                        <button
                          key={opt}
                          onClick={() => answer(q.id, opt, step)}
                          className="flex w-full items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-left text-sm transition-colors hover:border-accent-500/50 hover:bg-accent-500/10"
                        >
                          <span className="size-2 shrink-0 rounded-full bg-accent-500/60" />
                          {opt}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (text.trim()) answer(q.id, text.trim(), step);
                      }}
                      className="mt-5 flex items-center gap-2"
                    >
                      <input
                        autoFocus
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Digite sua resposta…"
                        className="flex-1 rounded-xl border border-white/10 bg-ink-800 px-4 py-3 text-sm text-cream outline-none placeholder:text-fog/50 focus:border-accent-500/60"
                      />
                      <button
                        type="submit"
                        aria-label="Enviar"
                        className="grid size-11 shrink-0 place-items-center rounded-xl bg-accent-500 text-ink-900"
                      >
                        <Icon name="send" size={18} />
                      </button>
                    </form>
                  )}
                </div>
              );
            })()}

          {step === "lead" && (
            <form onSubmit={submitLead} className="flex h-full flex-col">
              <h2 className="text-xl font-semibold" style={{ fontFamily: "var(--font-display)" }}>
                Quase lá!
              </h2>
              <p className="mt-1 text-sm text-fog">
                Deixe seus dados para a Renata te enviar o melhor caminho da sua marca.
              </p>
              <div className="mt-5 space-y-3">
                <input
                  required
                  value={lead.name}
                  onChange={(e) => setLead({ ...lead, name: e.target.value })}
                  placeholder="Seu nome"
                  className="w-full rounded-xl border border-white/10 bg-ink-800 px-4 py-3 text-sm text-cream outline-none placeholder:text-fog/50 focus:border-accent-500/60"
                />
                <input
                  required
                  value={lead.whatsapp}
                  onChange={(e) => setLead({ ...lead, whatsapp: e.target.value })}
                  placeholder="Seu WhatsApp"
                  inputMode="tel"
                  className="w-full rounded-xl border border-white/10 bg-ink-800 px-4 py-3 text-sm text-cream outline-none placeholder:text-fog/50 focus:border-accent-500/60"
                />
                <input
                  value={lead.instagram}
                  onChange={(e) => setLead({ ...lead, instagram: e.target.value })}
                  placeholder="Seu @instagram (opcional)"
                  className="w-full rounded-xl border border-white/10 bg-ink-800 px-4 py-3 text-sm text-cream outline-none placeholder:text-fog/50 focus:border-accent-500/60"
                />
              </div>
              <button
                type="submit"
                className="mt-5 rounded-full bg-accent-500 px-6 py-3 text-sm font-semibold text-ink-900 transition-transform hover:scale-[1.02]"
              >
                Ver o resultado →
              </button>
            </form>
          )}

          {step === "result" && (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="grid size-16 place-items-center rounded-full bg-accent-500 text-ink-900">
                <Icon name="check" size={28} />
              </div>
              <h2 className="mt-4 text-xl font-semibold" style={{ fontFamily: "var(--font-display)" }}>
                {profile.quiz.result.title}
              </h2>
              <p className="mt-2 max-w-xs text-sm text-fog">{profile.quiz.result.text}</p>
              <button
                onClick={finish}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-emerald-400 px-6 py-3 text-sm font-semibold text-emerald-950 transition-transform hover:scale-[1.03]"
              >
                <Icon name="whatsapp" size={18} /> Enviar e falar com a Renata
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* --------------------------------------------------- Service modal */
function ServiceModal({
  profile,
  service,
  onClose,
}: {
  profile: BioProfile;
  service: BioService;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center"
      onClick={(e) => e.target === ref.current && onClose()}
      ref={ref}
    >
      <div className="w-full max-w-[440px] overflow-hidden rounded-t-3xl border border-white/10 bg-ink-900 sm:rounded-3xl">
        <div className="flex h-28 items-end justify-between bg-gradient-to-br from-brand-600 to-ink-800 p-4">
          <span className="rounded-full bg-ink-900/50 px-3 py-1 text-xs font-medium text-accent-300">
            {service.tag}
          </span>
          <button onClick={onClose} aria-label="Fechar" className="text-cream/80 hover:text-cream">
            <Icon name="x" size={20} />
          </button>
        </div>
        <div className="p-5">
          <h2 className="text-xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
            {service.name}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-fog">{service.description}</p>
          <a
            href={waLink(
              profile.whatsapp,
              `Oi, Renata! Tenho interesse em "${service.name}" da Mira. Pode me contar mais?`,
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 flex items-center justify-center gap-2 rounded-full bg-accent-500 px-6 py-3 text-sm font-semibold text-ink-900 transition-transform hover:scale-[1.02]"
          >
            <Icon name="whatsapp" size={18} /> Quero saber mais
          </a>
        </div>
      </div>
    </div>
  );
}
