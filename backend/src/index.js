require('dotenv').config();
process.on('uncaughtException', (err) => { console.error('uncaughtException', err); process.exit(1); });
process.on('unhandledRejection', (err) => { console.error('unhandledRejection', err); });
const express = require('express');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

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

app.get('/', (req, res) => res.json({ ok: true, service: 'absensi-backend' }));

const PORT = process.env.PORT || 3009;
app.listen(PORT, () => {
    console.log(`🚀 Backend running at http://localhost:${PORT}`);
});
