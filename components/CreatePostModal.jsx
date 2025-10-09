import React, { useState } from "react";

export default function CreatePost() {
  const [text, setText] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    setLoading(true);
    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, imageUrl }),
    });

    const data = await res.json();
    setLoading(false);

    if (data.success) {
      setText("");
      setImageUrl("");
      setMessage("✅ Пост опубликован!");
    } else {
      setMessage("❌ Ошибка: " + (data.error || "неизвестная"));
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Что у тебя нового?"
          required
        />
        <input
          type="text"
          placeholder="Ссылка на изображение (необязательно)"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Публикую..." : "Опубликовать"}
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
