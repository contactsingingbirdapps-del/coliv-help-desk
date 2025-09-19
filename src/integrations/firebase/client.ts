import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, type User as FirebaseUser } from "firebase/auth";
import { getFirestore, initializeFirestore } from "firebase/firestore";

// Firebase configuration via Vite env vars with fallbacks
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string || "AIzaSyD2wG7O9LuceFRBbvr9mFVKu62OYFclxEE",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string || "coliv-management-help-desk.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string || "coliv-management-help-desk",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string || "coliv-management-help-desk.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string || "1022591558108",
  appId: import.meta.env.VITE_FIREBASE_APP_ID as string || "1:1022591558108:android:30ca8e172043b2b49daf19",
};

// Basic runtime validation (non-sensitive booleans)
const missing = Object.entries(firebaseConfig)
  .filter(([, v]) => !v)
  .map(([k]) => k);
if (missing.length) {
  // eslint-disable-next-line no-console
  console.warn("Firebase config missing keys:", missing.join(", "));
} else {
  console.log("✅ Firebase configuration loaded successfully");
}

// Initialize Firebase with error handling
let app: any;
let auth: any;
let db: any;

try {
  app = initializeApp(firebaseConfig);
  console.log("✅ Firebase app initialized successfully");
  
  // Auth & Firestore
  auth = getAuth(app);
  console.log("✅ Firebase Auth initialized successfully");
  
  // Auto-detect long-polling to avoid proxy/CORP issues without forcing it everywhere
  initializeFirestore(app, { experimentalAutoDetectLongPolling: true });
  db = getFirestore(app);
  console.log("✅ Firestore initialized successfully");
} catch (error) {
  console.error("❌ Firebase initialization failed:", error);
  // Create mock objects to prevent crashes
  auth = null;
  db = null;
}

export { auth, db };

// Re-export type for convenience
export type { FirebaseUser };


