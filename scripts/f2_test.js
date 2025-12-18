const http = require('http');
const https = require('https');

function postJson(url, body, headers = {}) {
    return new Promise((resolve, reject) => {
        const u = new URL(url);
        const lib = u.protocol === 'https:' ? https : http;
        const opts = {
            hostname: u.hostname,
            port: u.port,
            path: u.pathname + u.search,
            method: 'POST',
            headers: Object.assign({ 'Content-Type': 'application/json' }, headers),
        };
        const req = lib.request(opts, (res) => {
            let data = '';
            res.setEncoding('utf8');
            res.on('data', (c) => (data += c));
            res.on('end', () => {
                try {
                    const json = data ? JSON.parse(data) : null;
                    resolve({ status: res.statusCode, body: json, raw: data });
                } catch (e) {
                    resolve({ status: res.statusCode, body: null, raw: data });
                }
            });
        });
        req.on('error', (e) => reject(e));
        req.write(JSON.stringify(body));
        req.end();
    });
}

(async () => {
    console.log('F2 minimal auth test');
    try {
        console.log('- Attempting backend login...');
        const login = await postJson('http://127.0.0.1:3009/auth/login', { username: 'karyawan1', password: 'workerpass' });
        console.log('  login status', login.status);
        console.log('  login body', login.body || login.raw);
        if (!login.body || !login.body.token) {
            console.error('No token obtained — cannot proceed to check-in test.');
            process.exit(2);
        }
        const token = login.body.token;

        console.log('- Posting check-in to backend directly...');
        const check = await postJson('http://127.0.0.1:3009/attendance/check-in', { attendance_date: new Date().toISOString().slice(0, 10), location: 'Test Location', photo: null }, { Authorization: `Bearer ${token}` });
        console.log('  check-in status', check.status);
        console.log('  check-in body', check.body || check.raw);

        console.log('- Attempting check-in via frontend proxy (if frontend is up)...');
        try {
            const proxy = await postJson('http://127.0.0.1:3010/api/attendance/check-in', { attendance_date: new Date().toISOString().slice(0, 10), location: 'Proxy Test', photo: null }, { Authorization: `Bearer ${token}` });
            console.log('  proxy status', proxy.status);
            console.log('  proxy body', proxy.body || proxy.raw);
        } catch (e) {
            console.warn('  proxy request failed (frontend might be down):', e.message);
        }

        console.log('Done');
    } catch (e) {
        console.error('Error during F2 test', e.message);
        process.exit(1);
    }
})();
