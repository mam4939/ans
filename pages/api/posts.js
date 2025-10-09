import admin from '../../lib/firebaseAdmin.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!admin || !admin.firestore) return res.status(500).json({ error: 'Admin SDK not initialized' });
  const { text, image, tags } = req.body || {};
  if (!(text || image)) return res.status(400).json({ error: 'empty' });
  if (text && text.length > 5000) return res.status(400).json({ error: 'too_long' });
  try {
    const post = {
      text: text || '',
      image: image || null,
      tags: Array.isArray(tags) ? tags.slice(0,10) : [],
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      likesCount: 0,
      commentsCount: 0
    };
    const ref = await admin.firestore().collection('posts').add(post);
    res.json({ ok: true, id: ref.id });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'server error' });
  }
}
