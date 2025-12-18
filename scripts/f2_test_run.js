const fs = require('fs');
const { exec } = require('child_process');

exec('node scripts/f2_test.js', { env: process.env, maxBuffer: 10 * 1024 * 1024 }, (err, stdout, stderr) => {
    const out = { err: err ? String(err) : null, stdout: stdout || null, stderr: stderr || null, timestamp: new Date().toISOString() };
    fs.writeFileSync('scripts/f2_test_result.json', JSON.stringify(out, null, 2));
    console.log('Wrote scripts/f2_test_result.json');
});
