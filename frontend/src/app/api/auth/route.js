export async function POST() {
    // Disabled — frontend uses backend endpoints directly per F2 rules
    return new Response(JSON.stringify({ error: 'disabled - use backend POST /auth/login' }), { status: 405, headers: { 'content-type': 'application/json' } });
}
