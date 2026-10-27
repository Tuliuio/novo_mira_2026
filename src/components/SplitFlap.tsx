import { useEffect, useState } from "react";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

/**
 * Palavra que se forma como num painel split-flap de aeroporto: cada letra
 * gira por caracteres aleatórios e trava na final, da esquerda para a direita.
 * A largura de cada letra é reservada pela letra final (invisível), então o
 * layout não pula durante a animação. Com prefers-reduced-motion, já nasce pronta.
 */
export function SplitFlap({
  word,
  delay = 450,
  stagger = 140,
  spin = 650,
  tick = 60,
}: {
  word: string;
  /** ms até a primeira letra começar a girar */
  delay?: number;
  /** ms entre o travamento de uma letra e a próxima */
  stagger?: number;
  /** ms que a primeira letra gira antes de travar */
  spin?: number;
  /** ms entre trocas de caractere */
  tick?: number;
}) {
  const letters = [...word];
  // c = caractere visível; n = nº de trocas (vira a key → reinicia o flip)
  const [cells, setCells] = useState(() => letters.map(() => ({ c: " ", n: 0, locked: false })));

  useEffect(() => {
    const reduced =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setCells(letters.map((c) => ({ c, n: 0, locked: true })));
      return;
    }

    const start = performance.now() + delay;
    const lockAt = letters.map((_, i) => start + spin + i * stagger);
    const id = window.setInterval(() => {
      const now = performance.now();
      if (now < start) return;
      let done = true;
      const next = letters.map((final, i) => {
        if (now >= lockAt[i]) return final;
        done = false;
        return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      });
      setCells((prev) =>
        prev.map((cell, i) => {
          const locked = now >= lockAt[i];
          return cell.c === next[i] && cell.locked === locked
            ? cell
            : { c: next[i], n: cell.c === next[i] ? cell.n : cell.n + 1, locked };
        }),
      );
      if (done) window.clearInterval(id);
    }, tick);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [word]);

  return (
    <span aria-hidden="true" className="inline-flex [perspective:600px]">
      {letters.map((final, i) => (
        <span
          key={i}
          className="relative inline-block text-center transition-[min-width] duration-300 ease-out"
          // girando: plaquinha de largura fixa (letras largas não invadem a vizinha);
          // travada: encolhe para a largura natural da letra final
          style={{ minWidth: cells[i].locked ? "0em" : "0.78em" }}
        >
          {/* reserva a largura da letra final */}
          <span className="invisible">{final}</span>
          <span
            key={cells[i].n}
            className="split-flap-char absolute inset-0 text-center"
          >
            {cells[i].c}
          </span>
        </span>
      ))}
    </span>
  );
}
