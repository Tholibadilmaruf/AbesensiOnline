const assert = require('assert');

// Ensure environment is clean so uploader is not configured during this test
const originalEnv = { ...process.env };
process.env.CLOUDINARY_API_KEY = '';
process.env.CLOUDINARY_API_SECRET = '';
process.env.CLOUDINARY_CLOUD_NAME = '';
process.env.CLOUDINARY_URL = '';

// Clear module cache to reload cloudinary helper with cleared env
delete require.cache[require.resolve('../src/utils/cloudinary')];
const { uploadImage } = require('../src/utils/cloudinary');

describe('Cloudinary helper', () => {
    after(() => {
        // Restore env
        Object.assign(process.env, originalEnv);
    });

    it('throws when uploader not configured', async () => {
        try {
            await uploadImage('data:image/png;base64,abcd');
            assert.fail('should throw when uploader missing');
        } catch (e) {
            assert.equal(e.message, 'Cloudinary uploader is not configured');
        }
    });
});
