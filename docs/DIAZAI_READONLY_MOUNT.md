# DiazAI 10 GiB Read-Only Mount Contract

The full DiazAI source tree is treated as an external canon source, not copied into Aletheia runtime state.

## Environment

- `DIAZAI_CANON_ROOT` — absolute path of the read-only mount.
- `DIAZAI_CANON_INDEX` — relative path inside the mount to a machine-readable canon index.

## Required filesystem policy

Production deployment should mount the tree read-only at the container or host level.

Recommended:

```
/canon/diazai      read-only
/data/aletheia     read-write
/data/receipts     append-oriented
```

The provider rejects path traversal and exposes no write/delete/promote methods.

## Index strategy

Do not scan 10 GiB on every query.

Use a deduplicated content-addressed manifest containing, at minimum:

- relative path;
- SHA-256;
- byte size;
- artifact status;
- claim IDs;
- carrier/law/operator tags;
- supersession/conflict links.

Large artifacts remain external and are opened only on demand.

## Query path

Aletheia source object
→ terminology/carrier candidate
→ DiazAI index lookup
→ bounded read of relevant canon artifact
→ optional hash verification
→ typed read-only receipt
→ Wolfram check where mathematical verification is applicable
→ Aletheia derived connector.

No operation in this path grants canon mutation authority.
