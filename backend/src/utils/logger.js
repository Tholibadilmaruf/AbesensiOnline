const isProd = process.env.NODE_ENV === 'production';

function error(...args) {
    if (isProd) {
        // In production, log a concise message
        const first = args[0];
        if (first instanceof Error) {
            console.error(first.message);
        } else {
            console.error(String(first));
        }
    } else {
        // In development, log full error for debugging
        console.error(...args);
    }
}

function info(...args) {
    console.log(...args);
}

function warn(...args) {
    console.warn(...args);
}

module.exports = {
    error,
    info,
    warn,
};