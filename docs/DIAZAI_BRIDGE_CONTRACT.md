# DiazAI Bridge Contract

Status: **not implemented on main**

Aletheia must not guess the DiazAI runtime schema.

The future bridge will be implemented only after the authoritative DiazAI object/state contract is supplied or verified.

## Aletheia export boundary

A bridge candidate may export a provenance-closed Aletheia bundle containing:

- source object identifiers and hashes;
- source span identifiers;
- corpus metadata;
- graph and hypergraph identifiers;
- anchor identifiers;
- terminology mappings;
- derived interpretation objects;
- model provenance;
- confidence and review state;
- mutation depth and parent lineage;
- unresolved alternatives;
- gate state.

## Required DiazAI inputs before implementation

The adapter needs explicit definitions for:

- object identity;
- state identity;
- transition representation;
- parent/child lineage;
- graph/hypergraph serialization;
- permissions;
- provenance requirements;
- persistence semantics;
- versioning;
- conflict behavior;
- rollback behavior;
- GrandState handoff;
- Ultracode handoff;
- MCP asset semantics if applicable.

## Gate requirements

No bridge may execute unless all are true:

- provenance is closed;
- merge integrity is confirmed;
- namespace collisions are resolved;
- unresolved alternatives are reported;
- external-build mode is enabled;
- explicit user authorization exists for the specific bundle.

Until then, Aletheia remains a self-contained research application.
