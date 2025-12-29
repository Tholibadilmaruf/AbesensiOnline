import Link from "next/link";

export default function NotFound() {
    return (
        <main style={{ padding: 24 }}>
            <h1>Halaman tidak ditemukan (404)</h1>
            <p>Maaf, halaman yang Anda cari tidak tersedia.</p>
            <p><Link href="/">Kembali ke beranda</Link></p>
        </main>
    );
}