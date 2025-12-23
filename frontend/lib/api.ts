// Minimal API helper for frontend
const API_BASE = (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_API_BASE_URL) || 'http://localhost:3009';

export function getToken(): string | null {
    try {
        return typeof window !== 'undefined' ? window.localStorage.getItem('auth.token') : null;
    } catch (e) {
        return null;
    }
}

export function setToken(token: string | null) {
    try {
        if (typeof window !== 'undefined') {
            if (token) window.localStorage.setItem('auth.token', token);
            else window.localStorage.removeItem('auth.token');
        }
    } catch (e) { }
}

export function getUser(): any | null {
    try { return typeof window !== 'undefined' ? JSON.parse(window.localStorage.getItem('auth.user') || 'null') : null } catch (e) { return null }
}

export function setUser(user: any | null) {
    try { if (typeof window !== 'undefined') { if (user) window.localStorage.setItem('auth.user', JSON.stringify(user)); else window.localStorage.removeItem('auth.user') } } catch (e) { }
}

export async function apiFetch(path: string, opts: RequestInit = {}) {
    const headers: Record<string, string> = Object.assign({}, opts.headers || {} as any);
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
    headers['Content-Type'] = headers['Content-Type'] || 'application/json';

    // generate simple UUID v4 (RFC4122) without dependency
    function uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = (Math.random() * 16) | 0;
            const v = c === 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    }

    const requestId = uuidv4();
    headers['X-Request-Id'] = requestId;

    try {
        const res = await fetch(API_BASE + path, Object.assign({}, opts, { headers, credentials: 'same-origin' }));

        // Centralized handling
        const duration = Date.now() - startTime;

        // Minimal logging for correlation
        try {
            const info = `${(opts.method || 'GET').toUpperCase()} ${path} ${res.status} requestId=${requestId} duration=${duration}ms`;
            if (res.status >= 500) console.warn(info);
            else console.info(info);
        } catch (e) { }

        if (res.status === 401) {
            // clear stored auth and redirect to login in browser
            try { setToken(null); setUser(null); } catch (e) { }
            if (typeof window !== 'undefined' && window.location) {
                try { window.location.replace('/login'); } catch (e) { /* ignore */ }
            } else {
                // non-browser callers get the response back to inspect
            }
            return res;
        }

        if (res.status === 403) {
            // Forbidden: surface response for caller to handle, do not redirect
            return res;
        }

        if (res.status >= 500) {
            // Surface generic warning for server errors
            try { console && console.warn && console.warn('Server error', res.status); } catch (e) { }
            return res;
        }

        return res;
    } catch (err: any) {
        // Network or unexpected error: do not throw raw, return a consistent object
        try { console && console.warn && console.warn('Network/API error', err && err.message); } catch (e) { }
        return {
            ok: false,
            status: 0,
            error: err && err.message,
            json: async () => ({ message: err && err.message }),
            text: async () => String(err && err.message),
        } as unknown as Response;
    }
}

export async function login(username: string, password: string) {
    const res = await fetch(API_BASE + '/auth/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password })
    });
    if (!res.ok) throw new Error('LOGIN_FAILED');
    const j = await res.json();
    if (j && j.token) setToken(j.token);
    if (j && j.user) setUser(j.user);
    return j;
}

export default { API_BASE, getToken, setToken, apiFetch, login };
