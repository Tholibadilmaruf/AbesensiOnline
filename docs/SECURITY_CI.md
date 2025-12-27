# Enabling Security CI (Semgrep & detect-secrets)

These `*.yml.disabled` templates are included in the repo so you can review them in a PR without enabling them automatically. To enable the checks in GitHub Actions:

1. Rename the files under `.github/workflows/` from `*.yml.disabled` to `*.yml`.
2. Add GitHub Secrets in the repository settings as needed (example):
   - `SEMGREP_REGISTRY_TOKEN` (optional — only if you want to use Semgrep registry / premium rules)
   - Any other secrets referenced by rules/checks.
3. Merge the PR and verify the workflow runs on a PR to `main` or the configured branch.

Notes:
- `detect-secrets` uses a `.secrets.baseline` file to reduce false positives; keep it updated by running `detect-secrets scan --baseline .secrets.baseline` locally and committing changes.
- If you want the Semgrep Registry rules enabled, run `semgrep login` locally, obtain a token, and set `SEMGREP_REGISTRY_TOKEN` as a secret in GitHub.
- Review reports as artifacts on the workflow run (or extend workflows to post to an aggregator/alerting tool).
