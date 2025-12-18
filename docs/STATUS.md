# STATUS PROYEK

**Terakhir diperbarui:** 2025-12-19

## Ringkasan Singkat

- **Backend:** default port **3009** (<http://localhost:3009>)
- **Frontend:** default port **3010** (<http://localhost:3010>)
- Perubahan terbatas pada konfigurasi port dan dokumentasi; tidak ada perubahan logika aplikasi atau penambahan dependency.

---

## Perubahan Terbaru (dilakukan)

- Backend
  - `backend/.env` & `backend/.env.example` → `PORT=3009`
  - `backend/src/index.js` → uses `const PORT = process.env.PORT || 3009;` and logs `🚀 Backend running at http://localhost:${PORT}`
  - `backend/package.json` → `start`/`dev` restored to `node src/index.js` (env override preserved)
  - `backend/README.md` updated with port docs and override examples (cmd / PowerShell / bash)

- Frontend
  - `frontend/package.json` → scripts set to:

    ```json
    "dev": "next dev -p 3010",
    "build": "next build",
    "start": "next start -p 3010",
    "lint": "next lint"
    ```

  - `frontend/next.config.ts` → rewrite `/api/:path*` → `http://localhost:3009/api/:path*` (verified)
  - `frontend/.env.example` created with `PORT=3010`
  - `frontend/README.md` updated with port and API proxy notes

- Docs
  - `docs/STATUS.md` (this file) updated with current status and verification results.

---

## Verifikasi & Hasil Tes

- Backend
  - Command: `cd backend && npm run dev`
  - Console: `🚀 Backend running at http://localhost:3009`
  - HTTP: `GET http://127.0.0.1:3009/` → **200 OK** with JSON `{ ok: true, service: 'absensi-backend' }`
  - Environment override confirmed (e.g., `set PORT=4000 && npm run start` or PowerShell `$Env:PORT='4000'; npm run start`).

- Frontend
  - Dev: `npm run dev` prints `Local: http://localhost:3010` but in this Windows workstation dev mode produced SWC / Turbopack / WASM warnings (native DLL init failed) — environment-specific.
  - Build: `npm run build` → **success**.
  - Production start: started detached process via `node node_modules/next/dist/bin/next start -p 3010` → `GET http://127.0.0.1:3010/` → **200 OK** (served HTML). Verified accessible.

---

## Isu yang Masih Ada (Known Issues)

- SWC / Turbopack native binary failures and WebAssembly bindings warnings on this Windows environment:
  - Symptoms: "Attempted to load @next/swc-win32-x64-msvc" DLL init failed, and "turbo.createProject is not supported by the wasm bindings".
  - Impact: local `next dev` is noisy/unreliable here; `next build` and `next start` still work.
  - Constraint: per rule, no new dependencies or logic were changed. Fix requires environment-level actions (reinstall native modules, rebuild, or run under WSL).

---

## Rekomendasi & Next Steps

- Option A (recommended): Add a small health-check script (no new deps) to verify both services:
  - `http://localhost:3009/` (backend)
  - `http://localhost:3010/` (frontend)
- Option B: Investigate and fix SWC/Turbopack (requires rebuilding native modules or using WSL) — I can proceed if you authorize environment-level changes.
- Option C: Nothing further; keep repo as-is and document workflows (already added README notes).

---

## File Utama yang Diubah

- backend/.env
- backend/.env.example
- backend/src/index.js
- backend/package.json
- backend/README.md
- frontend/package.json
- frontend/.env.example
- frontend/README.md
- docs/STATUS.md

---

**Wrap-up (Selesai):** Semua tugas scan, perbaikan, verifikasi, dan dokumentasi telah diselesaikan pada **2025-12-19**.

- Health-check script ditambahkan: `scripts/health-check.js` (jalankan `node scripts/health-check.js` dari root untuk memeriksa backend:3009 dan frontend:3010).
- Semua scripts dev/start/build lint dan README ditinjau dan disesuaikan untuk konsistensi port (backend:3009, frontend:3010).

Jika Anda ingin langkah tambahan, silakan pilih salah satu: `prepare-pr` (siapkan ringkasan commit/PR), `investigate-swc` (diagnosa SWC/Turbopack dev issue), atau `none`. Terima kasih!
