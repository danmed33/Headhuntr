// Nível do perfil: até 2 opções vizinhas ("Pleno, Sênior") e os níveis de vaga que cada escolha busca.
import { norm } from "./texto";

export const SENIORITIES = ["Estágio", "Júnior", "Pleno", "Sênior", "Especialista", "Liderança/Gestão", "Executivo (C-level)"];

const fold = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
const indexOf = (s: string) => SENIORITIES.findIndex((x) => fold(x) === fold(s));

/** The chosen options, in the list's order (unknown free text from older profiles is dropped). */
export function splitSeniority(value: string): string[] {
  const picked = value.split(",").map((p) => p.trim()).filter((p) => indexOf(p) >= 0);
  return [...new Set(picked.map((p) => SENIORITIES[indexOf(p)]!))].sort((a, b) => indexOf(a) - indexOf(b)).slice(0, 2);
}

/** Clicking an option: unselects it, adds it when it neighbours the single current choice, or starts over with it. */
export function toggleSeniority(value: string, option: string): string {
  const cur = splitSeniority(value);
  if (cur.some((c) => fold(c) === fold(option))) return cur.filter((c) => fold(c) !== fold(option)).join(", ");
  if (cur.length === 1 && Math.abs(indexOf(cur[0]!) - indexOf(option)) === 1) return splitSeniority(`${cur[0]}, ${option}`).join(", ");
  return option;
}

export const LEVELS = ["estagio", "junior", "pleno", "senior", "coordenacao", "gerencia", "diretoria"] as const;
export type Level = (typeof LEVELS)[number];

/** Default level selection for a profile's stated seniority. */
export function levelsForSeniority(seniority: string | undefined): Level[] {
  // Up to 2 neighbouring seniorities, saved as "Pleno, Sênior": the levels of both.
  const parts = (seniority ?? "").split(",").map((p) => p.trim()).filter(Boolean);
  if (parts.length > 1) {
    const all = new Set(parts.flatMap((p) => levelsForOne(p)));
    return LEVELS.filter((l) => all.has(l));
  }
  return levelsForOne(seniority ?? "");
}

function levelsForOne(seniority: string): Level[] {
  const s = norm(seniority);
  if (/lideranca|gestao|diretor|head/.test(s)) return ["senior", "coordenacao", "gerencia", "diretoria"];
  if (/coorden/.test(s)) return ["senior", "coordenacao", "gerencia"];
  if (/gerenc|gerente/.test(s)) return ["coordenacao", "gerencia", "diretoria"];
  if (/senior/.test(s)) return ["pleno", "senior", "coordenacao"];
  if (/pleno/.test(s)) return ["pleno", "senior"];
  if (/estag|estudante|aprendiz/.test(s)) return ["estagio", "junior"];
  if (/junior|trainee/.test(s)) return ["junior", "pleno"];
  return LEVELS.filter((l) => l !== "estagio");
}
