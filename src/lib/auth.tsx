/**
 * Autenticação — MOCK local.
 *
 * Hoje resolve tudo no client com um usuário demo e persistência em
 * localStorage. A interface (login/logout/user) foi desenhada para ser
 * trocada por Supabase Auth sem alterar os componentes consumidores.
 */
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export interface User {
  name: string;
  email: string;
  /** slug do cliente cujo Brand OS este usuário acessa */
  clientSlug: string;
}

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const STORAGE_KEY = "mira.session";

/** Credenciais demo (substituir por Supabase). */
const DEMO_USERS: Array<{ email: string; password: string; user: User }> = [
  {
    email: "cliente@adapto.com.br",
    password: "mira",
    user: { name: "Equipe Adapto", email: "cliente@adapto.com.br", clientSlug: "adapto" },
  },
];

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw) as User);
    } catch {
      /* ignora sessão corrompida */
    }
    setLoading(false);
  }, []);

  async function login(email: string, password: string) {
    // simula latência de rede
    await new Promise((r) => setTimeout(r, 450));
    const match = DEMO_USERS.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password,
    );
    if (!match) {
      throw new Error("E-mail ou senha inválidos.");
    }
    setUser(match.user);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(match.user));
  }

  function logout() {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  }

  const value = useMemo<AuthContextValue>(
    () => ({ user, loading, login, logout }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth precisa estar dentro de <AuthProvider>.");
  return ctx;
}
