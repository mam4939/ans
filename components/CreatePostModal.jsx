import { useState } from 'react';

export default function CreatePostModal({ onClose }) {
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  async function submit() {
    if (!text.trim() && !file) return alert('Пожалуйста, напишите текст или добавьте фото');
    setLoading(true);
    try {
      let imageUrl = null;
      if (file) {
        const sign = await fetch('/api/cloudinary-sign').then(r=>r.json());
        if (!sign || sign.error) throw new Error(sign?.error || 'sign failed');
        const form = new FormData();
        form.append('file', file);
        form.append('api_key', sign.api_key);
        form.append('timestamp', sign.timestamp);
        form.append('signature', sign.signature);
        const res = await fetch(`https://api.cloudinary.com/v1_1/${sign.cloud_name}/auto/upload`, { method: 'POST', body: form });
        const j = await res.json();
        if (!j.secure_url) throw new Error('upload failed');
        imageUrl = j.secure_url;
      }

      const postRes = await fetch('/api/posts', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ text, image: imageUrl, tags: [] })
      });
      const pj = await postRes.json();
      if (pj.ok) {
        alert('Пост опубликован');
        onClose();
      } else {
        alert('Ошибка: ' + (pj.error || 'unknown'));
      }
    } catch (e) {
      console.error(e);
      alert('Ошибка при публикации');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal" role="dialog" aria-modal="true">
      <div className="sheet">
        <header className="sheet-head">
          <strong>Новый пост</strong>
          <button onClick={onClose} className="close">✕</button>
        </header>
        <textarea value={text} onChange={e=>setText(e.target.value)} placeholder="О чём думаешь?" />
        <div className="actions">
          <input type="file" accept="image/*" onChange={e=>setFile(e.target.files[0])} />
          <button className="btn" onClick={submit} disabled={loading}>{loading ? 'Отправка...' : 'Опубликовать'}</button>
        </div>
      </div>

      <style jsx>{`
        .modal{position:fixed;inset:0;background:rgba(0,0,0,0.6);display:flex;align-items:flex-end;justify-content:center;padding:16px}
        .sheet{width:100%;max-width:720px;background:var(--card);border-radius:12px;padding:12px}
        textarea{width:100%;min-height:120px;background:#080808;border:1px solid #222;color:#fff;padding:12px;border-radius:8px;margin-top:8px}
        .actions{display:flex;gap:8px;align-items:center;margin-top:10px}
        .close{background:transparent;border:none;color:#fff;font-size:18px}
      `}</style>
    </div>
  );
}
