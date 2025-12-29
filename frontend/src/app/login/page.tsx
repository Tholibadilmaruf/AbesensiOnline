"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        if (!username || !password) {
            setError("Username dan password harus diisi");
            return;
        }
        setLoading(true);
        try {
            const res = await fetch('/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            if (res.status === 401) {
                setError('Kredensial salah');
                setLoading(false);
                return;
            }

            if (!res.ok) {
                setError('Terjadi kesalahan, coba lagi nanti');
                setLoading(false);
                return;
            }

            const body = await res.json();
            // Store token and user for UI-only behavior
            try {
                localStorage.setItem('auth.token', body.token);
                localStorage.setItem('auth.user', JSON.stringify(body.user));
            } catch {
                // ignore storage errors
            }

            // Redirect to home
            router.push('/');
        } catch {
            setError('Terjadi kesalahan jaringan');
            setLoading(false);
        }
    }

    return (
        <main style={{ padding: 24, maxWidth: 480, margin: 'auto' }}>
            <h1 className="text-2xl font-semibold">Masuk</h1>

            <form onSubmit={onSubmit} style={{ marginTop: 16 }}>
                <div style={{ marginBottom: 12 }}>
                    <label htmlFor="username" className="block text-sm font-medium">Username</label>
                    <input
                        id="username"
                        name="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="mt-1 w-full rounded border px-3 py-2"
                        disabled={loading}
                    />
                </div>

                <div style={{ marginBottom: 12 }}>
                    <label htmlFor="password" className="block text-sm font-medium">Password</label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="mt-1 w-full rounded border px-3 py-2"
                        disabled={loading}
                    />
                </div>

                {error && <div role="alert" className="text-sm text-red-600" style={{ marginBottom: 12 }}>{error}</div>}

                <button
                    type="submit"
                    className="rounded bg-blue-600 px-4 py-2 text-white"
                    disabled={loading}
                >
                    {loading ? 'Sedang masuk...' : 'Masuk'}
                </button>
            </form>
        </main>
    );
}