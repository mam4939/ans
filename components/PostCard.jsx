// components/PostCard.jsx
import React, { useEffect, useState } from "react";

export default function PostCard() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/posts");
        if (!res.ok) throw new Error(`Ошибка: ${res.status}`);
        const data = await res.json();
        setPosts(data);
      } catch (err) {
        console.error("Ошибка при загрузке постов:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p style={{ color: "red" }}>Ошибка: {error}</p>;

  return (
    <div className="post-feed" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {posts.length === 0 ? (
        <p>Пока нет публикаций 😢</p>
      ) : (
        posts.map((post) => (
          <div
            key={post.id}
            className="post-card"
            style={{
              background: "#fff",
              borderRadius: "12px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
              padding: "12px",
              maxWidth: "500px",
              margin: "0 auto",
            }}
          >
            {post.imageUrl && (
              <img
                src={post.imageUrl}
                alt="Post"
                style={{
                  width: "100%",
                  borderRadius: "8px",
                  marginBottom: "8px",
                }}
              />
            )}
            <p style={{ fontSize: "16px", margin: "8px 0" }}>{post.text}</p>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "8px",
                color: "#777",
                fontSize: "14px",
              }}
            >
              <span>
                {post.createdAt?.seconds
                  ? new Date(post.createdAt.seconds * 1000).toLocaleString()
                  : "—"}
              </span>
              <button
                onClick={() => handleLike(post.id)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#e91e63",
                  fontSize: "16px",
                }}
              >
                ❤️ {post.likes || 0}
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

// Лайк по устройству
async function handleLike(postId) {
  try {
    const deviceId = getDeviceId();
    const res = await fetch("/api/like", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId, deviceId }),
    });

    const data = await res.json();
    if (!data.success) {
      console.warn("Ошибка при лайке:", data.error);
    }
  } catch (e) {
    console.error("Ошибка при отправке лайка:", e);
  }
}

function getDeviceId() {
  const key = "device_id";
  let id = localStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(key, id);
  }
  return id;
}
