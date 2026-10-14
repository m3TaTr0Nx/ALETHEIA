# Aletheia Research Apparatus — Production Architecture

Status: production-candidate feature branch.

## Governing invariant

Aletheia records how an interpretation became representable.

Source text, deterministic transforms, stochastic inference, and interpretive claims remain separately typed.

## End-to-end action flow

1. Ingest immutable corpus and metadata.
2. Address book/chapter/section/proposition/source-span objects.
3. Route selected anchors through X-Way Glass channels.
4. Run terminology sweep and optional tokenizer macros.
5. Construct source graph and hypergraph.
6. Partition normalized lexemes into opaque carrier sheets.
7. Query the DiazAI canon read-only for carrier/law/transform status.
8. Generate Wolfram verification jobs for exact finite or graph checks.
9. Construct independent deterministic and interpretive fabrics.
10. Score structural compatibility at passage, proposition, and edge scales.
11. Measure category/subcategory subset tightness.
12. Report recursive self-similarity as a fractal candidate profile, not a proof of fractal dimension.
13. Derive structured philosophy claims with explicit inference rules.
14. Present all results through X-Way Glass for user/model/agent review.
15. Export receipts, provenance, mutation vectors, conflicts, and unresolved alternatives.

## X-Way Glass / DiazAI harmonic routing

The six core Aletheia channels are assigned DiazAI-compatible harmonic lanes m=1..6.

- lane 1: source and anchors
- lane 2: terminology and lexical analysis
- lane 3: graph/hypergraph construction
- lane 4: DiazAI/Wolfram mathematical adjudication
- lane 5: philosophy/analogy
- lane 6: human review and synthesis

For lanes m and n:

- LCM(m,n) is the synchronization period (WHEN).
- GCD(m,n) is the compatibility stratum (WHICH).

The Aletheia discrete gauge integral is a project-defined accumulation of accepted channel activity over a 60-tick cycle. It is not presented as a DiazAI canon theorem.

## Multiscale scoring

Pairwise graph score combines:

- node-role coverage;
- relation-class coverage;
- role-preserving edge signatures;
- degree-sequence similarity;
- proposition best-match similarity;
- node-count and edge-count similarity.

Each receipt also exposes independent passage, proposition, and edge scores.

A score above 0.75 is structural evidence only. It does not prove shared origin, borrowing, ontology, or semantic identity.

## Subset tightness

For a selected node subset, Aletheia reports:

- internal/boundary edge cohesion;
- category purity;
- hierarchy ultrametric closeness;
- carrier compactness;
- semantic-structural tightness;
- optional exploratory combined score.

Carrier compactness is kept separate because cell address proximity does not imply semantic proximity.

## Recursive self-similarity

Aletheia compares proposition graphlets and edge graphlets across scales.

The resulting `fractalCandidate` flag means repeated normalized graph shape exists across multiple scales. It is not a Hausdorff/fractal-dimension claim.

## Full DiazAI source mount

When the deduplicated DiazAI source tree is supplied, mount it read-only and index it by hash.

The runtime adapter must never write into the mounted canon tree. Derived Aletheia receipts reference DiazAI claim IDs and artifact hashes.

Recommended production mount:

- `/canon/diazai` — read-only
- `/data/aletheia` — Aletheia writable data
- `/data/receipts` — append-only research receipts

## Deployment

The classic Aletheia application remains the root interface.

The Research Apparatus is served at `/apparatus`.

The Node server remains dependency-light; production deployment should place it behind TLS and an authenticated reverse proxy, with corpus storage, read-only DiazAI mount, and an optional isolated Wolfram service adapter.
