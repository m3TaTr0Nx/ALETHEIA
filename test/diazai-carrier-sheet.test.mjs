import test from "node:test";
import assert from "node:assert/strict";
import {
  CARRIER_CELL_COUNT,
  decodeIndex729,
  encodeF3Address,
  f3AddressToZ9Chart,
  z9ChartToF3Address,
  buildLexicographicCarrierSheets,
  validateCarrierSheetBundle,
  adjudicateCarrierCompatibility,
  buildDiazAICanonQuery
} from "../lib/diazai-carrier-sheet.mjs";

test("all 729 addresses round-trip through F3^6 and Z9^3", () => {
  const seen = new Set();

  for (let index = 0; index < CARRIER_CELL_COUNT; index += 1) {
    const address = decodeIndex729(index);
    const chart = f3AddressToZ9Chart(address);
    const reconstructed = z9ChartToF3Address(chart);

    assert.equal(encodeF3Address(address), index);
    assert.equal(encodeF3Address(reconstructed), index);
    seen.add(chart.join(","));
  }

  assert.equal(seen.size, 729);
});

test("730 lexemes partition into 729 + 1 without local address collision", () => {
  const lexemes = Array.from({ length: 730 }, (_, i) => `term-${String(i).padStart(4, "0")}`);
  const bundle = buildLexicographicCarrierSheets(lexemes, {
    corpusId: "test-corpus",
    corpusHash: "abc123",
    canonRef: "test:diazai"
  });

  assert.equal(bundle.sheetCount, 2);
  assert.equal(bundle.sheets[0].cellCount, 729);
  assert.equal(bundle.sheets[1].cellCount, 1);
  assert.equal(bundle.sheets[0].cells[0].index729, 0);
  assert.equal(bundle.sheets[1].cells[0].index729, 0);

  const validation = validateCarrierSheetBundle(bundle);
  assert.equal(validation.valid, true);
  assert.equal(validation.cells, 730);
});

test("same local address on different sheets is scoped reuse, not merge", () => {
  const lexemes = Array.from({ length: 730 }, (_, i) => `term-${String(i).padStart(4, "0")}`);
  const bundle = buildLexicographicCarrierSheets(lexemes, { corpusId: "test-corpus" });

  const result = adjudicateCarrierCompatibility(
    bundle.sheets[0].cells[0],
    bundle.sheets[1].cells[0]
  );

  assert.equal(result.status, "SCOPED_ADDRESS_REUSE");
  assert.equal(result.mergeAllowed, false);
});

test("typed law mismatch is preserved as a conflict", () => {
  const bundle = buildLexicographicCarrierSheets(["alpha", "beta"], { corpusId: "test-corpus" });
  const result = adjudicateCarrierCompatibility(
    bundle.sheets[0].cells[0],
    bundle.sheets[0].cells[1],
    { leftLawId: "Z9_RING", rightLawId: "GF9_FIELD" }
  );

  assert.equal(result.status, "TYPED_LAW_CONFLICT");
  assert.equal(result.mergeAllowed, false);
});

test("canon query is read-only", () => {
  const bundle = buildLexicographicCarrierSheets(["alpha"], {
    corpusId: "test-corpus",
    canonRef: "local:diazai-snapshot"
  });

  const query = buildDiazAICanonQuery(bundle.sheets[0].cells[0], {
    lawId: "Z9_RING"
  });

  assert.equal(query.mode, "read-only");
  assert.equal(query.writeAllowed, false);
  assert.equal(query.carrier.addressSpace, "F3^6");
  assert.equal(query.carrier.chartSpace, "Z9^3");
});
