# ALETHEIA

Aletheia is a corpus-preserving research application for reading complete texts, selecting books/chapters/sections, highlighting source spans, and producing separate interpretive fabrics without modifying the source.

## Current reference implementation

The root application is the supported build.

It provides:

- local full-text corpus import;
- corpus and section selection;
- highlight-to-Aletheia analysis;
- exact source preservation;
- terminology sweep;
- local graph and hypergraph projection;
- customizable analogy/substitution mappings;
- philosophical, lexicographic, logical, theological, metaphysical, scientific, engineering, AI/information, biological, political, semiotic, and epistemic lenses;
- conservative, balanced, and speculative gates;
- a local deterministic constructive-proposer fallback;
- optional external model endpoint;
- optional Wolfram computation endpoint;
- provenance-preserving JSON export;
- mobile and desktop responsive use.

## Mobile and static access

Aletheia ships as an installable static PWA and as a single-file standalone HTML build. Replit is not required.

See [Mobile Access and Static Deployment](docs/MOBILE_ACCESS.md) for the GitHub Pages one-time setup, Android install steps, offline behavior, and standalone fallback.

Run locally with Node 20+:

```bash
npm start
```

Then open `http://localhost:3000`.

## Repository boundaries

Executable code and formal protocol specifications are kept separate.

- `index.html`, `server.mjs`, `package.json`, `test/` — supported executable application.
- `schemas/` — formal data contracts only.
- `docs/` — engineering and protocol specifications.
- `docs/capsules/` — non-executable philosophical, metaphorical, speculative, and research capsules.
- experimental runtime mutations are not merged into `main` until they pass review against the supported corpus application.

See `docs/ENGINEERING_BOUNDARIES.md`.

## Core invariants

```
SOURCE != INTERPRETATION
VISIBILITY != WRITE AUTHORITY
WRITE AUTHORITY != MERGE AUTHORITY
MERGE AUTHORITY != SOURCE MUTATION
```

Source text and source graphs are immutable. Model output, analogies, substitutions, reconstructions, graph completions, narratives, and computational results remain derived objects with separate lineage.

## DiazAI status

Aletheia is intentionally sandboxed from DiazAI, GrandState, Ultracode, and any minting or publishing layer.

No production DiazAI adapter is implemented on `main` until the actual DiazAI object/state contract is confirmed. See `docs/DIAZAI_BRIDGE_CONTRACT.md`.

## Corpus policy

Aletheia is designed to ingest user-supplied, licensed, or public-domain corpora. The repository does not redistribute third-party copyrighted libraries.

## Release discipline

Changes to the supported application should preserve:

1. source immutability;
2. book/chapter/highlight workflow;
3. independent interpretive layers;
4. explicit provenance;
5. reversible exports;
6. mobile usability;
7. no speculative ontology embedded as runtime truth.

The default branch is the stable working line. Experimental branches are treated as quarantined research until reviewed.
