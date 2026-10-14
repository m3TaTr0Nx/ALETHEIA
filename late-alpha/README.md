# ALETHEIA — Late Alpha 0.9

This branch contains the tested late-alpha rebuild. GitHub is the canonical source; Replit is an optional deployment mirror.

Core invariants:
- SOURCE != INTERPRETATION.
- source containers are immutable;
- six interpretation fabrics mutate independently;
- abstraction depth is explicit;
- Oracle downloads enter a sandbox before corpus ingestion;
- Wolfram is an optional exact computational substrate;
- DiazAI / GrandState / Ultracode / mint bridges remain locked.

Run with Node 20+:

npm start

The local package passed syntax checks, eight Node tests, and a live /api/health smoke test before being committed.
