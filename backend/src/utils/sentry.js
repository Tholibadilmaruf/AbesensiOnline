// Minimal Sentry placeholder integration. Install @sentry/node and set SENTRY_DSN in production to enable.
let Sentry;
let enabled = false;
try {
    if (process.env.SENTRY_DSN) {
        Sentry = require('@sentry/node');
        Sentry.init({ dsn: process.env.SENTRY_DSN });
        enabled = true;
    }
} catch (e) {
    // Sentry not installed or not configured; keep disabled
}

module.exports = {
    captureException: (err) => {
        if (enabled && Sentry) {
            Sentry.captureException(err);
        }
    }
};