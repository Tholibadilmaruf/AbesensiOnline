# LAPORAN F2 — Auth Minimal (Demo)

- **Tujuan:** Integrasikan `POST /auth/login` secara minimal, simpan token in-memory, gunakan token untuk `POST /attendance/check-in`.

- **Perubahan (Frontend saja):**
  - **Frontend calls backend directly** (no proxy):
    - `frontend/app/admin/login/page.tsx` → POST `http://localhost:3009/auth/login` (login) and stores token in-memory on `window.__AUTH_TOKEN__`.
    - `frontend/app/admin/attendance/check-in/page.tsx` → reads token from `window.__AUTH_TOKEN__` and POSTs to `http://localhost:3009/attendance/check-in`.
    - Token stored in-memory (global variable) — no cookies/localStorage.

- **Cara Pengujian:**
  - Buka `http://localhost:3010/admin/login`, login dengan `karyawan1 / workerpass`, Anda akan diarahkan ke `/admin/attendance/check-in`.
  - Klik **Check-in** → request dikirim ke backend dengan header `Authorization: Bearer <token>`; backend merespons sukses atau validasi (e.g., "Already checked in for this date").

- **Catatan:**
  - Tidak ada perubahan backend.
  - Token tidak dipersist (hilang saat reload).
- **URL & Cara Pengujian:**
  - Buka: `http://localhost:3010/admin/attendance/check-in`
  - Login: gunakan seed user `karyawan1 / workerpass` (dari `prisma/seed.js`) jika tersedia
  - Klik **Check-in** → permintaan dikirim ke backend `http://localhost:3009/attendance/check-in` dengan header `Authorization`.

- **Hasil / Catatan:**
  - Tidak ada perubahan backend.
  - Token hanya disimpan di memory (kadaluarsa bila halaman direfresh).
  - Tidak ada mekanisme refresh token atau middleware otentikasi frontend — ini hanya solusi _minimal_ untuk FASE F2.

---
Ringkas: Auth minimal berhasil diintegrasikan pada frontend; silakan jalankan pengujian manual via halaman di atas dan laporkan hasil (sukses/error).
