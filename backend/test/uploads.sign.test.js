const assert = require('assert');
const request = require('supertest');

describe('Uploads signing', () => {
    before(() => {
        // Ensure env for cloudinary signing exists
        process.env.CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY || 'test_api_key';
        process.env.CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET || 'test_api_secret';
        process.env.CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || 'test_cloud';

        // Clear cache to reload cloudinary helper with updated env
        delete require.cache[require.resolve('../src/utils/cloudinary')];
    });

    it('should generate upload signature via helper', () => {
        const { generateUploadSignature } = require('../src/utils/cloudinary');
        const sig = generateUploadSignature({ folder: 'absensi/uploads' });
        assert.ok(sig.signature, 'signature present');
        assert.ok(sig.timestamp, 'timestamp present');
        assert.equal(sig.api_key, process.env.CLOUDINARY_API_KEY);
        assert.equal(sig.cloud_name, process.env.CLOUDINARY_CLOUD_NAME);
    });

    it('should return signature from endpoint', async () => {
        // require fresh app
        const { app } = require('../src/index');
        const res = await request(app).get('/uploads/sign').expect(200);
        assert.ok(res.body.signature, 'signature present');
        assert.ok(res.body.timestamp, 'timestamp present');
        assert.equal(res.body.api_key, process.env.CLOUDINARY_API_KEY);
    });

    it('should return 503 when signing is not configured', async () => {
        // Clear cloudinary envs and reload
        process.env.CLOUDINARY_API_KEY = '';
        process.env.CLOUDINARY_API_SECRET = '';
        process.env.CLOUDINARY_CLOUD_NAME = '';
        delete require.cache[require.resolve('../src/utils/cloudinary')];
        // Also clear the uploads route so it will re-require the helper
        delete require.cache[require.resolve('../src/routes/uploads')];

        const { app } = require('../src/index');
        const res = await request(app).get('/uploads/sign').expect(503);
        assert.equal(res.body.message, 'Cloudinary is not configured');
    });
});