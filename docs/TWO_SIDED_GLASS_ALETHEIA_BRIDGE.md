# Two-Sided Glass × Aletheia Bridge Protocol

## Assessment

Two-Sided Glass is not merely a highlighting feature. It is an **anchored dialogue protocol**.

Aletheia already has:
- immutable source spans,
- model proposals,
- graph/hypergraph objects,
- analogy fabrics,
- provenance and confidence gates.

Two-Sided Glass adds:
- persistent human/model/agent attention objects,
- symmetric commentary on the same source region,
- overlap states,
- edit survival for derived documents,
- a natural UI for graph provenance and reconciliation.

The integration is therefore:

```
SourceObject
  -> SourceNode / SourceSpan
      -> AnchorObject[user|ai|agent]
          -> Annotation / Proposal / Question / Support / Issue / Edit
              -> GraphNode / Hyperedge / Connector
                  -> AnalogyFabric / Narrative / Storyboard
```

## Aletheia anchor object

```json
{
  "anchorId": "anchor:...",
  "documentId": "source-or-derived-document-id",
  "sourceId": "optional immutable source object id",
  "sourceHash": "optional source hash",
  "nodeId": "stable block id",
  "start": 0,
  "end": 12,
  "quote": "exact selected text",
  "quoteHash": "fingerprint",
  "contextBeforeHash": "optional",
  "contextAfterHash": "optional",
  "owner": "user | ai | agent",
  "agentId": "optional model/agent identity",
  "intent": "question | issue | support | edit | analogy | contradiction | gap | evidence | link",
  "body": "commentary",
  "confidence": null,
  "revision": 1,
  "orphan": false,
  "createdAt": "...",
  "provenance": {
    "model": null,
    "promptHash": null,
    "runId": null
  }
}
```

## Immutability rule

### Immutable source corpus

For an Aletheia `SourceObject`:
- source text never changes;
- anchor is bound to `sourceId + sourceHash + nodeId + quoteHash`;
- no fuzzy relocation is needed;
- offsets are only convenient local coordinates, not identity.

### Editable derived documents

For:
- user notes,
- analogy prose,
- reconstructed text,
- model narratives,
- collaborative working documents,

an edit produces a new document revision.

An existing anchor has exactly two legal outcomes:

1. its exact quoted fingerprint can be located in the intended node/revision, so the anchor maps forward;
2. it cannot be proven to map, so it becomes `orphan=true`.

No semantic or fuzzy "best guess" relocation may silently re-anchor it.

## MultiView / Two+ Way Glass

Aletheia extends the original two owners into an overlay stack:

- user
- active AI model
- named agent A
- named agent B
- terminology sweep
- logical contradiction detector
- theological lens
- scientific lens
- reviewer

All overlays use the same anchor primitive.

The UI may visually compose overlap, but the stored anchor objects remain independent.

Example:

```
source span
  <- user anchor: question
  <- AI anchor: proposed analogy
  <- logic agent anchor: contradiction
  <- theology lens anchor: doctrinal boundary
```

The visual surface can show "shared" or multi-owner overlap, but Aletheia never collapses those claims into one assertion.

## Highlight -> Aletheia

A highlight can now be used in two distinct ways:

### Analyze transiently
Selection -> Aletheia -> temporary result.

### Anchor persistently
Selection -> create AnchorObject -> Aletheia.

The persistent route lets a later graph node or analogy cite the exact anchor.

```
AnchorObject
  -> terminology sweep
  -> concept candidates
  -> source hyperedge
  -> lens-specific proposals
  -> accepted / quarantined / rejected connectors
  -> analogy prose
```

## AI annotation contract

AI/model highlights MUST be structured output.

The model does not return prose that the UI guesses how to highlight.

Minimum proposal:

```json
{
  "anchorId": "existing-or-new-anchor-id",
  "intent": "question",
  "body": "annotation text",
  "confidence": 0.78
}
```

For a new AI anchor, the output must also contain an exact source locator:

```json
{
  "nodeId": "node:...",
  "quote": "exact source quote",
  "quoteHash": "...",
  "intent": "analogy",
  "body": "...",
  "confidence": 0.62
}
```

A validator confirms the quote exists in that immutable node before storing the anchor.

## Anchor -> graph bridge

Anchors are first-class graph objects.

Useful edge types:

- `ANCHORS`
- `COMMENTS_ON`
- `QUESTIONS`
- `SUPPORTS`
- `CONTRADICTS`
- `PROPOSES_ANALOGY`
- `FLAGS_GAP`
- `EVIDENCES`
- `REFERENCES_GRAPH`
- `REFERENCES_CONNECTOR`

An anchor can therefore act as the visible bridge from human attention to the graph substrate.

## Terminology Sweep integration

The terminology sweep may create **machine attention anchors** for:
- ambiguous title/capitalization,
- high-centrality lexemes,
- repeated concepts,
- false friends,
- possible aliases,
- polysemy,
- unresolved mappings.

These are not asserted interpretations; they are structured attention marks.

## Hypergraph integration

A set of anchors can become a hyperedge when one interpretive relation binds several spans.

Example:

```
ANALOGY(
  anchor:watchers,
  anchor:knowledge_transfer,
  anchor:human_recipient,
  derived:capability_proliferation
)
```

The hyperedge retains every anchor ID, so shape matching remains traceable to source.

## Multiway reconciliation

When user and model disagree on one anchor:

```
anchor
  -> branch:user-interpretation
  -> branch:model-A
  -> branch:model-B
```

Branches remain independent until a reconciliation rule proves a merge is legitimate.

This directly connects Two-Sided Glass to Aletheia's multiway reconciliation substrate.

## Audit model

Anchor operations are append-only events:

- anchor.created
- anchor.comment.added
- anchor.remapped
- anchor.orphaned
- anchor.resolved
- proposal.created
- proposal.accepted
- proposal.quarantined
- proposal.rejected

Facts such as token use or invocation cost remain separate from subjective estimates such as interpretive confidence or coherence.

## UI behavior

Recommended source reader behavior:

- tap/drag to select text;
- action sheet: Analyze / Anchor / Ask model / Link / Compare;
- choose intent;
- store persistent anchor;
- owner filters;
- overlap visualization;
- anchor sidebar/drawer;
- jump-to-anchor;
- "Run Aletheia on this anchor";
- "Compare this anchor across corpus";
- "Show graph neighborhood";
- "Ask model to annotate this section";
- orphan queue for editable derived documents.

## Firewall

Two-Sided Glass does not relax any Aletheia firewall.

Anchors can reference proposed DiazAI, GrandState, Ultracode, or mint objects, but external build/export remains locked behind the existing provenance and merge-integrity gates.
