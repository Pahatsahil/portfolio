
import { useState, useEffect } from "react";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { db, storage, COLLECTIONS } from "../../../lib/firebase";
import { Loader2, Save, Eye, EyeOff, ImagePlus, X, Plus, Trash2, GripVertical } from "lucide-react";
import { toast } from "sonner";

interface BasicsData {
  name: string;
  title: string;
  bio: string;
  photoUrl: string;
  showPhoto: boolean;
  aboutStats: { number: string; label: string }[];
  aboutHighlights: string[];
}

const BasicsAdmin = () => {
  const [data, setData] = useState<BasicsData>({
    name: "",
    title: "",
    bio: "",
    photoUrl: "",
    showPhoto: true,
    aboutStats: [
      { number: "3+", label: "Years Experience" },
      { number: "15+", label: "Projects Completed" },
      { number: "10+", label: "Happy Clients" },
      { number: "500K+", label: "App Downloads" },
    ],
    aboutHighlights: [
      "Cross-platform mobile development (Android & iOS)",
      "Native module integration (Kotlin / Swift)",
      "Performance optimization & profiling",
      "Offline-first architecture with SQLite",
      "State management & database design",
    ],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  useEffect(() => {
    const fetchBasics = async () => {
      try {
        if (!db) return;
        const docRef = doc(db, COLLECTIONS.PROFILE, "main");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const d = docSnap.data();
          setData({
            name: d.name || "",
            title: d.title || "",
            bio: d.bio || "",
            photoUrl: d.photoUrl || "",
            showPhoto: d.showPhoto !== undefined ? d.showPhoto : true,
            aboutStats: d.aboutStats || [
              { number: "3+", label: "Years Experience" },
              { number: "15+", label: "Projects Completed" },
              { number: "10+", label: "Happy Clients" },
              { number: "500K+", label: "App Downloads" },
            ],
            aboutHighlights: d.aboutHighlights || [
              "Cross-platform mobile development (Android & iOS)",
              "Native module integration (Kotlin / Swift)",
              "Performance optimization & profiling",
              "Offline-first architecture with SQLite",
              "State management & database design",
            ],
          });
        }
      } catch (error) {
        console.error("Error fetching basics:", error);
        toast.error("Failed to load basics");
      } finally {
        setLoading(false);
      }
    };
    fetchBasics();
  }, []);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !storage) return;
    setUploadingPhoto(true);
    const storageRef = ref(storage, `profile/${Date.now()}_${file.name}`);
    const task = uploadBytesResumable(storageRef, file);
    task.on(
      "state_changed",
      null,
      (err) => { toast.error("Photo upload failed"); setUploadingPhoto(false); console.error(err); },
      async () => {
        const url = await getDownloadURL(task.snapshot.ref);
        setData((d) => ({ ...d, photoUrl: url }));
        toast.success("Photo uploaded!");
        setUploadingPhoto(false);
      }
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db) { toast.error("Database not initialized"); return; }
    setSaving(true);
    try {
      const docRef = doc(db, COLLECTIONS.PROFILE, "main");
      await setDoc(docRef, { ...data, updatedAt: serverTimestamp() }, { merge: true });
      toast.success("Basics saved successfully");
    } catch (error) {
      console.error("Error saving basics:", error);
      toast.error("Failed to save basics");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-[#61dafb]" />
      </div>
    );
  }

  return (
    <div className="bg-[#1e293b]/50 p-6 rounded-xl border border-[#334155]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold font-['Space_Grotesk'] text-white">Basics</h2>
          <p className="text-gray-400 text-sm">Your name, headline, bio, and profile photo.</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Photo */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-300">Profile Photo</label>
            <button
              type="button"
              onClick={() => setData((d) => ({ ...d, showPhoto: !d.showPhoto }))}
              className={`flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg transition-all ${
                data.showPhoto
                  ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                  : "bg-[#0f172a] text-gray-400 hover:text-white"
              }`}
            >
              {data.showPhoto ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              {data.showPhoto ? "Showing on Portfolio" : "Hidden"}
            </button>
          </div>

          {data.photoUrl ? (
            <div className="flex items-center gap-5">
              <div className="relative">
                <img
                  src={data.photoUrl}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border-2 border-[#61dafb]/40"
                />
                {uploadingPhoto && (
                  <div className="absolute inset-0 rounded-full bg-black/60 flex items-center justify-center">
                    <Loader2 className="w-6 h-6 animate-spin text-[#61dafb]" />
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <label className="cursor-pointer bg-[#0f172a] border border-[#334155] hover:border-[#61dafb] text-gray-300 hover:text-white text-sm px-4 py-2 rounded-lg flex items-center gap-2 transition-all">
                  <ImagePlus className="w-4 h-4" /> Change Photo
                  <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} disabled={uploadingPhoto} />
                </label>
                <button
                  type="button"
                  onClick={() => setData((d) => ({ ...d, photoUrl: "" }))}
                  className="text-red-400 hover:text-red-300 text-sm flex items-center gap-2 px-2"
                >
                  <X className="w-4 h-4" /> Remove Photo
                </button>
              </div>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-[#334155] rounded-xl cursor-pointer hover:border-[#61dafb]/50 hover:bg-[#61dafb]/5 transition-all">
              {uploadingPhoto ? (
                <Loader2 className="w-8 h-8 animate-spin text-[#61dafb]" />
              ) : (
                <>
                  <ImagePlus className="w-8 h-8 text-gray-500 mb-2" />
                  <span className="text-sm text-gray-400">Click to upload profile photo</span>
                  <span className="text-xs text-gray-600 mt-1">Recommended: Square image, 400×400px</span>
                </>
              )}
              <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} disabled={uploadingPhoto} />
            </label>
          )}
        </div>

        <div className="h-px bg-[#334155]" />

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Full Name</label>
          <input
            type="text"
            value={data.name}
            onChange={(e) => setData({ ...data, name: e.target.value })}
            className="w-full bg-[#0f172a] border border-[#334155] rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-[#61dafb] focus:ring-1 focus:ring-[#61dafb] transition-all"
            placeholder="John Doe"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Title / Headline</label>
          <input
            type="text"
            value={data.title}
            onChange={(e) => setData({ ...data, title: e.target.value })}
            className="w-full bg-[#0f172a] border border-[#334155] rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-[#61dafb] focus:ring-1 focus:ring-[#61dafb] transition-all"
            placeholder="React Native Developer"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Summary / Profile</label>
          <textarea
            value={data.bio}
            onChange={(e) => setData({ ...data, bio: e.target.value })}
            rows={5}
            className="w-full bg-[#0f172a] border border-[#334155] rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-[#61dafb] focus:ring-1 focus:ring-[#61dafb] transition-all resize-y"
            placeholder="One strong paragraph about you..."
          />
        </div>

        <div className="h-px bg-[#334155] my-6" />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white">About Stats</h3>
              <p className="text-xs text-gray-500">Key metrics shown in the About section (e.g. Years Experience)</p>
            </div>
            <button
              type="button"
              onClick={() => setData(d => ({ ...d, aboutStats: [...d.aboutStats, { number: "", label: "" }] }))}
              className="text-sm text-[#61dafb] hover:text-white flex items-center gap-1 transition-colors"
            >
              <Plus className="w-4 h-4" /> Add Stat
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {data.aboutStats.map((stat, i) => (
              <div key={i} className="flex items-center gap-2 bg-[#0f172a] p-3 rounded-xl border border-[#334155]">
                <div className="flex-1 space-y-2">
                  <input
                    type="text"
                    value={stat.number}
                    onChange={(e) => {
                      const newStats = [...data.aboutStats];
                      newStats[i].number = e.target.value;
                      setData(d => ({ ...d, aboutStats: newStats }));
                    }}
                    placeholder="e.g. 3+"
                    className="w-full bg-[#1e293b] border border-[#334155] rounded-lg py-1.5 px-3 text-white focus:border-[#61dafb] text-sm"
                  />
                  <input
                    type="text"
                    value={stat.label}
                    onChange={(e) => {
                      const newStats = [...data.aboutStats];
                      newStats[i].label = e.target.value;
                      setData(d => ({ ...d, aboutStats: newStats }));
                    }}
                    placeholder="e.g. Years Experience"
                    className="w-full bg-[#1e293b] border border-[#334155] rounded-lg py-1.5 px-3 text-white focus:border-[#61dafb] text-sm"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const newStats = [...data.aboutStats];
                    newStats.splice(i, 1);
                    setData(d => ({ ...d, aboutStats: newStats }));
                  }}
                  className="p-2 text-gray-500 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="h-px bg-[#334155] my-6" />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white">About Highlights</h3>
              <p className="text-xs text-gray-500">Bullet points listing your core strengths</p>
            </div>
            <button
              type="button"
              onClick={() => setData(d => ({ ...d, aboutHighlights: [...d.aboutHighlights, ""] }))}
              className="text-sm text-[#61dafb] hover:text-white flex items-center gap-1 transition-colors"
            >
              <Plus className="w-4 h-4" /> Add Highlight
            </button>
          </div>
          <div className="space-y-2">
            {data.aboutHighlights.map((hl, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-[#61dafb]">▸</span>
                <input
                  type="text"
                  value={hl}
                  onChange={(e) => {
                    const newHl = [...data.aboutHighlights];
                    newHl[i] = e.target.value;
                    setData(d => ({ ...d, aboutHighlights: newHl }));
                  }}
                  className="flex-1 bg-[#0f172a] border border-[#334155] rounded-lg py-2 px-3 text-white focus:border-[#61dafb] text-sm"
                  placeholder="e.g. Cross-platform mobile development"
                />
                <button
                  type="button"
                  onClick={() => {
                    const newHl = [...data.aboutHighlights];
                    newHl.splice(i, 1);
                    setData(d => ({ ...d, aboutHighlights: newHl }));
                  }}
                  className="p-2 text-gray-500 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-[#334155] mt-6">
          <button
            type="submit"
            disabled={saving || uploadingPhoto}
            className="bg-[#61dafb] text-[#0f172a] font-bold py-2.5 px-6 rounded-xl disabled:opacity-50 hover:opacity-90 flex items-center gap-2 transition-all"
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            Save Basics
          </button>
        </div>
      </form>
    </div>
  );
};

export default BasicsAdmin;
