# Security Checklist (baseline for production)

1. Use managed Postgres (example: Amazon RDS, Azure Database for PostgreSQL)
2. Ensure DB backups and restore tests are configured (daily backup, point-in-time recovery)
3. Store secrets (JWT_SECRET, DB credentials) in a secrets manager (Vault, AWS Secrets Manager)
4. Enforce HTTPS (TLS) in front of backend and frontend
5. Enforce server-side RBAC checks for all sensitive routes
6. Add rate limiting and brute-force protections
7. Add input validation and sanitization for user input
8. Centralized logging and error tracking (Sentry / similar)
9. Add monitoring and alerts (latency, error rate, disk, DB health)
10. Add CI pipelines for linting, unit tests, and integration tests
11. Conduct regular dependency audits (`npm audit`) and patch high/critical vulnerabilities
12. Add e2e tests for authentication and role-based flows

Follow this checklist before bringing the system to production for ~100+ users.
