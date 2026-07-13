import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { Home } from "@/pages/Home";
import { Login } from "@/pages/Login";
import { NotFound } from "@/pages/NotFound";
import { LinkBio } from "@/pages/LinkBio";
import { Metodo } from "@/pages/Metodo";
import { Oka } from "@/pages/Oka";
import { PROFILES } from "@/lib/bio";
import { BrandOSLayout } from "@/pages/brandos/BrandOSLayout";
import { BrandItemPage } from "@/pages/brandos/BrandItemPage";
import { BrandOverview } from "@/pages/brandos/BrandOverview";
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
            <BrandOSLayout />
          </Protected>
        }
      >
        <Route index element={<BrandOverview />} />
        <Route path=":pillar/:item" element={<BrandItemPage />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
