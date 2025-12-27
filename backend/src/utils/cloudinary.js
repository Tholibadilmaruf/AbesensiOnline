const logger = require('./logger');
let cloudinary;
let uploader;

try {
    const cloudinaryPkg = require('cloudinary');
    cloudinary = cloudinaryPkg.v2 || cloudinaryPkg;

    // Prefer CLOUDINARY_URL but allow explicit vars
    if (process.env.CLOUDINARY_URL) {
        cloudinary.config({ url: process.env.CLOUDINARY_URL });
    } else if (process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET && process.env.CLOUDINARY_CLOUD_NAME) {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });
    }

    uploader = cloudinary.uploader;
} catch (e) {
    // cloudinary package not installed or config error
    logger.warn('Cloudinary not configured or package missing');
}

async function uploadImage(data, opts = {}) {
    if (!uploader) {
        const err = new Error('Cloudinary uploader is not configured');
        err.status = 500;
        throw err;
    }

    // Accept data URLs, remote URLs, file paths, or base64 string
    // For base64 payloads ensure they are prefixed like: data:image/png;base64,...
    try {
        // Request an optimized full image + an eager thumbnail
        const uploadOpts = Object.assign({}, opts, {
            transformation: opts.transformation || [{ width: 1280, crop: 'limit', quality: 'auto' }],
            eager: opts.eager || [{ width: 400, crop: 'scale', quality: 'auto' }],
            resource_type: 'image',
        });

        const res = await uploader.upload(data, uploadOpts);

        // Cloudinary returns main url in `secure_url` and eager transforms in `eager` array
        const url = res.secure_url || res.url || null;
        const thumb = (res.eager && res.eager[0] && (res.eager[0].secure_url || res.eager[0].url)) || url;

        const meta = {
            width: res.width || null,
            height: res.height || null,
            bytes: res.bytes || null,
            format: res.format || null,
        };

        return { url, thumb, meta };
    } catch (e) {
        logger.error('Cloudinary upload failed', e);
        const err = new Error('Image upload failed');
        err.status = 500;
        throw err;
    }
}

function generateUploadSignature(params = {}) {
    // Ensure cloudinary is both installed and configured
    const configured = cloudinary && (process.env.CLOUDINARY_URL || (process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET && process.env.CLOUDINARY_CLOUD_NAME));
    const hasSigner = cloudinary && cloudinary.utils && typeof cloudinary.utils.api_sign_request === 'function';
    if (!configured || !hasSigner) {
        const err = new Error('Cloudinary is not configured');
        // Service unavailable for signing when uploader is not configured
        err.status = 503;
        throw err;
    }

    // Cloudinary expects a unix timestamp
    const timestamp = Math.floor(Date.now() / 1000);
    const toSign = Object.assign({}, params, { timestamp });

    // Use utils.api_sign_request to produce signature
    const signature = cloudinary.utils.api_sign_request(toSign, process.env.CLOUDINARY_API_SECRET);

    return {
        signature,
        timestamp,
        api_key: process.env.CLOUDINARY_API_KEY,
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    };
}

module.exports = { uploadImage, generateUploadSignature };