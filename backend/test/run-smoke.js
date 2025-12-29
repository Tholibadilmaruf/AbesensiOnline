const { execSync } = require('child_process');

function run(cmd) {
  console.log('\n> ' + cmd);
  try {
    const out = execSync(cmd, { stdio: 'inherit' });
    return { ok: true };
  } catch (e) {
    console.error('Command failed:', cmd);
    return { ok: false, error: e };
  }
}

(async () => {
  console.log('Running smoke checks...');
  let r;

  r = run('node test/db-connection.js');
  if (!r.ok) process.exit(2);

  r = run('node test/verify-attendance-columns.js');
  if (!r.ok) process.exit(3);

  r = run('node test/create-attendance.js');
  if (!r.ok) process.exit(4);

  console.log('\nSmoke checks passed');
})();