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
  /** usuário público = nome do cliente (o Brand System não é sigiloso) */
  username: string;
  /** slug do cliente cujo Brand System este usuário acessa */
  clientSlug: string;
}

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const STORAGE_KEY = "mira.session";

/**
 * Credenciais dos clientes (substituir por Supabase).
 * Padrão simples e compartilhável: usuário = nome do cliente,
 * senha = nome do cliente + ano. A comparação é tolerante
 * (ignora maiúsculas/minúsculas e espaços repetidos).
 */
const DEMO_USERS: Array<{ username: string; password: string; user: User }> = [
  {
    username: "Adapto",
    password: "Adapto2026",
    user: { name: "Adapto", username: "Adapto", clientSlug: "adapto" },
  },
  {
    username: "CruzdeMalta",
    password: "CruzdeMalta2026",
    user: { name: "Cruz de Malta", username: "CruzdeMalta", clientSlug: "cruz-de-malta" },
  },
  {
    username: "Jujoo",
    password: "Jujoo2026",
    user: { name: "Jujoo", username: "Jujoo", clientSlug: "jujoo" },
  },
];

/** normaliza para comparar: ignora caixa e QUALQUER espaço
 * (então "CruzdeMalta" e "Cruz de Malta" batem igual) */
const norm = (s: string) => s.toLowerCase().replace(/\s+/g, "");

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

  async function login(username: string, password: string) {
    // simula latência de rede
    await new Promise((r) => setTimeout(r, 450));
    const match = DEMO_USERS.find(
      (u) => norm(u.username) === norm(username) && norm(u.password) === norm(password),
    );
    if (!match) {
      throw new Error("Usuário ou senha inválidos.");
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
