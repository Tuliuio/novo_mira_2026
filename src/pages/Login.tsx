import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { Logo } from "@/components/Logo";

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await login(email, password);
      navigate("/app");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao entrar.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-900 px-6">
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(100% 60% at 50% 0%, rgba(227,178,60,0.13), transparent 55%)",
        }}
      />
      <div className="relative w-full max-w-sm">
        <Link to="/" className="mb-8 flex justify-center">
          <Logo height={28} />
        </Link>

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8">
          <h1 className="text-xl font-semibold" style={{ fontFamily: "var(--font-display)" }}>
            Acessar seu Brand OS
          </h1>
          <p className="mt-1 text-sm text-fog">
            Entre para consultar todos os elementos da sua marca.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <Field
              label="E-mail"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="voce@empresa.com"
              autoComplete="email"
            />
            <Field
              label="Senha"
              type="password"
              value={password}
              onChange={setPassword}
              placeholder="••••••••"
              autoComplete="current-password"
            />

            {error && (
              <p className="rounded-lg border border-red-400/30 bg-red-400/10 px-3 py-2 text-sm text-red-300">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-xl bg-accent-500 py-3 text-sm font-semibold text-ink-900 transition-transform hover:scale-[1.02] disabled:opacity-60"
            >
              {busy ? "Entrando…" : "Entrar"}
            </button>
          </form>

        </div>

        <Link
          to="/"
          className="mt-6 block text-center text-sm text-fog transition-colors hover:text-cream"
        >
          ← Voltar ao site
        </Link>
      </div>
    </div>
  );
}

interface FieldProps {
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  autoComplete?: string;
}

function Field({ label, type, value, onChange, placeholder, autoComplete }: FieldProps) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-cream">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required
        className="w-full rounded-xl border border-white/10 bg-ink-800 px-4 py-2.5 text-sm text-cream outline-none transition-colors placeholder:text-fog/50 focus:border-accent-500/60"
      />
    </label>
  );
}
