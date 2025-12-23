# REPORT_OPS5_FRONTEND_GLOBAL_ERROR

Ringkasan

- Menambahkan penanganan global di `frontend/lib/api.ts`:
  - 401: hapus token + `window.location.replace('/login')` (browser). Non-browser: return response.
  - 403: kembalikan response untuk ditangani oleh caller (tanpa redirect).
  - 5xx: tampilkan `console.warn` dan kembalikan response.
  - Network errors: tidak melempar; mengembalikan objek konsisten dengan `status:0` dan `error`.

Endpoint yang diuji

- 401: POST /attendance/check-in (tanpa token)
- 403: PUT /attendance/:id/correct (login sebagai `karyawan1`)
- 500: Mock server `http://localhost:4001/mock` (internal temporary server)

Hasil akhir (bukti satu baris per status)

- UNAUTH_STATUS 401 BODY:{"message":"Unauthenticated"}
- KARYAWAN_FORBIDDEN_STATUS 403 BODY:{"message":"Forbidden: requires role ADMIN"}
- SERVER_500_STATUS 500 BODY:{"message":"mock server error"}

Kesimpulan singkat

- Helper `frontend/lib/api.ts` sekarang menangani 401/403/5xx secara terpusat tanpa menimbulkan exception tak tertangani atau loop redirect. 401 memicu pembersihan token dan redirect di browser; 403 dan 5xx dikembalikan ke caller untuk penanganan UI/UX lebih lanjut.
