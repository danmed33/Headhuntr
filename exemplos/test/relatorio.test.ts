import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { capPicks, chooseReport } from "../src/relatorio";

const JOBS: Record<string, { company: string; source: string }> = {
  a: { company: "Itaú", source: "fonte-a" },
  b: { company: "Itaú", source: "fonte-a" },
  c: { company: "X", source: "fonte-a" },
  d: { company: "Y", source: "fonte-a" },
  e: { company: "Z", source: "fonte-b" },
  f: { company: "W", source: "fonte-b" },
  g: { company: "V", source: "fonte-b" },
  h: { company: "U", source: "fonte-c" },
  i: { company: "T", source: "fonte-d" },
  k: { company: "S", source: "fonte-e" },
  l: { company: "R", source: "fonte-f" },
};
const jobOf = (id: string) => JOBS[id];

describe("regras do relatório", () => {
  it("1 vaga por empresa e 2 por fonte quando há 7 vagas boas", () => {
    assert.deepEqual(capPicks(Object.keys(JOBS), jobOf).ids, ["a", "c", "e", "f", "h", "i", "k"]);
  });
  it("passa de 2 por fonte só para chegar a 7", () => {
    assert.deepEqual(capPicks(["a", "c", "d"], jobOf).ids, ["a", "c", "d"]);
  });
  it("aceita uma 2ª vaga da mesma empresa só para chegar a 3", () => {
    assert.deepEqual(capPicks(["a", "b"], jobOf).ids, ["a", "b"]);
    assert.deepEqual(capPicks(["a", "b", "c", "e"], jobOf).ids, ["a", "c", "e"]);
  });
  it("troca por uma vaga com contato sem quebrar as regras", () => {
    const r = chooseReport(Object.keys(JOBS), (id) => id === "k" || id === "l", jobOf);
    assert.deepEqual(r.withContact, ["k", "l"]);
    assert.equal(r.withContact.length + r.withoutContact.length, 7);
  });
});
