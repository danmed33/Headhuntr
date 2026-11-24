import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { contactKeyCandidates, contactSearchName } from "../src/empresa";

describe("nome da empresa", () => {
  it("tira sufixo jurídico e corrige o caixa alta", () => {
    assert.equal(contactSearchName("REPRODUZINDO TALENTOS MARKETING LTDA"), "Reproduzindo Talentos Marketing");
    assert.equal(contactSearchName("GAIA SILVA GAEDE ADVOGADOS -RJ"), "Gaia Silva Gaede Advogados");
    assert.equal(contactSearchName("iFood"), "iFood");
  });
  it("acha a empresa por trás de um nome enfeitado", () => {
    assert.ok(contactKeyCandidates("Carreiras Decathlon").includes("decathlon"));
    assert.ok(contactKeyCandidates("McDonald's Restaurante - Arcos Dorados").includes("arcos dorados"));
  });
  it("não confunde empresas diferentes", () => {
    assert.ok(!contactKeyCandidates("DATA STONE").includes("stone"));
    assert.ok(!contactKeyCandidates("SUPERMERCADOS IPIRANGA").includes("ipiranga"));
    assert.ok(!contactKeyCandidates("Colégio Visconde de Porto Seguro").includes("porto seguro"));
  });
});
