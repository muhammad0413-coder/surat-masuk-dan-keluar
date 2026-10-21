import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics, isSupported } from 'firebase/analytics';

// Configuration loaded from Vite environment variables with project fallbacks
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyBTs9JSm4mCrZMt6b3A8Flvd3JthVFC5fM',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'surat-4cee8.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'surat-4cee8',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'surat-4cee8.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '314803998850',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:314803998850:web:69366f1f75ac17b7f3249b',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-BXYXLQ75CH'
};

// Validate that required Firebase configuration exists
const requiredKeys = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID'
];

for (const key of requiredKeys) {
  if (!import.meta.env[key]) {
    console.warn(`[Firebase] Missing environment variable: ${key}. Check your .env.local file.`);
  }
}

// Initialize single shared Firebase App instance
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Initialize optional Analytics safely without breaking in non-browser or unsupported environments
export let analytics = null;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported && firebaseConfig.measurementId) {
      analytics = getAnalytics(app);
    }
  }).catch((err) => {
    console.info('[Firebase Analytics] Not initialized:', err.message);
  });
}

export default app;
