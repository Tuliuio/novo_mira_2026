/**
 * Utilidades de cor para o Brand Hub — conversão e contraste calculados
 * a partir do hex (nunca digitados à mão) e cópia para a área de transferência.
 */

export interface Rgb { r: number; g: number; b: number; }
export interface Cmyk { c: number; m: number; y: number; k: number; }

export function hexToRgb(hex: string): Rgb {
  let h = hex.replace("#", "").trim();
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

export function rgbToCmyk({ r, g, b }: Rgb): Cmyk {
  const rr = r / 255, gg = g / 255, bb = b / 255;
  const k = 1 - Math.max(rr, gg, bb);
  if (k === 1) return { c: 0, m: 0, y: 0, k: 100 };
  return {
    c: Math.round(((1 - rr - k) / (1 - k)) * 100),
    m: Math.round(((1 - gg - k) / (1 - k)) * 100),
    y: Math.round(((1 - bb - k) / (1 - k)) * 100),
    k: Math.round(k * 100),
  };
}

function luminance({ r, g, b }: Rgb): number {
  const a = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
}

/** Razão de contraste WCAG entre dois hexes. */
export function contrastRatio(hex1: string, hex2: string): number {
  const l1 = luminance(hexToRgb(hex1));
  const l2 = luminance(hexToRgb(hex2));
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

export interface ContrastBadge { level: "aaa" | "aa" | "fail"; label: string; }
export function contrastBadge(ratio: number): ContrastBadge {
  if (ratio >= 7) return { level: "aaa", label: `AAA · ${ratio.toFixed(1)}:1` };
  if (ratio >= 4.5) return { level: "aa", label: `AA · ${ratio.toFixed(1)}:1` };
  return { level: "fail", label: `Uso restrito · ${ratio.toFixed(1)}:1` };
}

/** Copia texto com fallback para contextos restritos (execCommand). */
export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* cai no fallback */
  }
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    ta.remove();
    return ok;
  } catch {
    return false;
  }
}
