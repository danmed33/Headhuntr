// Animações de entrada da home do HEADHUNTR, sem biblioteca.
// Os elementos marcados com [data-reveal] entram quando aparecem na tela; um bloco [data-build]
// "se monta" peça por peça ([data-step]). Os elementos só ficam escondidos depois que o script
// roda (classe .hh-reveal-ready), então a página nunca fica em branco se o JavaScript falhar.
// Quem prefere menos movimento (prefers-reduced-motion) vê tudo parado: ver animacoes.css.

export interface RevealOptions {
  /** Fração do elemento visível para disparar a entrada. */
  threshold?: number;
  /** Quanto da altura da tela conta como "já visível" quando a página abre. */
  initialViewport?: number;
}

/** Liga as entradas da página. Devolve uma função que desfaz tudo. */
export function setupReveal(doc: Document = document, opts: RevealOptions = {}): () => void {
  const win = doc.defaultView;
  if (!win || !("IntersectionObserver" in win)) return () => {};
  const els = Array.from(doc.querySelectorAll<HTMLElement>("[data-reveal], [data-build]"));
  if (!els.length) return () => {};
  const root = doc.documentElement;
  const io = new win.IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        e.target.classList.add("is-in");
        io.unobserve(e.target);
      }
    },
    { threshold: opts.threshold ?? 0.12, rootMargin: "0px 0px -8% 0px" },
  );
  // O que já está na tela ao abrir a página entra na hora, sem piscar.
  const limit = win.innerHeight * (opts.initialViewport ?? 0.92);
  for (const el of els) if (el.getBoundingClientRect().top < limit) el.classList.add("is-in");
  root.classList.add("hh-reveal-ready");
  for (const el of els) if (!el.classList.contains("is-in")) io.observe(el);
  return () => {
    io.disconnect();
    root.classList.remove("hh-reveal-ready");
  };
}

/** Atraso de cada peça (lido pelo CSS como var(--d)), para entradas em sequência. */
export const delay = (ms: number): Record<string, string> => ({ "--d": `${ms}ms` });
