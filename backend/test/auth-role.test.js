const request = require('supertest');
const { app } = require('../src/index');
const assert = require('assert');

describe('Auth & RBAC', () => {
    it('karyawan cannot access admin-only endpoint', async () => {
        // login as karyawan1
        const loginRes = await request(app).post('/auth/login').send({ username: 'karyawan1', password: 'workerpass' });
        assert.equal(loginRes.status, 200, 'login should succeed');
        const token = loginRes.body.token;
        assert.ok(token, 'token should be present');

        const res = await request(app)
            .put('/attendance/some-id/correct')
            .set('Authorization', `Bearer ${token}`)
            .send({ field_name: 'status', after_value: 'HADIR', reason: 'test' });

        assert.equal(res.status, 403, 'should be forbidden for karyawan');
    });

    it('admin can reach admin-only endpoint (may return 404 if record missing)', async () => {
        const loginRes = await request(app).post('/auth/login').send({ username: 'admin', password: 'adminpass' });
        assert.equal(loginRes.status, 200, 'admin login should succeed');
        const token = loginRes.body.token;
        assert.ok(token);

        const res = await request(app)
            .put('/attendance/some-id/correct')
            .set('Authorization', `Bearer ${token}`)
            .send({ field_name: 'status', after_value: 'HADIR', reason: 'test' });

        // Admin should not be forbidden; expected 404 (not found) or 400 if validation fails
        assert.notEqual(res.status, 403, 'admin should not be forbidden');
    });
});
