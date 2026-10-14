# Deployment

GitHub is the canonical source. The application does not depend on Replit.

## Local Node

```bash
npm test
npm start
```

Open:

- classic corpus explorer: `http://localhost:3000/`
- Research Apparatus: `http://localhost:3000/apparatus`
- health: `http://localhost:3000/api/health`
- DiazAI mount status: `http://localhost:3000/api/diazai/status`

## Docker

```bash
docker build -t aletheia:0.2-alpha .
docker run --rm -p 3000:3000 aletheia:0.2-alpha
```

## DiazAI read-only mount

When the deduplicated DiazAI source tree is available:

```bash
docker run --rm -p 3000:3000 \
  -e DIAZAI_CANON_ROOT=/canon/diazai \
  -e DIAZAI_CANON_INDEX=DIAZAI_ARTIFACT_DATABASE_2026-09-13.json \
  -v /absolute/path/to/diazai:/canon/diazai:ro \
  aletheia:0.2-alpha
```

Or set `DIAZAI_HOST_PATH` and use:

```bash
docker compose up --build
```

The container receives the DiazAI tree read-only. Aletheia never needs to copy the full 10 GiB canon into its image.

## Production front door

Place the Node process behind TLS and authentication when exposing non-public corpora.

Recommended deployment controls:

- TLS reverse proxy;
- authentication before private corpus or canon access;
- read-only DiazAI filesystem mount;
- writable Aletheia state outside the canon mount;
- append-oriented receipt store;
- request size limits;
- server-side rate limits;
- no arbitrary canon path endpoint;
- regular GitHub CI and pinned release commit.

## Replit

Replit can be used as a demonstration mirror. It is not the persistence, canon, or source-of-truth layer.
