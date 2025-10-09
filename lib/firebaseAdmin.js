// lib/firebaseAdmin.js - server-side only. Loads service account from env (recommended) or local json file (dev).
import admin from "firebase-admin";
import fs from "fs";
import path from "path";

let serviceAccount = null;

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  try {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  } catch (e) {
    console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT env:", e);
  }
}

if (!serviceAccount) {
  const p = path.join(process.cwd(), "serviceAccountKey.json");
  if (fs.existsSync(p)) {
    try {
      serviceAccount = JSON.parse(fs.readFileSync(p, "utf8"));
      console.log("Loaded local serviceAccountKey.json (dev).");
    } catch (e) {
      console.error("Failed to read serviceAccountKey.json:", e);
    }
  }
}

if (!admin.apps.length) {
  if (serviceAccount) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log("Firebase Admin initialized.");
  } else {
    console.warn("FIREBASE_SERVICE_ACCOUNT not provided — admin features disabled.");
  }
}

export default admin;
