import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, type User as FirebaseUser } from "firebase/auth";
import { getFirestore, initializeFirestore } from "firebase/firestore";

// Firebase configuration via Vite env vars
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string,
  appId: import.meta.env.VITE_FIREBASE_APP_ID as string,
};
console.log(firebaseConfig);

// Basic runtime validation (non-sensitive booleans)
const missing = Object.entries(firebaseConfig)
  .filter(([, v]) => !v)
  .map(([k]) => k);
if (missing.length) {
  // eslint-disable-next-line no-console
  console.warn("Firebase config missing keys:", missing.join(", "));
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Auth & Firestore
export const auth = getAuth(app);
// Auto-detect long-polling to avoid proxy/CORP issues without forcing it everywhere
initializeFirestore(app, { experimentalAutoDetectLongPolling: true });
export const db = getFirestore(app);

// Re-export type for convenience
export type { FirebaseUser };


