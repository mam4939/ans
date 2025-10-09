// lib/firebaseClient.js — lazy client initialization to avoid server-side build-time errors.
// Usage: const { auth, db } = await getFirebaseClient();
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyCFu_OJ2VPzPOuSgFk8hab4yliMpJSfQMI",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "ansay-98396.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "ansay-98396",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "ansay-98396.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "903889726801",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:903889726801:web:9f436d355c05f1c8837770",
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
