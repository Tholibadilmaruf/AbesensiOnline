const { PrismaClient } = require('@prisma/client');
(async () => {
  const p = new PrismaClient();
  try {
    const cols = await p.$queryRaw`SELECT column_name, data_type FROM information_schema.columns WHERE table_name='attendance' ORDER BY ordinal_position`;
    console.log(JSON.stringify(cols, null, 2));
  } catch (e) {
    console.error('DB error:', e.message || e);
    process.exit(2);
  } finally {
    await p.$disconnect();
  }
})();