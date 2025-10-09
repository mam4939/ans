import admin from '../../lib/firebaseAdmin.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!admin || !admin.firestore) return res.status(500).json({ error: 'Admin SDK not initialized' });
  const { postId, deviceId, action } = req.body || {};
  if (!postId || !deviceId) return res.status(400).json({ error: 'missing' });
  const db = admin.firestore();
  const likeRef = db.collection('posts').doc(postId).collection('likes').doc(deviceId);
  const postRef = db.collection('posts').doc(postId);
  try {
    await db.runTransaction(async tx => {
      const likeDoc = await tx.get(likeRef);
      if (action === 'like') {
        if (likeDoc.exists) throw new Error('already liked');
        tx.set(likeRef, { createdAt: admin.firestore.FieldValue.serverTimestamp() });
        tx.update(postRef, { likesCount: admin.firestore.FieldValue.increment(1) });
      } else {
        if (!likeDoc.exists) throw new Error('not liked');
        tx.delete(likeRef);
        tx.update(postRef, { likesCount: admin.firestore.FieldValue.increment(-1) });
      }
    });
    const snapshot = await db.collection('posts').doc(postId).get();
    const likesCount = snapshot.exists ? (snapshot.data().likesCount || 0) : 0;
    res.json({ ok: true, likesCount });
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: e.message });
  }
}
