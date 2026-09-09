import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { Home } from "@/pages/Home";
import { Login } from "@/pages/Login";
import { NotFound } from "@/pages/NotFound";
import { LinkBio } from "@/pages/LinkBio";
import { Metodo } from "@/pages/Metodo";
import { Oka } from "@/pages/Oka";
import { PROFILES } from "@/lib/bio";
import { BrandHub } from "@/pages/brandos/BrandHub";
import type { ReactNode } from "react";

function Protected({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/renata" element={<LinkBio profile={PROFILES.renata} />} />
      <Route path="/tom" element={<LinkBio profile={PROFILES.tom} />} />
      <Route path="/metodo" element={<Metodo />} />
      <Route path="/oka" element={<Oka />} />

      <Route
        path="/app"
        element={
          <Protected>
            <BrandHub />
          </Protected>
        }
      />
      {/* Rotas antigas do Brand OS (doc) redirecionam para o hub */}
      <Route path="/app/*" element={<Navigate to="/app" replace />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
