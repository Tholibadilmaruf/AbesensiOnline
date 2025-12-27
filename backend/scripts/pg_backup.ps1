param(
  [string]$outDir = "./backups",
  [string]$databaseUrl = $env:DATABASE_URL
)

if (-not $databaseUrl) {
  Write-Error "DATABASE_URL environment variable is required"
  exit 2
}

if (-not (Get-Command pg_dump -ErrorAction SilentlyContinue)) {
  Write-Error "pg_dump not found in PATH. Please install PostgreSQL client tools and ensure pg_dump is available"
  exit 3
}

if (-not (Test-Path $outDir)) {
  New-Item -ItemType Directory -Path $outDir | Out-Null
}

$timestamp = Get-Date -Format "yyyyMMddHHmmss"
$outFile = Join-Path $outDir "backup-$timestamp.sql"

Write-Output "Running pg_dump to $outFile"
& pg_dump --dbname=$databaseUrl -F c -f $outFile
if ($LASTEXITCODE -ne 0) {
  Write-Error "pg_dump failed with exit code $LASTEXITCODE"
  exit $LASTEXITCODE
}

Write-Output "Backup completed: $outFile"