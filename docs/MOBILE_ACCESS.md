# Mobile Access and Static Deployment

Aletheia does not require Replit.

## Supported delivery modes

1. **GitHub Pages PWA** — primary mobile/desktop client once GitHub Pages is enabled.
2. **Standalone HTML** — single-file local fallback with the classic corpus explorer and embedded Research Apparatus.
3. **Static release ZIP** — complete installable/offline site bundle.
4. **Node/Docker backend** — optional heavy research services for live DiazAI canon, Wolfram, Oracle, and remote model calls.

## One-time GitHub Pages repository setting

The connected GitHub App can build and verify the Pages site but does not have repository-administration permission to enable GitHub Pages.

A repository administrator must perform this one-time action:

1. Open **Settings** for `m3TaTr0Nx/ALETHEIA`.
2. Open **Pages**.
3. Under **Build and deployment**, set **Source** to **GitHub Actions**.

After that, rerun the workflow **Deploy Aletheia GitHub Pages** or push any new commit to `main`.

Expected public URL:

`https://m3tatr0nx.github.io/ALETHEIA/`

Expected apparatus URL:

`https://m3tatr0nx.github.io/ALETHEIA/apparatus/`

Expected standalone download URL:

`https://m3tatr0nx.github.io/ALETHEIA/downloads/ALETHEIA_STANDALONE.html`

## Android installation

After Pages is live:

1. Open the Pages URL in Chrome.
2. Use **Install app** from the Aletheia controls or Chrome's menu.
3. Launch Aletheia from the home-screen icon.
4. Use **Persistent storage** in the app controls.
5. Use **Backup local state** regularly for important local corpora.

The installed PWA caches the core client for offline use.

## Local standalone HTML

The generated `ALETHEIA_STANDALONE.html` contains:

- classic corpus explorer;
- local corpus import;
- section/highlight analysis;
- terminology sweep;
- local graph/hypergraph projection;
- analogy fabrics;
- embedded static Research Apparatus;
- X-Way Glass demonstration;
- multiscale graph comparison;
- subset tightness;
- DiazAI read-only demo receipts.

Live DiazAI, Wolfram, Oracle, and remote-model services still require the optional backend.

## Storage policy

The browser is not the canonical store for the 10 GiB DiazAI corpus.

- personal/local corpora: browser-local storage with explicit backup;
- DiazAI canon: external read-only backend mount;
- research receipts: exportable bundles and backend receipt store;
- GitHub: canonical source code and release engineering.

## Release verification

The static release is generated from source by `npm run build:pages` and checked by `npm run verify:pages`.

CI verifies:

- Node unit tests;
- classic corpus workflow;
- multiscale demo threshold;
- carrier round trips;
- DiazAI read-only provider safety;
- static PWA build;
- PNG install-icon dimensions and CRCs;
- static HTTP serving;
- standalone HTML presence and embedded apparatus.
