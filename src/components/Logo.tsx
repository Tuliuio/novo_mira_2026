interface LogoProps {
  /** altura do wordmark em px (largura é automática, proporção ~2.42:1) */
  height?: number;
  /** "light" = branco (fundo escuro) · "dark" = tinta (fundo claro) */
  tone?: "light" | "dark";
  className?: string;
}

const SRC: Record<"light" | "dark", string> = {
  light: "/mira-wordmark-light.png",
  dark: "/mira-wordmark-dark.png",
};

/** Wordmark oficial da Mira (logo 2023). */
export function Logo({ height = 24, tone = "light", className }: LogoProps) {
  return (
    <img
      src={SRC[tone]}
      alt="Mira"
      style={{ height, width: "auto" }}
      className={className}
      draggable={false}
    />
  );
}
