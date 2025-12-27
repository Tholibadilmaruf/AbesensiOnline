# Database backup

This repository includes a small PowerShell helper to perform a logical backup using `pg_dump`.

Usage:

- Ensure PostgreSQL client tools are installed and `pg_dump` is available in PATH
- From `backend/` run:

```powershell
.\scripts\pg_backup.ps1 -outDir .\backups
```

Or set the `DATABASE_URL` env var and run with default options.

For scheduled backups consider using a cron job or GitHub Actions with a secure runner and storing the backups in a secure S3 bucket or other blob store. Ensure backups are encrypted at rest and retained following your company policy.