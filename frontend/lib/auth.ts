import api from './api';

export function requireAuth() {
    const token = api.getToken();
    if (!token) return { ok: false, reason: 'NO_TOKEN' };
    const user = api.getUser();
    if (!user) return { ok: false, reason: 'NO_USER' };
    return { ok: true, user };
}

export function requireRole(allowedRoles: string[] = []) {
    const r = requireAuth();
    if (!r.ok) return { ok: false, reason: r.reason };
    const role = r.user?.role;
    if (!role) return { ok: false, reason: 'NO_ROLE' };
    if (allowedRoles.length === 0) return { ok: true, user: r.user };
    if (allowedRoles.includes(role)) return { ok: true, user: r.user };
    console.warn('Access denied for role', role, 'needed', allowedRoles);
    return { ok: false, reason: 'FORBIDDEN', role };
}

export default { requireAuth, requireRole };
