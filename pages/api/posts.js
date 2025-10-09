// pages/api/posts.js
import { adminDb } from "../../lib/firebaseAdmin";

export default async function handler(req, res) {
  try {
    if (req.method === "POST") {
      const { text, imageUrl } = req.body;

      if (!text) {
        return res.status(400).json({ error: "Текст обязателен" });
      }

      const doc = await adminDb.collection("posts").add({
        text,
        imageUrl: imageUrl || null,
        createdAt: new Date(),
      });

      return res.status(200).json({ id: doc.id, success: true });
    }

    if (req.method === "GET") {
      const snapshot = await adminDb
        .collection("posts")
        .orderBy("createdAt", "desc")
        .get();

      const posts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return res.status(200).json(posts);
    }

    return res.status(405).json({ error: "Метод не поддерживается" });
  } catch (error) {
    console.error("🔥 Ошибка API /posts:", error);
    return res.status(500).json({ error: error.message });
  }
}
