"use client";

import { useState } from "react";

export default function CheckInPage() {
    const [username, setUsername] = useState("karyawan1");
    const [password, setPassword] = useState("workerpass");
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    async function login() {
        setMessage(null);
        setLoading(true);
        try {
            const res = await fetch("http://localhost:3009/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });
            const body = await res.json();
            if (!res.ok) {
                setMessage(body.error || body.message || "Login failed");
            } else {
                // assume backend returns { token: '...' }
                setToken(body.token);
                setMessage("Login berhasil");
            }
        } catch (err: any) {
            setMessage("Network error");
        } finally {
            setLoading(false);
        }
    }

    async function handleCheckIn() {
        setLoading(true);
        setMessage(null);

        try {
            const token = (window as any).__AUTH_TOKEN__;

            if (!token) {
                throw new Error("Token tidak ditemukan. Silakan login ulang.");
            }

            const res = await fetch("http://localhost:3009/attendance/check-in", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    attendance_date: new Date().toISOString().slice(0, 10),
                    location: "Mock Location",
                    photo: null,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Check-in gagal");
            }

            setMessage("Check-in berhasil");
        } catch (err: any) {
            setMessage(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div style={{ padding: 8 }}>
            <h2>Check-in</h2>

            {!token && (
                <div style={{ marginBottom: 12 }}>
                    <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="username" style={{ marginRight: 8 }} />
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="password" style={{ marginRight: 8 }} />
                    <button onClick={login} disabled={loading} style={{ padding: '6px 12px' }}>Login</button>
                </div>
            )}

            {token && (
                <div style={{ marginBottom: 12 }}>
                    Logged in as <b>{username}</b>
                </div>
            )}

            <div>
                <button onClick={handleCheckIn} disabled={loading || !token} style={{ padding: '8px 16px', background: '#2563eb', color: '#fff', borderRadius: 4 }}>
                    {loading ? 'Loading...' : 'Check-in'}
                </button>
            </div>

            {message && (
                <p style={{ marginTop: 12 }}>
                    {message}
                </p>
            )}

            <div style={{ marginTop: 12, fontSize: 12, color: '#666' }}>Note: token stored in-memory (no persistence, no refresh).</div>
        </div>
    );
}
