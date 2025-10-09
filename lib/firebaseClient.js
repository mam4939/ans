// lib/firebaseClient.js — lazy client initialization to avoid server-side build-time errors.
// Usage: const { auth, db } = await getFirebaseClient();
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "PASTE_API_KEY",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "PASTE_AUTH_DOMAIN",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "PASTE_PROJECT_ID",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "PASTE_STORAGE_BUCKET",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "PASTE_MESSAGING_SENDER_ID",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "PASTE_APP_ID",
};

let _initialized = false;
let _auth = null;
let _db = null;

export async function getFirebaseClient() {
  if (typeof window === 'undefined') return { auth: null, db: null }; // avoid SSR
  if (_initialized) return { auth: _auth, db: _db };
  const { initializeApp, getApps } = await import('firebase/app');
  const { getAuth } = await import('firebase/auth');
  const { getFirestore } = await import('firebase/firestore');
  if (!getApps().length) initializeApp(firebaseConfig);
  _auth = getAuth();
  _db = getFirestore();
  _initialized = true;
  return { auth: _auth, db: _db };
}
