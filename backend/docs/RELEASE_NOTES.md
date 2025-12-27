# Release notes — 2025-12-27

This release implements security hardening, bug fixes, and reliability improvements for the backend:

- Security and dependency fixes
  - Upgraded `cloudinary` to 2.8.0 to fix high-severity advisories and remove transitive vulnerabilities.
  - Verified `npm audit` shows no remaining high/critical vulnerabilities.

- New features & reliability
  - Added direct signed Cloudinary upload endpoint (`GET /uploads/sign`) and unit + integration tests.
  - Cloudinary helper now validates configuration and returns 503 when signing is unavailable.
  - Added graceful shutdown (`SIGINT`/`SIGTERM` handling) which closes Prisma client and server.
  - Added process-level handlers for `unhandledRejection` and `uncaughtException` that report to Sentry and log via `logger`.

- CI and operations
  - Added GitHub Actions workflows: CI test run on PRs/push and a `staging-migrations` workflow to run `prisma migrate deploy`, `seed` and smoke tests on staging.
  - Added a PowerShell `pg_dump` helper and DB backup documentation.

- Tests
  - Added `uploads.sign.test.js` and extended tests to cover signed upload behavior when Cloudinary is not configured.

If you want, I can open a PR with these changes or push them directly to your branch. If you'd like, I can also continue with a deeper security hardening pass (secret scanning, audit fix of other optional transitive packages, add Dependabot config).