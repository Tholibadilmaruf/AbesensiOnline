#!/usr/bin/env node
// Test role enforcement on PUT /attendance/:id/correct
const fetch = global.fetch || (await import('node:node-fetch')).default;
const TARGET_ID = process.env.TEST_ATTENDANCE_ID || '1e1ea958-ce39-4099-abf5-41b084c56dc8';
const BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3009';

async function loginAs(username, password) {
    const r = await fetch(BASE + '/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password }) });
    const j = await r.json();
    return { status: r.status, body: j };
}

async function tryCorrect(token) {
    const r = await fetch(BASE + `/attendance/${TARGET_ID}/correct`, { method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }, body: JSON.stringify({ field_name: 'status', after_value: 'HADIR', reason: 'test' }) });
    const text = await r.text();
    console.log('CORRECT_STATUS', r.status, 'BODY', text);
}

(async () => {
    console.log('LOGIN as karyawan1...');
    const k = await loginAs('karyawan1', 'workerpass');
    console.log('KARYAWAN_LOGIN', k.status, JSON.stringify(k.body).slice(0, 200));
    const ktoken = k.body.token;
    if (ktoken) await tryCorrect(ktoken);

    console.log('LOGIN as admin...');
    const a = await loginAs('admin', 'adminpass');
    console.log('ADMIN_LOGIN', a.status, JSON.stringify(a.body).slice(0, 200));
    const atoken = a.body.token;
    if (atoken) await tryCorrect(atoken);

})();
