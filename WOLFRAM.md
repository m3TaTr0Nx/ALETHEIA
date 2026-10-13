# Wolfram substrate

Wolfram is embedded in Aletheia as an optional computation substrate, not as source authority.

The intended Wolfram backend can provide:

- canonical hypergraph representations;
- canonical hypergraph isomorphism maps;
- hypergraph isomorphism and subhypergraph embeddings;
- graph/hypergraph invariants;
- finite-field calculations over GF(p^n);
- multiway rewrite systems for terminology and ontology reconciliation;
- branchial/state graphs for competing reconciliation paths.

The standalone application always has a deterministic local fallback so Aletheia remains usable without a Wolfram credential or network call.

Every Wolfram result is a derived computational object with source graph IDs, input hyperedges, backend/version metadata when available, and a non-equivalence flag where the computation is being used for analogy matching.
