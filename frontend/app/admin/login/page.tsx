"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function handleLogin() {
        setLoading(true);
        setError(null);

        try {
            const res = await fetch("http://localhost:3009/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Login failed");
            }

            // SIMPAN TOKEN DI MEMORY (GLOBAL SEDERHANA)
            (window as any).__AUTH_TOKEN__ = data.token;

            router.push("/admin/attendance/check-in");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <h2>Admin Login</h2>

            <div style={{ maxWidth: 320 }}>
                <input
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <br />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <br />
                <button onClick={handleLogin} disabled={loading}>
                    {loading ? "Loading..." : "Login"}
                </button>
            </div>

            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
}
