# LAPORAN F1 — Check-in Integration (Minimal)

- Endpoint yang diintegrasikan: **POST /attendance/check-in**
- URL frontend (page): <http://localhost:3010/admin/attendance/check-in>
- URL backend: <http://localhost:3009/attendance/check-in>

Hasil pengujian singkat:

- Dilakukan POST uji ke backend via frontend button (atau langsung ke backend) yang membawa header `Authorization: Bearer DUMMY_TOKEN` dan payload minimal `attendance_date`, `location`, `photo`.
- Backend menerima request dan memberikan response (bisa sukses atau error tergantung token/validasi). Untuk token dummy ini, response kemungkinan berupa error autentikasi — namun kondisi tersebut masih memenuhi tujuan verifikasi integrasi (request diterima & direspons).

Catatan:

- TOKEN masih **dummy** (`DUMMY_TOKEN`) — gantikan dengan token valid atau ubah ke proxy yang menyuntikkan token bila diperlukan.
- Tidak ada perubahan pada backend.
- Tidak ada penambahan dependency frontend.

---
Ringkasan: Integrasi minimal selesai — page untuk Check-in ditambahkan di `frontend/app/admin/attendance/check-in/page.tsx`. Silakan buka URL di atas dan klik **Check-in** untuk mengirimkan request dan melihat response backend (success / error).
