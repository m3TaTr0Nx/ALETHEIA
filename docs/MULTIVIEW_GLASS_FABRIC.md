# Multiview Glass Fabric Protocol

## Core correction

The primitive is **not** a symmetric user/model pair.

A Two-Sided Glass instance is better understood as two adjacent one-way reflective/transparent surfaces with directional visibility and flow.

Aletheia generalizes this into a **Multiview Glass Fabric**:

```
many substrates
  + typed directional ports
  + one-way or asymmetric visibility
  + gates
  + unions
  + knots
  + bridges
  + masks
  + coherent channels
  = routed epistemic fabric
```

The same source span may therefore participate in several simultaneous channels without collapsing them.

## Emoji sketch interpretation

The user's symbolic notation maps naturally to these protocol objects:

- `📥` = input port
- `📤` = output port
- `⬆️ / ⬇️ / ⬅️ / ➡️ / diagonal arrows` = directed channel flow
- `[ ... | ... ]` = paired asymmetric glass substrate / lane pair
- `🪟` = transparent or selectively transparent interface
- `🧱` = hard boundary / firewall
- `🥅` = gate / predicate-controlled crossing
- `🪢` = knot / union / binding point
- `🪜` = bridge between strata or channels
- `⛓️` = chained interfaces / ordered substrate sequence
- `■■□□` = mask/state/coherence band or enabled/disabled channel cells

These meanings are protocol-level interpretations of the diagram, not claims about the emoji themselves.

## First-class objects

### GlassSubstrate

A bounded surface with directional channel semantics.

```json
{
  "substrateId": "glass:...",
  "documentId": "doc:...",
  "nodeIds": ["node:..."],
  "channels": ["channel:inference", "channel:review"],
  "visibilityPolicy": "asymmetric",
  "writePolicy": "owner_scoped",
  "readPolicy": "gate_controlled",
  "state": "active"
}
```

### Channel

A directed information path.

```json
{
  "channelId": "channel:...",
  "fromPort": "port:A",
  "toPort": "port:B",
  "direction": "forward",
  "payloadTypes": ["anchor", "proposal", "graph_ref"],
  "coherenceDomain": "theological",
  "gateIds": ["gate:provenance"],
  "priority": 0.8
}
```

### Port

A typed ingress/egress endpoint.

Types may include:
- source input
- user attention
- model proposal
- reviewer output
- terminology sweep
- graph/hypergraph projection
- narrative synthesis
- Wolfram computation
- external bridge

### Gate

A crossing condition.

```json
{
  "gateId": "gate:...",
  "predicate": "confidence >= 0.7 && provenance == 'closed'",
  "mode": "allow | block | quarantine | mirror_only",
  "failureRoute": "channel:quarantine"
}
```

### Knot

A controlled union point where several channels may bind into one compound object without merging provenance.

Example:

```
user anchor
model proposal
terminology alert
logical contradiction
        \
         KNOT
          \
        hyperedge
```

A knot records the set of members and their roles. It does not erase their independent identity.

### Bridge / Ladder

A typed cross-layer connector.

Examples:
- source -> semantic ontology
- ontology -> theological lens
- source -> scientific analogy
- anchor -> graph node
- graph -> narrative
- local Aletheia -> future DiazAI bridge

A bridge is directional unless explicitly declared bidirectional.

### Window

A view-only aperture between substrates.

A window may expose:
- source text
- annotations
- graph neighborhood
- confidence metadata
- model rationale

without granting write permission back through the same surface.

This is where the one-way-mirror analogy becomes operationally important.

## Two one-way mirrors, not one symmetric pane

For a simple two-party case:

```
user-facing surface:   user can write / model can observe through gate
model-facing surface:  model can write / user can observe through gate
```

These are adjacent but distinct channel directions.

So instead of:

```
[user <-> model]
```

Aletheia stores:

```
[user OUT] -> gate -> [model IN]
[user IN ] <- gate <- [model OUT]
```

Each lane has separate permissions, filters, provenance, delay, and transformation rules.

## N-way Glass

With N substrates:

```
S1 -> G12 -> S2
S1 -> G13 -> S3
S2 -> G24 -> S4
S3 -> K1  -> S4
S4 -> B1  -> S5
```

There is no requirement for a complete graph.

Missing channels are meaningful.

A channel may be:
- absent
- read-only
- write-only
- mirrored
- delayed
- filtered
- quarantined
- transformed
- audited
- one-shot
- persistent

## Coherence domains

Every channel may be scoped to a domain:

- lexical
- semantic
- ontological
- logical
- theological
- philosophical
- scientific
- AI/information
- historical
- symbolic
- visual
- narrative
- provenance

This prevents unrelated layers from "bleeding" into one another.

A theological channel does not automatically inherit claims from a physics channel.
A lexical match does not automatically become an ontological merge.

## Anchor routing

An AnchorObject may be routed into several channels at once:

```
source anchor
  -> terminology channel
  -> logical channel
  -> theology channel
  -> AI analogy channel
  -> human-review channel
```

Each channel may return a separate annotation anchor.

The overlay UI can show the union visually while the data layer preserves each path.

## Hypergraph relation

The fabric itself is naturally a hypergraph.

A hyperedge may bind:

```
H = {
  anchor,
  source node,
  terminology candidate,
  model proposal,
  reviewer objection,
  target analogy
}
```

The hyperedge carries:
- channel IDs
- gate IDs
- knot IDs
- provenance
- confidence
- directionality
- reconciliation status

## Multiway routing

Ambiguity produces branches rather than overwrite:

```
anchor
  -> lexical branch A
  -> lexical branch B
  -> theological branch C
  -> model branch D
```

A knot may later bind compatible branches.

A gate may block or quarantine incompatible ones.

Wolfram multiway/hypergraph analysis may be used to inspect whether distinct branch histories produce equivalent or related graph shapes.

## Visibility is not authority

A substrate may be able to see another layer without inheriting its authority.

Example:

```
science window -> sees theological graph
science channel -> may propose analogy
science channel -> may NOT rewrite theological source graph
```

Likewise:

```
model window -> sees user anchor
model output -> creates separate proposal anchor
model output -> cannot overwrite user anchor
```

## Aletheia UI requirements

The source reader should support:

- overlay stack selector;
- per-channel visibility toggle;
- owner/lens filters;
- flow-direction indicators;
- gate state indicators;
- knot/union inspection;
- window/read-only state;
- anchor provenance;
- branch view;
- "show all routes from this anchor";
- "show what can see this anchor";
- "show what this anchor can influence";
- "show blocked/quarantined crossings";
- "show hyperedge union";
- "compare channels";

Mobile behavior should collapse this into a drawer/route inspector rather than attempting to draw the whole fabric at once.

## Integrity invariants

1. Visibility does not imply write permission.
2. Write permission does not imply merge authority.
3. Merge authority does not imply source mutation.
4. Shared display does not imply shared ontology.
5. Gate failure produces block or quarantine, never silent bypass.
6. Knots preserve member provenance.
7. Bridges are typed and directional.
8. Missing channels are valid states.
9. Every model/agent contribution remains attributable.
10. Source-layer firewalls remain authoritative.

## DiazAI bridge

This fabric maps naturally into a future DiazAI state machine:

- substrates = state domains
- channels = transitions
- gates = transition predicates
- knots = compound state bindings
- windows = read-only projections
- bridges = cross-domain adapters
- anchors = addressable events/attention objects
- hyperedges = composite relations

The Aletheia implementation remains sandboxed. External DiazAI/GrandState/Ultracode/mint transitions remain locked until explicit provenance and merge-integrity authorization.
