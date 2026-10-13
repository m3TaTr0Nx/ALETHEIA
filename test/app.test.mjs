import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

test("standalone app includes core Aletheia controls", () => {
  const html = fs.readFileSync(new URL("../index.html", import.meta.url), "utf8");
  for (const marker of ["Use highlight","Custom substitution fabric","Terminology sweep","Wolfram substrate","AI constructive proposer"]) {
    assert.ok(html.includes(marker), marker);
  }
});
