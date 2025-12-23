#!/usr/bin/env node
(async () => {
    const BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3009';
    const fetch = global.fetch || (await import('node:node-fetch')).default;

    function logLine(tag, v) {
        console.log(tag + ': ' + (typeof v === 'string' ? v : JSON.stringify(v)));
    }

    try {
        const h = await fetch(BASE + '/');
        const hj = await h.json();
        logLine('HEALTH', hj);
    } catch (e) { logLine('HEALTH_ERROR', e.message || String(e)); }

    // login as karyawan1 (seed)
    try {
        const loginRes = await fetch(BASE + '/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: 'karyawan1', password: 'workerpass' }) });
        const loginBody = await loginRes.json();
        logLine('LOGIN_STATUS', loginRes.status);
        logLine('LOGIN_BODY', loginBody);
        const token = loginBody.token;
        if (!token) throw new Error('no token');

        // call protected endpoint: POST /attendance/check-in
        const ci = await fetch(BASE + '/attendance/check-in', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }, body: JSON.stringify({ attendance_date: new Date().toISOString() }) });
        const ciBody = await ci.text();
        logLine('CHECKIN_STATUS', ci.status);
        logLine('CHECKIN_BODY', ciBody);
    } catch (e) { logLine('LOGIN_ERROR', e.message || String(e)); process.exitCode = 2; }

})();
