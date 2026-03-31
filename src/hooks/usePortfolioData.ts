import { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc,
  addDoc,
  onSnapshot,
} from "firebase/firestore";
import { firebaseConfig, COLLECTIONS } from "../lib/firebase";

export interface Education {
  id: string;
  degree: string;
  institution: string;
  year: string;
  grade?: string;
  order?: number;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  year: string;
  url?: string;
  order?: number;
}
import { getAnalytics } from "firebase/analytics";

// Initialize Firebase (only once)
let db: ReturnType<typeof getFirestore> | null = null;

const getDb = () => {
  if (!db) {
    try {
      const app = initializeApp(firebaseConfig);
      const analytics = getAnalytics(app);
      db = getFirestore(app);
    } catch (error) {
      console.error("Firebase initialization error:", error);
      return null;
    }
  }
  return db;
};

// Types
export interface Profile {
  name: string;
  title: string;
  subtitle: string;
  bio: string;
  resumeUrl: string;
  photoUrl?: string;
  showPhoto?: boolean;
  aboutStats?: { number: string; label: string }[];
  aboutHighlights?: string[];
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  period: string;
  highlights: string[];
  order?: number;
}

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  tech: string[];
  platform: string;
  color: string;
  githubUrl?: string;
  playStoreUrl?: string;
  appStoreUrl?: string;
  imageUrl?: string;
  visible?: boolean;
  order?: number;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  icon?: string;
}

export interface Social {
  id: string;
  platform: string;
  url: string;
  icon: string;
}

export interface ContactConfig {
  email: string;
  phone: string;
  showPhone: boolean;
  showEmail: boolean;
}

// Hook to fetch profile
export const useProfile = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const firestore = getDb();
        if (!firestore) {
          // Use default profile if Firebase is not configured
          setProfile({
            name: "",
            title: "",
            subtitle: "",
            bio: "",
            resumeUrl: "",
          });
          setLoading(false);
          return;
        }

        const docRef = doc(firestore, COLLECTIONS.PROFILE, "main");
        const docSnap = await getDoc(docRef);
        console.log("Doc data:", docSnap.data());
        if (docSnap.exists()) {
          setProfile(docSnap.data() as Profile);
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return { profile, loading, error };
};

// Hook to fetch experience
export const useExperience = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExperience = async () => {
      try {
        const firestore = getDb();
        if (!firestore) {
          // Default experience data
          setExperiences([]);
          setLoading(false);
          return;
        }

        const querySnapshot = await getDocs(
          collection(firestore, COLLECTIONS.EXPERIENCE),
        );
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Experience[];
        data.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
        setExperiences(data);
      } catch (err) {
        console.error("Error fetching experience:", err);
        setError("Failed to load experience");
      } finally {
        setLoading(false);
      }
    };

    fetchExperience();
  }, []);

  return { experiences, loading, error };
};

// Hook to fetch projects
export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const firestore = getDb();
        if (!firestore) {
          // Default projects data
          setProjects([]);
          setLoading(false);
          return;
        }

        const querySnapshot = await getDocs(
          collection(firestore, COLLECTIONS.PROJECTS),
        );
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Project[];
        data.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
        setProjects(data);
      } catch (err) {
        console.error("Error fetching projects:", err);
        setError("Failed to load projects");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return { projects, loading, error };
};

// Hook to fetch skills
export const useSkills = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const firestore = getDb();
        if (!firestore) {
          // Default skills data
          setSkills([]);
          setLoading(false);
          return;
        }

        const querySnapshot = await getDocs(
          collection(firestore, COLLECTIONS.SKILLS),
        );
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Skill[];
        setSkills(data);
      } catch (err) {
        console.error("Error fetching skills:", err);
        setError("Failed to load skills");
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  return { skills, loading, error };
};

// Hook to fetch social links
export const useSocial = () => {
  const [socials, setSocials] = useState<Social[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSocial = async () => {
      try {
        const firestore = getDb();
        if (!firestore) {
          // Default social data
          setSocials([
            {
              id: "1",
              platform: "LinkedIn",
              url: "",
              icon: "linkedin",
            },
            {
              id: "2",
              platform: "GitHub",
              url: "",
              icon: "github",
            },
            {
              id: "3",
              platform: "Email",
              url: "",
              icon: "mail",
            },
          ]);
          setLoading(false);
          return;
        }

        const querySnapshot = await getDocs(
          collection(firestore, COLLECTIONS.SOCIAL),
        );
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Social[];
        setSocials(data);
      } catch (err) {
        console.error("Error fetching social:", err);
        setError("Failed to load social links");
      } finally {
        setLoading(false);
      }
    };

    fetchSocial();
  }, []);

  return { socials, loading, error };
};

