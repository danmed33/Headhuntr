import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { levelsForSeniority, splitSeniority, toggleSeniority } from "../src/nivel";

describe("nível do perfil (até 2 opções vizinhas)", () => {
  it("adiciona um nível vizinho, na ordem da lista", () => {
    assert.equal(toggleSeniority("Sênior", "Pleno"), "Pleno, Sênior");
  });
  it("recomeça quando o nível não é vizinho ou já há 2", () => {
    assert.equal(toggleSeniority("Júnior", "Sênior"), "Sênior");
    assert.equal(toggleSeniority("Pleno, Sênior", "Júnior"), "Júnior");
  });
  it("desmarca um nível escolhido", () => {
    assert.equal(toggleSeniority("Pleno, Sênior", "Pleno"), "Sênior");
  });
  it("lê o que está salvo", () => {
    assert.deepEqual(splitSeniority("Pleno, Sênior"), ["Pleno", "Sênior"]);
  });
  it("busca os níveis das duas escolhas", () => {
    assert.deepEqual(levelsForSeniority("Sênior, Liderança/Gestão"), ["pleno", "senior", "coordenacao", "gerencia", "diretoria"]);
    assert.deepEqual(levelsForSeniority("Pleno"), ["pleno", "senior"]);
  });
});
