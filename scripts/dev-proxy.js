const http = require('http');
const url = require('url');

const BACKEND = { hostname: '127.0.0.1', port: 3009 };
const PORT = 3010;

function proxy(req, res, targetPath) {
    const options = {
        hostname: BACKEND.hostname,
        port: BACKEND.port,
        path: targetPath || req.url,
        method: req.method,
        headers: Object.assign({}, req.headers),
    };

    const bodyChunks = [];
    req.on('data', (c) => bodyChunks.push(c));
    req.on('end', () => {
        const body = Buffer.concat(bodyChunks);
        const prox = http.request(options, (pres) => {
            res.writeHead(pres.statusCode, pres.headers);
            pres.pipe(res);
        });
        prox.on('error', (err) => {
            res.writeHead(502, { 'content-type': 'application/json' });
            res.end(JSON.stringify({ error: 'proxy error', detail: String(err) }));
        });
        if (body && body.length) prox.write(body);
        prox.end();
    });
}

function sendHtml(res, html) {
    res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
    res.end(html);
}

const loginHtml = `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Admin Login (Dev Proxy)</title>
</head>
<body>
  <h2>Admin Login</h2>
  <div style="max-width:320px">
    <input id="username" placeholder="Username" value="karyawan1" />
    <br />
    <input id="password" placeholder="Password" type="password" value="workerpass" />
    <br />
    <button id="login">Login</button>
  </div>
  <pre id="out" style="margin-top:12px; white-space:pre-wrap; border:1px solid #eee; padding:8px; max-width:600px"></pre>

  <script>
    const out = txt => document.getElementById('out').textContent = String(txt);
    document.getElementById('login').addEventListener('click', async () => {
      const u = document.getElementById('username').value;
      const p = document.getElementById('password').value;
      try {
        const r = await fetch('/api/auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: u, password: p }) });
        const body = await r.json();
        if (!r.ok) throw body;
        // store token in memory (global variable)
        (window as any).__AUTH_TOKEN__ = body.token;
        out('Login OK: redirecting...');
        window.location = '/admin/attendance/check-in';
      } catch (e) {
        out('Login error: ' + JSON.stringify(e));
      }
    });
  </script>
</body>
</html>`;

const checkinHtml = `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Check-in (Dev Proxy)</title>
</head>
<body>
  <h2>Check-in (Dev Proxy)</h2>
  <div>
    <button id="checkin">Check-in</button>
  </div>
  <pre id="out" style="margin-top:12px; white-space:pre-wrap; border:1px solid #eee; padding:8px; max-width:600px"></pre>

  <script>
    const out = txt => document.getElementById('out').textContent = String(txt);
    document.getElementById('checkin').addEventListener('click', async () => {
      const token = (window as any).__AUTH_TOKEN__;
      if (!token) return out('Token tidak ditemukan. Silakan login.');
      try {
        const r = await fetch('/api/attendance/check-in', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }, body: JSON.stringify({ attendance_date: new Date().toISOString().slice(0,10), location: 'Dev Proxy Location', photo: null }) });
        const body = await r.json();
        if (!r.ok) throw body;
        out('Check-in OK: ' + JSON.stringify(body));
      } catch (e) {
        out('Check-in error: ' + JSON.stringify(e));
      }
    });
  </script>
</body>
</html>`;

const server = http.createServer((req, res) => {
    const u = url.parse(req.url);
    if (req.method === 'GET' && u.pathname === '/admin/attendance/check-in') {
        return sendHtml(res, html);
    }

    if (u.pathname === '/api/auth' && req.method === 'POST') {
        return proxy(req, res, '/auth/login');
    }

    if (u.pathname === '/api/attendance/check-in' && req.method === 'POST') {
        return proxy(req, res, '/attendance/check-in');
    }

    res.writeHead(404, { 'content-type': 'text/plain' });
    res.end('Not found');
});

server.listen(PORT, () => {
    console.log(`Dev proxy listening on http://localhost:${PORT}`);
});
