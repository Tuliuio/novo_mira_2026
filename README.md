# Mira — Site + Brand OS

Site institucional da **Mira** com landing page de cases e uma área interna de
cliente (**Brand OS**): a identidade de cada marca, organizada pela metodologia
**Método Mira** e apresentada como plataforma com menu lateral.

## Stack

- **Vite 6** + **React 19** + **TypeScript**
- **Tailwind CSS v4** (design tokens em `src/index.css`)
- **React Router 7**
- Auth/dados **mockados** localmente (`src/lib/auth.tsx`), prontos para migrar para Supabase.

## Rodando localmente

```bash
npm install
npm run dev
```

Acesse `http://localhost:5173`.

### Login demo

- **E-mail:** `cliente@adapto.com.br`
- **Senha:** `mira`

## Estrutura

```
src/
  lib/
    method.ts    # Método Mira (3 pilares) — gera a navegação do Brand OS
    content.ts   # Conteúdo da marca de um cliente (blocos tipados) + demo
    cases.ts     # Cases da landing
    auth.tsx     # Contexto de autenticação (mock → Supabase)
  pages/
    Home.tsx     # Landing (hero, cases, método, CTA)
    Login.tsx
    brandos/     # Área interna do cliente
      BrandOSLayout.tsx   # Sidebar + outlet
      BrandOverview.tsx   # Dashboard do cliente
      BrandItemPage.tsx   # Página de cada item da marca
      blocks.tsx          # Renderiza blocos de conteúdo
  components/
    Logo.tsx
```

## Deploy

Projeto pensado para build estático (`npm run build` → `dist/`) e deploy no
Hostinger via GitHub. Por ser SPA, configurar fallback de rotas para `index.html`.
