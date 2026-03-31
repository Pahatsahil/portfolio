import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
const senderId = import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID;
const appId = import.meta.env.VITE_FIREBASE_APP_ID;
const measurementId = import.meta.env.VITE_MEASUREMENT_ID;

export const firebaseConfig = {
  apiKey,
  authDomain: projectId + ".firebaseapp.com",
  projectId,
  storageBucket: projectId + ".firebasestorage.app",
  messagingSenderId: senderId,
  appId,
  measurementId,
};

let app: ReturnType<typeof initializeApp>;
let auth: ReturnType<typeof getAuth>;
let db: ReturnType<typeof getFirestore>;
let storage: ReturnType<typeof getStorage>;
let analytics: ReturnType<typeof getAnalytics> | undefined;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
  if (typeof window !== "undefined") {
    analytics = getAnalytics(app);
  }
} catch (error) {
  console.error("Firebase initialization error:", error);
}

export { app, auth, db, storage, analytics };

// Firestore collection names
export const COLLECTIONS = {
  PROFILE: "profile",
  EXPERIENCE: "experience",
  PROJECTS: "projects",
  SKILLS: "skills",
  SOCIAL: "social",
  CONTACT: "contact",
  RESUME_SETTINGS: "resumeSettings",
};
