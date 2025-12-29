const { PrismaClient } = require('@prisma/client');
const attendanceService = require('../src/services/attendance.service');

(async () => {
  const prisma = new PrismaClient();
  try {
    const user = await prisma.users.findUnique({ where: { username: 'karyawan1' } });
    if (!user) {
      throw new Error('karyawan1 not found');
    }
    const res = await attendanceService.checkIn({ user, attendanceDate: new Date().toISOString(), location: 'field', photo: 'https://example.com/sample.jpg' });
    console.log('Created attendance:', res);
  } catch (e) {
    console.error('Error:', e.message || e);
    process.exit(2);
  } finally {
    await prisma.$disconnect();
  }
})();