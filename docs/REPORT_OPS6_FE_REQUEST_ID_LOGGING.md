# REPORT_OPS6_FE_REQUEST_ID_LOGGING

1) Cara generate requestId

- Implemented UUID v4 generator in `frontend/lib/api.ts` (simple replace-based RNG):

  function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

1) Contoh log sukses (1 baris)

- GET / 200 requestId=3b5db304-4336-43ad-93b3-597272fec01b duration=58ms

1) Contoh log error (1 baris)

- PUT /attendance/:id/correct 403 requestId=9ebb5f6e-757c-4401-9904-7ae6bd4980f0 duration=5ms

1) Kesimpulan singkat

- Setiap request sekarang menyertakan header `X-Request-Id` yang di-generate per-request. FE juga mencatat `method`, `path`, `status`, `requestId`, dan `duration(ms)` menggunakan `console.info` / `console.warn`. Tidak ada perubahan fungsional pada endpoint atau perilaku bisnis.
