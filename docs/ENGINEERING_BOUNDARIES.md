# Engineering Boundaries

This document separates executable Aletheia behavior from conceptual research.

## 1. Supported runtime

Only code required to run the corpus application belongs on the supported runtime path.

Supported runtime responsibilities:

- corpus ingestion;
- section/chapter navigation;
- exact text selection;
- immutable source handling;
- terminology parsing;
- graph/hypergraph projection;
- independently scoped interpretation lenses;
- user-defined substitution mappings;
- model proposal interfaces;
- Wolfram computation interfaces;
- export and provenance.

Runtime code must use literal, testable naming.

Do not encode philosophical metaphors, theological claims, speculative identities, or narrative symbolism as executable truth.

## 2. Formal protocol specifications

Protocol documents may describe:

- source objects;
- anchors;
- channels;
- gates;
- Multiview Glass;
- terminology reconciliation;
- graph/hypergraph contracts;
- model proposal contracts;
- future external adapters.

Protocol text must distinguish implemented behavior from proposed behavior.

## 3. Capsules

`docs/capsules/` is the membrane for non-executable research material.

Capsules may contain:

- metaphorical prose;
- theological explorations;
- speculative analogies;
- research hypotheses;
- discarded architectures;
- experimental mathematics;
- narrative sketches;
- philosophical notes.

Capsule content is data for later review. It is not production code and must not be imported into runtime behavior by default.

## 4. Mutation discipline

A new runtime mutation must not replace the stable application merely because it is novel.

Before a mutation reaches `main`:

1. preserve the current stable state;
2. isolate the mutation on a branch;
3. identify the exact capability it changes;
4. verify that unrelated fabrics remain unchanged;
5. add tests;
6. compare the result against the stable book/corpus workflow;
7. review the diff;
8. merge only after explicit approval.

## 5. Source integrity

The following invariants are mandatory:

```
source_text = immutable
derived_output != source_text
graph_similarity != semantic_identity
analogy != translation
model_proposal != accepted_fact
```

## 6. External bridges

DiazAI, GrandState, Ultracode, MCP assets, and minting remain outside the supported runtime until their real schemas and state transitions are confirmed.

No placeholder adapter may present itself as production-ready.
