// lib/firebaseClient.js
import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCFu_OJ2VPzPOuSgFk8hab4yliMpJSfQMI",
  authDomain: "ansay-98396.firebaseapp.com",
  projectId: "ansay-98396",
  storageBucket: "ansay-98396.appspot.com",
  messagingSenderId: "903889726801",
  appId: "1:903889726801:web:9f436d355c05f1c8837770",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export default app;
