import cloudinary from '../../lib/cloudinary.js';
import crypto from 'crypto';

export default function handler(req, res) {
  try {
    const cfg = cloudinary.config();
    if (!cfg.api_key || !cfg.api_secret) return res.status(500).json({ error: 'Cloudinary not configured' });
    const timestamp = Math.floor(Date.now() / 1000);
    const signature = crypto.createHash('sha1').update('timestamp=' + timestamp + cfg.api_secret).digest('hex');
    res.status(200).json({ signature, timestamp, api_key: cfg.api_key, cloud_name: cfg.cloud_name });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'server error' });
  }
}
