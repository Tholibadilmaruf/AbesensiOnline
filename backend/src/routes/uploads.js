const express = require('express');

module.exports = (prisma) => {
    const router = express.Router();
    const { generateUploadSignature } = require('../utils/cloudinary');

    // GET /uploads/sign?folder=...&public_id=...
    // Returns signature, timestamp and api_key for direct client uploads
    router.get('/sign', (req, res, next) => {
        try {
            const { folder, public_id } = req.query;
            const payload = {};
            if (folder) payload.folder = folder;
            if (public_id) payload.public_id = public_id;

            const sig = generateUploadSignature(payload);
            return res.json(sig);
        } catch (e) {
            return next(e);
        }
    });

    return router;
};