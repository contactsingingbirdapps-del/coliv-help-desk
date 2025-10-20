import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, type User as FirebaseUser } from "firebase/auth";
import { getFirestore, initializeFirestore } from "firebase/firestore";

// Firebase configuration via Vite env vars (NO FALLBACKS for security)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string,
  appId: import.meta.env.VITE_FIREBASE_APP_ID as string,
};

// Basic runtime validation (non-sensitive booleans)
const missing = Object.entries(firebaseConfig)
  .filter(([, v]) => !v)
  .map(([k]) => k);
if (missing.length) {
  // Firebase config missing keys - will be handled by error boundaries
}

// Initialize Firebase with error handling
let app: any;
let auth: any;
let db: any;

try {
  app = initializeApp(firebaseConfig);
  
  // Auth & Firestore
  auth = getAuth(app);
  
  // Auto-detect long-polling to avoid proxy/CORP issues without forcing it everywhere
  initializeFirestore(app, { experimentalAutoDetectLongPolling: true });
  db = getFirestore(app);
} catch (error) {
  // Create mock objects to prevent crashes
  auth = null;
  db = null;
}

// Only export auth for authentication
// DB is NOT exported - all data access must go through backend API
export { auth };

// Re-export type for convenience
export type { FirebaseUser };


