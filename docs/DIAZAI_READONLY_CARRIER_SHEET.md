# DiazAI Read-Only Opaque Carrier Cell Sheet

Status: feature branch; not merged into the supported application.

## Scope

This module uses the DiazAI canon only as a read-only mathematical adjudication source.

The repository does not copy the DiazAI canon corpus. It stores only opaque canon references, typed carrier identifiers, query envelopes, and verification receipts.

## Lexicographic partition

A corpus terminology sweep produces normalized unique lexemes.

The implementation sorts those lexemes deterministically and partitions them into pages of 729 cells.

Each cell is addressed locally by:

- sheet identifier;
- local index 0..728;
- six-trit address in F3^6;
- typed Z9^3 chart obtained from x = a + 3b for paired trits.

The local address is scoped to the sheet. Index 0 on sheet 0 and index 0 on sheet 1 are not a collision.

## Opaque cell rule

Cell identifiers are hashes of sheet identity plus local index. They do not contain the lexeme itself.

Lexeme identity is tracked separately with a stable lexeme hash.

This prevents carrier addressing from being mistaken for lexical or semantic identity.

## Typed carrier rule

Equal cardinality does not authorize algebraic identification.

The module therefore records:

- address space;
- chart space;
- codec identifier;
- law identifier;
- canon reference;
- semanticIdentity=false.

A ring, field, nearfield, quasifield, or display codec must be identified by an explicit law identifier before any operation is evaluated.

## Collision adjudication

The module returns typed receipts.

Examples:

- SCOPED_ADDRESS_REUSE
- TYPED_LAW_CONFLICT
- SAME_LEXEME_CROSS_SHEET
- ADDRESS_COMPATIBLE_UNRESOLVED

None of these states authorizes semantic merge.

## DiazAI query envelope

A carrier cell can generate a read-only canon query requesting:

- claim status;
- evidence;
- conflicts;
- admissible transforms;
- operator qualification.

The query explicitly sets writeAllowed=false.

## Wolfram verification

The supplied Wolfram script checks all 729 local cells.

It verifies:

1. index -> F3^6 -> Z9^3 -> F3^6 -> index round-trip;
2. all 729 Z9^3 triples are unique;
3. the codec must not be treated as an additive-group isomorphism.

The third check is intentionally negative: it counts native-addition violations between the F3^6 and Z9^3 views.

## Integration boundary

This branch does not alter source text, source graphs, or the current book/corpus UI.

The intended later pipeline is:

terminology sweep
-> opaque carrier sheet
-> read-only DiazAI canon query
-> Wolfram finite verification
-> typed receipt
-> Aletheia connector proposal
-> human/model review
-> derived analogy fabric

No result is promoted into DiazAI, GrandState, Ultracode, or a minting layer.
