export async function POST(req) {
    try {
        const body = await req.json();
        // Forward Authorization header from client to backend
        const auth = req.headers.get('authorization');
        if (!auth) {
            return new Response(JSON.stringify({ error: 'missing authorization' }), { status: 401, headers: { 'content-type': 'application/json' } });
        }

        const res = await fetch('http://localhost:3009/attendance/check-in', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: auth,
            },
            body: JSON.stringify(body),
        });

        const text = await res.text();
        const headers = { 'content-type': res.headers.get('content-type') || 'application/json' };
        return new Response(text, { status: res.status, headers });
    } catch (err) {
        return new Response(JSON.stringify({ error: 'proxy error', detail: String(err) }), { status: 500, headers: { 'content-type': 'application/json' } });
    }
}
