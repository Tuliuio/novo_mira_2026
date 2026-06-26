import { Link } from "react-router-dom";
import { Logo } from "@/components/Logo";

export function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-ink-900 px-6 text-center">
      <Logo height={30} />
      <p className="text-6xl font-bold text-accent-500/30" style={{ fontFamily: "var(--font-display)" }}>
        404
      </p>
      <p className="text-fog">Não encontramos esta página.</p>
      <Link
        to="/"
        className="rounded-full border border-white/15 px-5 py-2.5 text-sm transition-colors hover:bg-white/5"
      >
        ← Voltar ao início
      </Link>
    </div>
  );
}
