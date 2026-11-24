// Regras do relatório diário: no máximo 1 vaga por empresa e 2 por fonte.
// As regras só afrouxam quando faltam vagas boas: mais da mesma fonte só para chegar a 7,
// e uma segunda vaga da mesma empresa só para chegar a 3.
import { norm } from "./texto";

export const WITH_CONTACT = 3;
export const TOTAL_JOBS = 7;
export const REPORT_PER_COMPANY = 1;
export const REPORT_PER_SOURCE = 2;
export const MIN_REPORT_JOBS = 3;

export function companyKey(company: string): string {
  return norm((company ?? "").replace(/\([^)]*\)/g, " ")).replace(/\b(ltda|s a|sa|me|eireli|inc|llc|ltd|brasil|brazil|group|grupo)\b/g, " ").replace(/\s+/g, " ").trim();
}

type CapJob = { company: string; source: string };

/** The report's jobs in rank order under the caps: first 1 per company and 2 per source; when
 *  that gives fewer than 7, more of the same source (still 1 per company); when still fewer than 3,
 *  a second job of the same company. `strict` counts the jobs of the first pass. */
export function capPicks(ranked: string[], jobOf: (id: string) => CapJob | undefined, max = TOTAL_JOBS, fixed: string[] = []): { ids: string[]; strict: number } {
  const out: string[] = [];
  const perCo = new Map<string, number>();
  const perSrc = new Map<string, number>();
  // `fixed` jobs are already in the report: they count toward the caps and are not returned.
  for (const id of fixed) {
    const j = jobOf(id);
    if (!j) continue;
    const co = companyKey(j.company) || `#${id}`;
    perCo.set(co, (perCo.get(co) ?? 0) + 1);
    perSrc.set(j.source, (perSrc.get(j.source) ?? 0) + 1);
  }
  max -= fixed.length;
  const pass = (coCap: number, srcCap: number, until: number) => {
    for (const id of ranked) {
      if (out.length >= until) break;
      if (out.includes(id) || fixed.includes(id)) continue;
      const j = jobOf(id);
      if (!j) continue;
      const co = companyKey(j.company) || `#${id}`;
      if ((perCo.get(co) ?? 0) >= coCap || (perSrc.get(j.source) ?? 0) >= srcCap) continue;
      perCo.set(co, (perCo.get(co) ?? 0) + 1);
      perSrc.set(j.source, (perSrc.get(j.source) ?? 0) + 1);
      out.push(id);
    }
  };
  pass(REPORT_PER_COMPANY, REPORT_PER_SOURCE, max);
  const strict = out.length;
  if (out.length < max) pass(REPORT_PER_COMPANY, Infinity, max);
  if (out.length + fixed.length < MIN_REPORT_JOBS) pass(Infinity, Infinity, Math.min(max, MIN_REPORT_JOBS - fixed.length));
  const order = new Map(ranked.map((id, i) => [id, i]));
  out.sort((a, b) => (order.get(a) ?? 0) - (order.get(b) ?? 0));
  return { ids: out, strict };
}

/** The 7 jobs of the report, best-ranked first. Jobs with a contact (from the bank or a search)
 *  keep it, whatever their rank. When fewer than 3 of the top 7 have a contact, lower-ranked
 *  approved jobs that do have one replace the lowest-ranked jobs without contact. */
export function chooseReport(picks: string[], hasContact: (id: string) => boolean, jobOf?: (id: string) => CapJob | undefined): { withContact: string[]; withoutContact: string[] } {
  const capped = jobOf ? capPicks(picks, jobOf) : { ids: picks.slice(0, TOTAL_JOBS), strict: TOTAL_JOBS };
  const top = capped.ids;
  // A swap must keep the caps the selection reached (source cap only if the first pass filled 7;
  // company cap unless the report needed a second job of a company to reach 3).
  const srcCapped = capped.strict >= TOTAL_JOBS;
  const coCapped = top.length >= MIN_REPORT_JOBS && (!jobOf || new Set(top.map((id) => companyKey(jobOf(id)?.company ?? "") || id)).size === top.length);
  const fits = (extra: string, drop: number) => {
    if (!jobOf) return true;
    const e = jobOf(extra);
    if (!e) return false;
    const others = top.filter((_, i) => i !== drop).map((id) => jobOf(id)).filter((x): x is CapJob => Boolean(x));
    if (coCapped && others.some((o) => companyKey(o.company) && companyKey(o.company) === companyKey(e.company))) return false;
    if (srcCapped && others.filter((o) => o.source === e.source).length >= REPORT_PER_SOURCE) return false;
    return true;
  };
  let need = WITH_CONTACT - top.filter(hasContact).length;
  for (const extra of picks.filter((id) => !top.includes(id) && hasContact(id))) {
    if (need <= 0) break;
    let drop = -1;
    for (let i = top.length - 1; i >= 0; i--) { const t = top[i]; if (t && !hasContact(t) && fits(extra, i)) { drop = i; break; } }
    if (drop < 0) continue;
    top.splice(drop, 1);
    top.push(extra);
    need -= 1;
  }
  const ordered = picks.filter((id) => top.includes(id));
  return { withContact: ordered.filter(hasContact), withoutContact: ordered.filter((id) => !hasContact(id)) };
}
