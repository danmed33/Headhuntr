// Nome da empresa: o nome que uma pessoa usaria (sem LTDA, S/A…) e as chaves que podem
// identificar a mesma empresa quando o site de vagas "enfeita" o nome.
import { companyKey } from "./relatorio";

const LEGAL_SUFFIX = /\b(ltda|s\/?a|s\.a\.?|me|epp|eireli|ss|cia|limitada|sociedade anonima)\b\.?/gi;

/** The company name a person would use: no legal suffix, no parentheses, normal case. */
export function contactSearchName(company: string): string {
  const base = (company ?? "").replace(/\([^)]*\)/g, " ").replace(LEGAL_SUFFIX, " ").replace(/\s+-\s*[A-Za-z]{2}\s*$/, "").replace(/[\s,.-]+$/g, "").replace(/\s+/g, " ").trim();
  if (base !== base.toUpperCase()) return base;
  return base.toLowerCase().replace(/(^|\s)(\p{L})/gu, (_m, sp: string, ch: string) => sp + ch.toUpperCase()).replace(/\s(E|De|Da|Do|Das|Dos)\s/g, (m) => m.toLowerCase());
}

const GENERIC_NAME_WORDS = new Set([
  "carreiras", "carreira", "vagas", "trabalhe", "conosco", "selecao", "talentos", "oportunidades", "lojas", "loja", "restaurante", "restaurantes",
  "supermercados", "supermercado", "atacadista", "atacado", "varejo", "comercial", "servicos", "solucoes", "tecnologia", "industria", "empresa",
  "empresas", "holding", "participacoes", "partners", "consultoria", "logistica", "transportes", "foods", "alimentos", "farmacia", "farmacias",
  "hospital", "clinica", "escola", "colegio", "instituto", "associacao", "fundacao", "brasileira", "nacional", "internacional", "global", "digital",
  "gente", "pessoas", "time", "equipe", "aprendiz", "aprendizes", "estagio", "estagiarios", "jovem",
  "oficial", "ativo", "corporativo", "abertas", "aberta", "faca", "parte", "venha", "trabalhar", "programa", "desde", "banco",
]);

/** Words that only pad a name on job sites (not a line of business): "Carreiras Decathlon", "Vagas Fruki". */
const JOB_SITE_PADDING = new Set([
  "carreiras", "carreira", "vagas", "vaga", "trabalhe", "conosco", "selecao", "talentos", "oportunidades", "oficial", "ativo",
  "corporativo", "abertas", "aberta", "faca", "parte", "venha", "trabalhar", "programa", "desde", "banco", "time", "equipe",
  "gente", "pessoas", "jovem", "aprendiz", "aprendizes", "estagio", "estagiarios", "lojas", "loja", "tecnologia",
]);

const KEY_EDGE_STOP = new Set(["de", "da", "do", "das", "dos", "e", "o", "a", "os", "as", "com", "na", "no", "em", "para", "por", "the", "of", "and", "vem", "ja"]);

/**
 * Contact-bank keys that may name this company, best first: the full key, then every run of 2+
 * consecutive words (longest first, left to right), then the first word when it has 5+ letters.
 * Job sites often pad the name ("Assaí Atacadista - O atacadista com 50 anos… #VemserAssaí",
 * "McDonald's Restaurante - Arcos Dorados", "🚀 A seleção… na Track&Field!"): the bank still holds
 * the plain name ("assai atacadista", "mcdonald s", "arcos dorados", "track field").
 * Runs that start or end on a connector word ("banco do") are skipped so they cannot join two
 * different companies.
 */
export function contactKeyCandidates(company: string, maxWords = 14): string[] {
  const full = companyKey(company);
  const words = full.split(" ").filter(Boolean).slice(0, maxWords);
  const out: string[] = full ? [full] : [];
  for (let n = words.length - 1; n >= 2; n--) {
    for (let i = 0; i + n <= words.length; i++) {
      const run = words.slice(i, i + n);
      if (KEY_EDGE_STOP.has(run[0]!) || KEY_EDGE_STOP.has(run[run.length - 1]!)) continue;
      // After "de" a name is usually a place ("Colégio Visconde de Porto Seguro"), not the company.
      if (i > 0 && words[i - 1] === "de") continue;
      out.push(run.join(" "));
    }
  }
  // A lone first or last word ("Decathlon" in "Carreiras Decathlon") only when every other word is
  // padding (job-site words, connectors, numbers): "DATA STONE", "PORTO SECO SUL DE MINAS" or
  // "MASTER AGROINDUSTRIAL" name other companies and must not match "stone", "porto" or "master".
  // Sector words ("supermercados", "colegio") are not padding: "SUPERMERCADOS IPIRANGA" is not Ipiranga.
  const padding = (w: string) => KEY_EDGE_STOP.has(w) || JOB_SITE_PADDING.has(w) || /^\d+$/.test(w);
  if (words.length > 1) {
    for (const [w, rest] of [[words[0]!, words.slice(1)], [words[words.length - 1]!, words.slice(0, -1)]] as const) {
      if (w.length >= 5 && !padding(w) && !GENERIC_NAME_WORDS.has(w) && rest.every(padding)) out.push(w);
    }
  }
  return [...new Set(out)];
}
