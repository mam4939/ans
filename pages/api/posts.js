import admin from "../../lib/firebaseAdmin";
import { getFirestore } from "firebase-admin/firestore";

const db = getFirestore();

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { text, imageUrl, deviceId } = JSON.parse(req.body);
      const docRef = await db.collection("posts").add({
        text,
        imageUrl,
        deviceId,
        createdAt: new Date(),
      });
      return res.status(200).json({ id: docRef.id });
    } catch (e) {
      console.error("Ошибка при публикации:", e);
      return res.status(500).json({ error: e.message });
    }
  }

  if (req.method === "GET") {
    try {
      const snapshot = await db.collection("posts").orderBy("createdAt", "desc").get();
      const posts = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      return res.status(200).json(posts);
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  return res.status(405).end(); // Метод не поддерживается
}
