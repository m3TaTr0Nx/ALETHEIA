import crypto from "node:crypto";

export const CARRIER_CELL_COUNT = 729;
export const TRIT_WIDTH = 6;
export const DEFAULT_CODEC_ID = "diazai.codec.f3_6_to_z9_3.a_plus_3b.v1";
export const DEFAULT_CANON_REF = "external:diazai-canon";

function sha256(value) {
  return crypto.createHash("sha256").update(String(value), "utf8").digest("hex");
}

export function normalizeLexeme(value) {
  return String(value).normalize("NFC").trim().toLocaleLowerCase("und");
}

export function decodeIndex729(index729) {
  if (!Number.isInteger(index729) || index729 < 0 || index729 >= CARRIER_CELL_COUNT) {
    throw new RangeError("index729 must be an integer in [0, 728].");
  }

  const digits = Array(TRIT_WIDTH).fill(0);
  let value = index729;
  for (let i = TRIT_WIDTH - 1; i >= 0; i -= 1) {
    digits[i] = value % 3;
    value = Math.floor(value / 3);
  }
  return digits;
}

export function encodeF3Address(address) {
  if (!Array.isArray(address) || address.length !== TRIT_WIDTH) {
    throw new TypeError("F3 address must contain exactly six trits.");
  }

  let value = 0;
  for (const trit of address) {
    if (!Number.isInteger(trit) || trit < 0 || trit > 2) {
      throw new RangeError("Each F3 coordinate must be 0, 1, or 2.");
    }
    value = value * 3 + trit;
  }
  return value;
}

export function f3AddressToZ9Chart(address) {
  if (!Array.isArray(address) || address.length !== TRIT_WIDTH) {
    throw new TypeError("F3 address must contain exactly six trits.");
  }
  const [ai, aj, ak, bi, bj, bk] = address;
  return [
    (ai + 3 * bi) % 9,
    (aj + 3 * bj) % 9,
    (ak + 3 * bk) % 9
  ];
}

export function z9ChartToF3Address(chart) {
  if (!Array.isArray(chart) || chart.length !== 3) {
    throw new TypeError("Z9 chart must contain exactly three coordinates.");
  }

  const normalized = chart.map(value => {
    if (!Number.isInteger(value)) throw new TypeError("Z9 coordinates must be integers.");
    return ((value % 9) + 9) % 9;
  });

  return [
    normalized[0] % 3,
    normalized[1] % 3,
    normalized[2] % 3,
    Math.floor(normalized[0] / 3),
    Math.floor(normalized[1] / 3),
    Math.floor(normalized[2] / 3)
  ];
}

export function buildOpaqueCarrierCell({
  corpusId,
  corpusHash,
  sheetOrdinal,
  index729,
  lexeme,
  canonRef = DEFAULT_CANON_REF
}) {
  const normalizedLexeme = normalizeLexeme(lexeme);
  if (!normalizedLexeme) throw new Error("Lexeme cannot be empty.");

  const f3 = decodeIndex729(index729);
  const z9 = f3AddressToZ9Chart(f3);
  const sheetId = `sheet:${sha256(`${corpusId}:${corpusHash ?? ""}:${sheetOrdinal}`).slice(0, 20)}`;
  const cellId = `cell:${sha256(`${sheetId}:${index729}`).slice(0, 24)}`;

  return {
    cellId,
    sheetId,
    sheetOrdinal,
    index729,
    lexeme: normalizedLexeme,
    lexemeId: `lex:${sha256(normalizedLexeme)}`,
    source: {
      corpusId,
      corpusHash: corpusHash ?? null
    },
    carrier: {
      addressSpace: "F3^6",
      address: f3,
      chartSpace: "Z9^3",
      chart: z9,
      codecId: DEFAULT_CODEC_ID,
      lawId: "address-only",
      semanticIdentity: false
    },
    canon: {
      mode: "read-only",
      ref: canonRef
    }
  };
}

