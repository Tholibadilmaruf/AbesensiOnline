"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type User = {
    id: string;
    username: string;
    role?: string;
};

export default function HeaderAuth() {
    const [user, setUser] = useState<User | null>(() => {
        try {
            const raw = typeof window !== 'undefined' ? localStorage.getItem('auth.user') : null;
            return raw ? JSON.parse(raw) : null;
        } catch {
            return null;
        }
    });
    const router = useRouter();

    useEffect(() => {
        function onStorage(e: StorageEvent) {
            if (e.key === 'auth.user') {
                try {
                    setUser(e.newValue ? JSON.parse(e.newValue) : null);
                } catch {
                    setUser(null);
                }
            }
        }
        window.addEventListener('storage', onStorage);
        return () => window.removeEventListener('storage', onStorage);
    }, []);

    function logout() {
        try {
            localStorage.removeItem('auth.token');
            localStorage.removeItem('auth.user');
        } catch {
            // ignore
        }
        router.push('/');
        // force reload to reset any client state
        setTimeout(() => window.location.reload(), 10);
    }

    if (!user) {
        return (
            <div>
                <Link href="/login" className="text-sm font-medium text-gray-700">Masuk</Link>
            </div>
        );
    }

    const role = user.role || '';

    // Build UX-only menu based on role; do not display role text directly.
    const items: Array<{ href: string; label: string }> = [{ href: '/', label: 'Beranda' }];
    if (role === 'ADMIN' || role === 'OWNER') {
        items.push({ href: '/admin', label: 'Admin' });
    }

    return (
        <div className="flex items-center gap-4">
            <nav className="flex items-center gap-3">
                {items.map((it) => (
                    <Link key={it.href} href={it.href} className="text-sm text-gray-700">{it.label}</Link>
                ))}
            </nav>

            <div className="flex items-center gap-3">
                {/* Show only username, not role */}
                <span className="text-sm font-medium">{user.username}</span>
                <button onClick={logout} className="text-sm text-red-600">Keluar</button>
            </div>
        </div>
    );
}