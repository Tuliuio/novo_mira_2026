import { useEffect, useRef } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { Home } from "@/pages/Home";
import { Login } from "@/pages/Login";
import { NotFound } from "@/pages/NotFound";
import { LinkBio } from "@/pages/LinkBio";
import { Metodo } from "@/pages/Metodo";
import { Oka } from "@/pages/Oka";
import { Costao } from "@/pages/Costao";
import { TriadeDomini } from "@/pages/TriadeDomini";
import { PROFILES } from "@/lib/bio";
import { BrandHub } from "@/pages/brandos/BrandHub";
import type { ReactNode } from "react";

function Protected({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

/**
 * GTM (GTM-WF676HZ, snippet no index.html): o SPA não recarrega a página, então
 * cada troca de rota vira um evento `virtual_page_view` no dataLayer. A 1ª
 * carga já é coberta pelo próprio gtm.js, por isso é pulada aqui.
 */
function useGtmPageViews() {
  const { pathname, search } = useLocation();
  const path = pathname + search;
  const last = useRef(path);
  useEffect(() => {
    if (last.current === path) return;
    last.current = path;
    (window.dataLayer = window.dataLayer || []).push({
      event: "virtual_page_view",
      page_path: path,
      page_title: document.title,
    });
  }, [path]);
}

export function App() {
  useGtmPageViews();
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/renata" element={<LinkBio profile={PROFILES.renata} />} />
      <Route path="/tom" element={<LinkBio profile={PROFILES.tom} />} />
      <Route path="/metodo" element={<Metodo />} />
      <Route path="/oka" element={<Oka />} />
      <Route path="/propostas/costao" element={<Costao />} />
      <Route path="/diagnosticos/triade-domini" element={<TriadeDomini />} />
      <Route path="/propostas/triade-domini" element={<Navigate to="/diagnosticos/triade-domini" replace />} />
      {/* Atalho: /costao redireciona para a URL canônica da proposta */}
      <Route path="/costao" element={<Navigate to="/propostas/costao" replace />} />

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