// Hook to fetch contact config
export const useContact = () => {
  const [contact, setContact] = useState<ContactConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const firestore = getDb();
        if (!firestore) {
          // Default contact data
          setContact({
            email: "",
            phone: "",
            showPhone: false,
            showEmail: false,
          });
          setLoading(false);
          return;
        }

        const docRef = doc(firestore, COLLECTIONS.CONTACT, "main");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setContact(docSnap.data() as ContactConfig);
        }
      } catch (err) {
        console.error("Error fetching contact:", err);
        setError("Failed to load contact info");
      } finally {
        setLoading(false);
      }
    };

    fetchContact();
  }, []);

  return { contact, loading, error };
};

// Hook to fetch education
export const useEducation = () => {
  const [education, setEducation] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEducation = async () => {
      try {
        const firestore = getDb();
        if (!firestore) {
          setEducation([
            {
              id: "1",
              degree: "Bachelor of Computer Applications (BCA)",
              institution: "Indira Gandhi National Open University",
              year: "2022 – 2025",
              order: 1,
            },
            {
              id: "2",
              degree: "12th – Science (PCM)",
              institution: "Delhi Public School",
              year: "2020 – 2021",
              order: 2,
            },
          ]);
          setLoading(false);
          return;
        }

        const querySnapshot = await getDocs(collection(firestore, "education"));
        const data = querySnapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }) as Education)
          .sort((a, b) => (a.order || 0) - (b.order || 0));
        if (data.length) setEducation(data);
        else
          setEducation([
            {
              id: "1",
              degree: "Bachelor of Computer Applications (BCA)",
              institution: "Indira Gandhi National Open University",
              year: "2022 – 2025",
              order: 1,
            },
          ]);
      } catch (err) {
        console.error("Error fetching education:", err);
        setError("Failed to load education");
      } finally {
        setLoading(false);
      }
    };

    fetchEducation();
  }, []);

  return { education, loading, error };
};

// Hook to fetch certifications
export const useCertifications = () => {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCertifications = async () => {
      try {
        const firestore = getDb();
        if (!firestore) {
          setCertifications([]);
          setLoading(false);
          return;
        }

        const querySnapshot = await getDocs(
          collection(firestore, "certifications"),
        );
        const data = querySnapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }) as Certification)
          .sort((a, b) => (a.order || 0) - (b.order || 0));
        if (data.length) setCertifications(data);
        else setCertifications([]);
      } catch (err) {
        console.error("Error fetching certifications:", err);
        setError("Failed to load certifications");
      } finally {
        setLoading(false);
      }
    };

    fetchCertifications();
  }, []);

  return { certifications, loading, error };
};

export interface ResumeSettings {
  theme: "modern" | "classic";
  layout: "1col" | "2col";
  showBio: boolean;
  showSkills: boolean;
  showEducation: boolean;
  showCerts: boolean;
  showProjects: boolean;
  jobLimits: Record<string, number>;
  projectVisibility: Record<string, boolean>;
}

export const DEFAULT_RESUME_SETTINGS: ResumeSettings = {
  theme: "classic",
  layout: "2col",
  showBio: true,
  showSkills: true,
  showEducation: true,
  showCerts: true,
  showProjects: true,
  jobLimits: {},
  projectVisibility: {},
};

export const useResumeSettings = () => {
  const [settings, setSettings] = useState<ResumeSettings>(
    DEFAULT_RESUME_SETTINGS,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let unsubscribe: () => void = () => {};

    const fetchSettings = () => {
      try {
        const firestore = getDb();
        if (!firestore) {
          setLoading(false);
          return;
        }

        const docRef = doc(firestore, COLLECTIONS.RESUME_SETTINGS, "main");
        unsubscribe = onSnapshot(
          docRef,
          (snap) => {
            if (snap.exists()) {
              setSettings({
                ...DEFAULT_RESUME_SETTINGS,
                ...snap.data(),
              } as ResumeSettings);
            }
            setLoading(false);
          },
          (err) => {
            console.error("Error fetching resume settings:", err);
            setError("Failed to load resume settings");
            setLoading(false);
          },
        );
      } catch (err) {
        console.error("Error setting up snapshot:", err);
        setError("Failed to monitor resume settings");
        setLoading(false);
      }
    };

    fetchSettings();
    return () => unsubscribe();
  }, []);

  return { settings, loading, error };
};
