const { PrismaClient } = require('@prisma/client');
(async () => {
    const prisma = new PrismaClient();
    try {
        console.log('Connecting to DB...');
        const res = await prisma.$queryRaw`SELECT 1 as ok`;
        console.log('DB response:', res);
        const users = await prisma.users.findMany({ take: 3 });
        console.log('Sample users:', users.map(u => ({ username: u.username, role: u.role })));
    } catch (e) {
        console.error('DB connection/error:', e.message || e);
        process.exit(2);
    } finally {
        await prisma.$disconnect();
    }
})();