import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";
// import.meta.env;

// const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
// const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
// const senderId = import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID;
// const appId = import.meta.env.VITE_FIREBASE_APP_ID;
// const measurementId = import.meta.env.VITE_MEASUREMENT_ID;

// export const firebaseConfig = {
//   apiKey,
//   authDomain: projectId + ".firebaseapp.com",
//   projectId,
//   storageBucket: projectId + ".firebasestorage.app",
//   messagingSenderId: senderId,
//   appId,
//   measurementId,
// };

export const firebaseConfig = {
  apiKey: "AIzaSyAMFc1j5Ewblnw8OGrMb1HJzl9nPEP9YCk",
  authDomain: "portfolio-49755.firebaseapp.com",
  projectId: "portfolio-49755",
  storageBucket: "portfolio-49755.firebasestorage.app",
  messagingSenderId: "1098558436808",
  appId: "1:1098558436808:web:c51c26d8b14e9ab45a3cfd",
  measurementId: "G-E1E2ES8QGY"
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
