import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const html = fs.readFileSync(new URL("../index.html", import.meta.url), "utf8");

test("classic Aletheia app exposes the supported corpus workflow", () => {
  for (const marker of [
    "Corpus",
    "Section",
    "Use highlight",
    "Analyze section",
    "Custom substitution fabric",
    "Terminology sweep",
    "Graph / hypergraph projection",
    "AI constructive proposer",
    "Wolfram substrate",
    "Export bundle"
  ]) {
    assert.ok(html.includes(marker), marker);
  }
});

test("unsupported KeyStream mutation is not in the supported root application", () => {
  for (const banned of [
    "Paint the thought over time",
    "One key at a time",
    "KEYSTREAM FABRIC",
    "genesis/event chain"
  ]) {
    assert.equal(html.includes(banned), false, banned);
  }
});

test("source preservation language remains explicit", () => {
  assert.ok(html.includes("source immutable"));
  assert.ok(html.includes("derived"));
});
