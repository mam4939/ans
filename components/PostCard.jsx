import { useState } from 'react';
import { getDeviceId } from '../utils/device';

export default function PostCard({ post }) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(post.likesCount || 0);

  async function toggleLike() {
    const deviceId = getDeviceId();
    if (!deviceId) return alert('Невозможно получить идентификатор устройства');
    try {
      const action = liked ? 'unlike' : 'like';
      const res = await fetch('/api/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId: post.id, deviceId, action })
      });
      const j = await res.json();
      if (j.ok) {
        setLiked(!liked);
        setLikes(j.likesCount !== undefined ? j.likesCount : (liked ? likes - 1 : likes + 1));
      } else {
        alert('Ошибка: ' + (j.error || 'unknown'));
      }
    } catch (e) {
      console.error(e);
      alert('Ошибка связи');
    }
  }

  return (
    <article className="post" style={{ scrollSnapAlign: 'start' }}>
      <div className="post-inner">
        <header className="post-head">
          <div className="avatar" />
          <div className="meta">
            <div className="name">Аноним</div>
            <div className="time">{post.createdAt ? new Date(post.createdAt).toLocaleString() : ''}</div>
          </div>
        </header>

        {post.image ? (
          <div className="media-wrap"><img src={post.image} alt="" className="media" /></div>
        ) : null}

        <div className="body">{post.text}</div>

        <footer className="post-footer">
          <button className={`iconbtn ${liked ? 'active' : ''}`} onClick={toggleLike}>❤️ {likes}</button>
          <button className="iconbtn">💬 {post.commentsCount || 0}</button>
        </footer>
      </div>

      <style jsx>{`
        .post{padding:12px;margin:12px 8px;border-radius:14px;background:var(--card);min-height:60vh;display:flex;flex-direction:column;gap:12px;box-shadow:0 6px 18px rgba(0,0,0,0.6);}
        .post-head{display:flex;gap:10px;align-items:center}
        .avatar{width:44px;height:44px;border-radius:50%;background:#222}
        .meta{display:flex;flex-direction:column}
        .name{font-weight:600}
        .media{width:100%;height:45vh;object-fit:cover;border-radius:8px}
        .body{padding-top:8px;color:#ddd;line-height:1.4;white-space:pre-wrap}
        .post-footer{display:flex;gap:8px;align-items:center}
        .iconbtn{background:transparent;border:none;color:#fff;padding:8px;border-radius:8px;font-size:18px;cursor:pointer}
        .iconbtn.active{color:var(--accent-2);transform:scale(1.05)}
      `}</style>
    </article>
  );
}
