const http = require('http');

const targets = [
    { name: 'backend', url: 'http://127.0.0.1:3009/' },
    { name: 'frontend', url: 'http://127.0.0.1:3010/' },
];

function check(url) {
    return new Promise((resolve) => {
        const req = http.get(url, (res) => {
            resolve({ ok: res.statusCode >= 200 && res.statusCode < 400, status: res.statusCode });
        });
        req.on('error', (err) => resolve({ ok: false, error: err.message }));
        req.setTimeout(5000, () => {
            req.abort();
            resolve({ ok: false, error: 'timeout' });
        });
    });
}

(async () => {
    console.log('Health check — targets:', targets.map(t => t.name).join(', '));
    let allOk = true;
    for (const t of targets) {
        const r = await check(t.url);
        if (r.ok) {
            console.log(`✓ ${t.name} OK (${r.status}) — ${t.url}`);
        } else {
            console.error(`✗ ${t.name} FAIL — ${t.url} —`, r.error || `status=${r.status}`);
            allOk = false;
        }
    }
    process.exit(allOk ? 0 : 2);
})();