export function buildLexicographicCarrierSheets(
  lexemes,
  { corpusId, corpusHash = null, canonRef = DEFAULT_CANON_REF } = {}
) {
  if (!corpusId) throw new Error("corpusId is required.");
  if (!Array.isArray(lexemes)) throw new TypeError("lexemes must be an array.");

  const unique = [...new Set(lexemes.map(normalizeLexeme).filter(Boolean))]
    .sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));

  const sheets = [];
  for (let offset = 0, sheetOrdinal = 0; offset < unique.length; offset += CARRIER_CELL_COUNT, sheetOrdinal += 1) {
    const slice = unique.slice(offset, offset + CARRIER_CELL_COUNT);
    const cells = slice.map((lexeme, index729) =>
      buildOpaqueCarrierCell({
        corpusId,
        corpusHash,
        sheetOrdinal,
        index729,
        lexeme,
        canonRef
      })
    );

    sheets.push({
      sheetId: cells[0]?.sheetId ?? `sheet:${sha256(`${corpusId}:${corpusHash ?? ""}:${sheetOrdinal}`).slice(0, 20)}`,
      sheetOrdinal,
      corpusId,
      corpusHash,
      canonRef,
      capacity: CARRIER_CELL_COUNT,
      cellCount: cells.length,
      lexicographicStart: slice[0] ?? null,
      lexicographicEnd: slice.at(-1) ?? null,
      cells
    });
  }

  return {
    schema: "aletheia.diazai.opaque-carrier-sheet.v1",
    corpusId,
    corpusHash,
    canonMode: "read-only",
    canonRef,
    codecId: DEFAULT_CODEC_ID,
    partitionRule: "unique-normalized-lexemes/codepoint-sort/pages-of-729",
    sheetCount: sheets.length,
    lexemeCount: unique.length,
    sheets
  };
}

export function validateCarrierCell(cell) {
  const encoded = encodeF3Address(cell.carrier.address);
  const reconstructedAddress = z9ChartToF3Address(cell.carrier.chart);
  const reconstructedIndex = encodeF3Address(reconstructedAddress);

  return {
    valid:
      encoded === cell.index729 &&
      reconstructedIndex === cell.index729 &&
      JSON.stringify(reconstructedAddress) === JSON.stringify(cell.carrier.address),
    encodedIndex: encoded,
    reconstructedIndex
  };
}

export function validateCarrierSheetBundle(bundle) {
  const errors = [];
  const lexemeIds = new Set();
  const cellIds = new Set();

  for (const sheet of bundle.sheets ?? []) {
    const localIndices = new Set();

    for (const cell of sheet.cells ?? []) {
      const check = validateCarrierCell(cell);
      if (!check.valid) errors.push({ type: "roundtrip", cellId: cell.cellId });

      if (localIndices.has(cell.index729)) {
        errors.push({ type: "duplicate-local-index", sheetId: sheet.sheetId, index729: cell.index729 });
      }
      localIndices.add(cell.index729);

      if (cellIds.has(cell.cellId)) errors.push({ type: "duplicate-cell-id", cellId: cell.cellId });
      cellIds.add(cell.cellId);

      if (lexemeIds.has(cell.lexemeId)) errors.push({ type: "duplicate-lexeme-id", lexemeId: cell.lexemeId });
      lexemeIds.add(cell.lexemeId);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    sheets: bundle.sheets?.length ?? 0,
    cells: cellIds.size,
    lexemes: lexemeIds.size
  };
}

export function buildDiazAICanonQuery(cell, {
  lawId = null,
  operatorId = null,
  requested = ["status", "evidence", "conflicts", "admissibleTransforms"]
} = {}) {
  return {
    schema: "aletheia.diazai.canon-query.v1",
    mode: "read-only",
    writeAllowed: false,
    canonRef: cell.canon.ref,
    queryType: "carrier-adjudication",
    cell: {
      cellId: cell.cellId,
      lexemeId: cell.lexemeId,
      sheetId: cell.sheetId,
      index729: cell.index729
    },
    carrier: {
      addressSpace: cell.carrier.addressSpace,
      address: cell.carrier.address,
      chartSpace: cell.carrier.chartSpace,
      chart: cell.carrier.chart,
      codecId: cell.carrier.codecId,
      lawId
    },
    operatorId,
    requested
  };
}

export function adjudicateCarrierCompatibility(left, right, {
  leftLawId = null,
  rightLawId = null,
  canonStatus = "UNQUERIED"
} = {}) {
  if (leftLawId && rightLawId && leftLawId !== rightLawId) {
    return {
      status: "TYPED_LAW_CONFLICT",
      mergeAllowed: false,
      semanticIdentity: false,
      canonStatus,
      reason: "Carrier laws differ. Preserve separate typed variants."
    };
  }

  if (left.lexemeId === right.lexemeId) {
    return {
      status: left.sheetId === right.sheetId ? "SAME_LEXEME_LOCAL" : "SAME_LEXEME_CROSS_SHEET",
      mergeAllowed: false,
      semanticIdentity: false,
      canonStatus,
      reason: "Lexical identity does not authorize ontological or semantic merge."
    };
  }

  if (left.index729 === right.index729 && left.sheetId !== right.sheetId) {
    return {
      status: "SCOPED_ADDRESS_REUSE",
      mergeAllowed: false,
      semanticIdentity: false,
      canonStatus,
      reason: "The local 0..728 address is sheet-scoped; reuse across sheets is not a collision."
    };
  }

  return {
    status: "ADDRESS_COMPATIBLE_UNRESOLVED",
    mergeAllowed: false,
    semanticIdentity: false,
    canonStatus,
    reason: "Address compatibility alone does not establish semantic equivalence."
  };
}
