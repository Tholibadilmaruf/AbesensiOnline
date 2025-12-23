REPORT_OPS3_FRONTEND_AUTH_MIN

1) Strategi penyimpanan token

- Penyimpanan: localStorage (kunci `auth.token`). Pilihan ini dipakai untuk wiring auth minimal di frontend.

1) Endpoint yang diuji

- Login: `POST /auth/login` (<http://localhost:3009/auth/login>)
- Protected: `POST /attendance/check-in` (<http://localhost:3009/attendance/check-in>)

1) Hasil akhir

- [x] SUKSES
  - Login (1 baris bukti): LOGIN_STATUS: 200
  - Protected check-in (1 baris bukti): CHECKIN_STATUS: 201

- [ ] GAGAL
  - Error utama (jika gagal): N/A

1) Kesimpulan singkat

- Auth wiring minimal berhasil: token diperoleh saat login (karyawan1) dan digunakan otomatis pada request berikutnya sebagai header `Authorization: Bearer <token>`; protected endpoint menerima request dan mengembalikan HTTP 201.

Catatan: implementasi frontend helper ada di `frontend/lib/api.ts`. Untuk pengujian otomatis saya menambahkan `scripts/fe_auth_test_node.js` yang melakukan login dan check-in dari WSL.
