import { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import PostCard from '../components/PostCard';
const CreatePostModal = dynamic(() => import('../components/CreatePostModal'), { ssr: false });

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const unsubRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const client = await import('../lib/firebaseClient').then(m => m.getFirebaseClient());
      if (!client.db) {
        setLoading(false);
        return;
      }
      const { collection, query, orderBy, onSnapshot, limit } = await import('firebase/firestore');
      const q = query(collection(client.db, 'posts'), orderBy('createdAt', 'desc'), limit(50));
      unsubRef.current = onSnapshot(q, snap => {
        const arr = [];
        snap.forEach(d => {
          const data = d.data();
          arr.push({ id: d.id, ...data, createdAt: data.createdAt?.toMillis?.() || null });
        });
        if (mounted) {
          setPosts(arr);
          setLoading(false);
        }
      }, err => {
        console.error('snapshot error', err);
        setLoading(false);
      });
    })();
    return () => {
      mounted = false;
      if (unsubRef.current) unsubRef.current();
    };
  }, []);

  return (
    <main className="page mobile-feed">
      <header className="topbar">
        <div className="brand">ANS</div>
      </header>

      <section className="snap-list">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => <div key={i} className="card skeleton" />)
        ) : posts.length ? (
          posts.map(p => <PostCard key={p.id} post={p} />)
        ) : (
          <div className="empty">Лента пуста. Добавь первое сообщение!</div>
        )}
      </section>

      <button className="fab" aria-label="Добавить пост" onClick={() => setShowCreate(true)}>+</button>

      {showCreate && <CreatePostModal onClose={() => setShowCreate(false)} />}

      <style jsx>{`
        .topbar{height:56px;display:flex;align-items:center;justify-content:center}
        .brand{font-weight:700}
        .snap-list{height:calc(100vh - 76px);overflow-y:auto;scroll-snap-type:y mandatory;padding:8px}
        .empty{padding:24px;text-align:center;color:var(--muted)}
        .fab{position:fixed;left:14px;bottom:18px;width:56px;height:56px;border-radius:999px;background:#111;color:#fff;border:none;font-size:28px;box-shadow:0 6px 18px rgba(0,0,0,0.6)}
      `}</style>
    </main>
  );
}
