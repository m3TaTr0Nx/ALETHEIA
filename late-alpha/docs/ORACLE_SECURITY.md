# Oracle Security Model

The Oracle fetcher imports public research material without becoming an SSRF proxy or executable downloader.

Controls:
- only HTTP(S);
- embedded credentials rejected;
- DNS resolution before fetch;
- localhost/private/link-local/reserved/multicast targets blocked;
- redirects revalidated, max four;
- 12 MiB streamed limit;
- content-type allowlist;
- imported files stored as data, not executed;
- SHA-256 manifest;
- HTML converted to inert text before corpus load;
- original and final URLs preserved.

Production deployments should additionally add authentication, per-user quotas, malware scanning, stronger HTML/PDF isolation, storage lifecycle controls, and host policy.
