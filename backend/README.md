# Backend – Sistem Absensi

Backend core sistem absensi online.
Berisi:

- Auth
- RBAC
- Payroll Lock
- Attendance
- Audit Trail

⚠️ Aturan bisnis terkunci.
Perubahan harus melalui SPEC & FIXLOG.

---

## Konfigurasi Port (Default)

**Default backend:** `http://localhost:3009`

- Default ini dikonfigurasikan di `backend/.env` dan `backend/.env.example` (PORT=3009).
- **Tidak mengubah logika aplikasi** — hanya konfigurasi default.
- Anda tetap bisa menimpa port menggunakan environment variable ketika menjalankan, contohnya:

  - Windows (cmd.exe):

    ```cmd
    set PORT=4000 && npm run start
    ```

  - PowerShell:

    ```powershell
    $Env:PORT = '4000'; npm run start
    ```

  - macOS / Linux (bash/zsh):

    ```bash
    PORT=4000 npm run start
    ```

> Tip: `npm run start` menggunakan `backend/src/index.js` which reads `process.env.PORT || 3009` so explicit env overrides always win.
