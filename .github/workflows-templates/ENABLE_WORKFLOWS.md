# Mengaktifkan Workflow Keamanan ✅

File-file workflow disimpan di `.github/workflows-templates/` agar tidak memerlukan token dengan `workflow` scope.
Untuk mengaktifkan pemeriksaan keamanan (Semgrep / detect-secrets), maintainer harus memindahkan atau menyalin file template ke `.github/workflows/`.

## Langkah singkat (pilih salah satu)

1) Menggunakan Git lokal (direkomendasikan):

```bash
# di cabang target (mis. main)
cp .github/workflows-templates/semgrep-scan.yml .github/workflows/semgrep-scan.yml
cp .github/workflows-templates/detect-secrets-scan.yml .github/workflows/detect-secrets-scan.yml
git add .github/workflows/*.yml
git commit -m "ci(security): enable semgrep and detect-secrets workflows"
git push origin main
```

2) Menggunakan GitHub UI: buat file baru di path `.github/workflows/<nama>.yml` dan paste isi template dari `.github/workflows-templates/<nama>.yml` lalu commit ke `main`.

> Catatan: Membuat/merubah file di `.github/workflows/` hanya bisa dilakukan oleh pengguna/token dengan hak yang sesuai. Karena itu langkah ini disarankan dilakukan oleh seorang **maintainer/owner**.

## Checklist singkat untuk maintainer ✅

- [ ] Tinjau isi file di `.github/workflows-templates/` (pastikan langkah-langkah dan secret yang diperlukan sesuai)
- [ ] Salin/pindahkan file ke `.github/workflows/` (pertahankan nama file)
- [ ] Pastikan secret repo yang diperlukan diset (`SEMGREP_TOKEN` jika menggunakan semgrep cloud, atau sesuaikan instruksi dalam file workflow)
- [ ] Commit & push perubahan ke `main` (atau cabang yang Anda gunakan untuk mengaktifkan workflows)
- [ ] Verifikasi di tab **Actions** bahwa workflow muncul dan dapat dijalankan
- [ ] Jalankan workflow manual atau buat commit percobaan untuk memicu dan memastikan tidak ada error
- [ ] Jika ingin enforcement, tambahkan pemeriksaan workflow ke branch protection rules (mis. wajib lulus Semgrep sebelum merge)

## Teks PR singkat (salin & paste ke PR body jika ingin):

> **Catatan untuk maintainer:** Workflows keamanan disediakan sebagai template di `.github/workflows-templates/` untuk menghindari kebutuhan `workflow` scope pada token CI. Mohon **copy** file berikut ke `.github/workflows/` dan commit ke `main` untuk mengaktifkannya:
>
> - `.github/workflows-templates/semgrep-scan.yml` → `.github/workflows/semgrep-scan.yml`
> - `.github/workflows-templates/detect-secrets-scan.yml` → `.github/workflows/detect-secrets-scan.yml`
>
> Setelah diaktifkan, pastikan secrets yang diperlukan tersedia dan verifikasi workflow dari tab Actions.

Jika Anda butuh bantuan menyalin file (atau ingin saya bantu membuat PR terpisah yang hanya memindahkan file setelah Anda memberikan token dengan `workflow` scope), beri tahu saya — saya siap membantu. 🎯
