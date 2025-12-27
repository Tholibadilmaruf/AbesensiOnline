require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { PrismaClient } = require('@prisma/client');
const logger = require('./utils/logger');

if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
    logger.error('Missing required env: JWT_SECRET');
    // Do not exit process automatically; we just log the critical issue so deployment tooling can act
}

const app = express();
const prisma = new PrismaClient();

// Security middlewares
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json({ limit: '10kb' }));

// Basic rate limiter (tunable)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: Number(process.env.RATE_LIMIT_MAX) || 100,
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(limiter);

// Auth routes (login/logout)
const authRoutes = require('./auth');
app.use('/auth', authRoutes(prisma));

// Attach auth middleware globally so `req.user` is available for RBAC middlewares
const authMiddleware = require('./auth/auth.middleware');
app.use(authMiddleware);

// Mount attendance routes (example integration)
const attendanceRoutesFactory = require('./routes/attendance');
const assertAuthenticated = require('./middlewares/assertAuthenticated');
const requireRole = require('./middlewares/requireRole');
const requireAnyRole = require('./middlewares/requireAnyRole');
const assertPayrollUnlocked = require('./guards/assertPayrollUnlocked');

app.use(
    '/attendance',
    attendanceRoutesFactory(prisma, { assertAuthenticated, requireRole, requireAnyRole, assertPayrollUnlocked })
);

// Mount attendance correction routes (contains /attendance/:id/correct)
const attendanceCorrectionRoutes = require('./routes/attendanceCorrection.routes');
app.use('/', attendanceCorrectionRoutes);

// Mount uploads routes (client-side signed uploads for Cloudinary)
const uploadsRoutes = require('./routes/uploads');
app.use('/uploads', uploadsRoutes(prisma));

// Health & readiness endpoints
app.get('/healthz', (req, res) => res.status(200).json({ ok: true }));
app.get('/ready', async (req, res) => {
    try {
        await prisma.$queryRaw`SELECT 1`;
        return res.status(200).json({ ok: true, db: 'connected' });
    } catch (e) {
        logger.error('Readiness check failed', e);
        return res.status(503).json({ ok: false, db: 'unavailable' });
    }
});

app.get('/', (req, res) => res.json({ ok: true, service: 'absensi-backend' }));

const Sentry = require('./utils/sentry');

// Catch process-level errors and report
process.on('unhandledRejection', (reason) => {
    logger.error('Unhandled Rejection', reason);
    Sentry.captureException(reason, false);
    // Do not exit immediately in container environments; allow graceful shutdown if orchestrator handles it
});

process.on('uncaughtException', (err) => {
    logger.error('Uncaught Exception', err);
    Sentry.captureException(err, false);
    // Uncaught exceptions are fatal by default; exit after flush (if applicable)
    setTimeout(() => process.exit(1), 1000);
});

// Centralized error handler
app.use((err, req, res, next) => {
    logger.error('Unhandled error', err);
    Sentry.captureException(err);
    return res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

const port = process.env.PORT || 3000;
let server;
async function shutdown(code = 0) {
    try {
        logger.info('Shutting down server...');
        if (server && server.close) {
            server.close();
        }
        await prisma.$disconnect();
        logger.info('Shutdown complete');
    } catch (e) {
        logger.error('Error during shutdown', e);
    } finally {
        process.exit(code);
    }
}

if (require.main === module) {
    server = app.listen(port, () => {
        logger.info(`Server listening on port ${port}`);
    });

    process.on('SIGTERM', () => shutdown(0));
    process.on('SIGINT', () => shutdown(0));
}

module.exports = { app, prisma };
