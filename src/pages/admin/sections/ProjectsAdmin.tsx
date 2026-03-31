import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
  serverTimestamp,
  addDoc,
} from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, storage, COLLECTIONS } from "../../../lib/firebase";
import { Loader2, Plus, Save, Trash2, ImagePlus, X, ChevronUp, ChevronDown, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  tech: string[];
  platform: string;
  color: string;
  githubUrl: string;
  playStoreUrl: string;
  appStoreUrl: string;
  imageUrl: string;
  visible?: boolean;
  order?: number;
}

const EMPTY_PROJECT = (): Omit<Project, "id"> => ({
  title: "",
  subtitle: "",
  description: "",
  tech: [],
  platform: "",
  color: "from-blue-500 to-indigo-600",
  githubUrl: "",
  playStoreUrl: "",
  appStoreUrl: "",
  imageUrl: "",
  visible: true,
});

const ProjectsAdmin = () => {
  const [items, setItems] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingFor, setUploadingFor] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        if (!db) return;
        const qs = await getDocs(collection(db, COLLECTIONS.PROJECTS));
        const data = qs.docs.map((d) => ({ id: d.id, ...d.data() })) as Project[];
        data.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
        setItems(
          data.map((p) => ({
            ...p,
            playStoreUrl: p.playStoreUrl || (p as any).liveUrl || "",
            appStoreUrl: p.appStoreUrl || "",
            visible: p.visible ?? true,
          }))
        );
      } catch (error) {
        console.error("Error fetching projects:", error);
        toast.error("Failed to load projects");
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const handleImageUpload = (itemId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !storage) return;
    setUploadingFor(itemId);
    const storageRef = ref(storage, `projects/${Date.now()}_${file.name}`);
    const task = uploadBytesResumable(storageRef, file);
    task.on(
      "state_changed",
      null,
      (err) => { toast.error("Image upload failed"); setUploadingFor(null); console.error(err); },
      async () => {
        const url = await getDownloadURL(task.snapshot.ref);
        setItems((prev) => prev.map((p) => p.id === itemId ? { ...p, imageUrl: url } : p));
        toast.success("Image uploaded!");
        setUploadingFor(null);
      }
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db) { toast.error("Database not initialized"); return; }
    setSaving(true);
    try {
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const itemData = { ...item, order: i } as any;
        delete itemData.id;
        delete itemData.liveUrl; // remove legacy field
        itemData.updatedAt = serverTimestamp();
        if (item.id.startsWith("temp-")) {
          const docRef = await addDoc(collection(db, COLLECTIONS.PROJECTS), itemData);
          item.id = docRef.id;
        } else {
          await setDoc(doc(db, COLLECTIONS.PROJECTS, item.id), itemData, { merge: true });
        }
      }
      toast.success("Projects saved successfully");
    } catch (error) {
      console.error("Error saving projects:", error);
      toast.error("Failed to save projects");
    } finally {
      setSaving(false);
    }
  };

  const handleAddItem = () => setItems([...items, { id: `temp-${Date.now()}`, ...EMPTY_PROJECT() }]);

  const handleDeleteItem = async (id: string, index: number) => {
    if (!id.startsWith("temp-") && db) {
      if (!window.confirm("Delete this project? This cannot be undone.")) return;
      try {
        await deleteDoc(doc(db, COLLECTIONS.PROJECTS, id));
        toast.success("Project deleted");
      } catch { toast.error("Failed to delete project"); return; }
    }
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const updateItem = <K extends keyof Project>(index: number, field: K, value: Project[K]) => {
    setItems((prev) => { const next = [...prev]; next[index] = { ...next[index], [field]: value }; return next; });
  };

  const moveProject = (index: number, direction: 'up' | 'down') => {
    setItems((prev) => {
      const next = [...prev];
      if (direction === 'up' && index > 0) {
        [next[index], next[index - 1]] = [next[index - 1], next[index]];
      } else if (direction === 'down' && index < next.length - 1) {
        [next[index], next[index + 1]] = [next[index + 1], next[index]];
      }
      return next;
    });
  };

  const toggleVisibility = (index: number) => {
    updateItem(index, "visible", !items[index].visible);
  };

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-[#61dafb]" /></div>;

  return (
    <div className="bg-[#1e293b]/50 p-6 rounded-xl border border-[#334155]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold font-['Space_Grotesk'] text-white">Projects</h2>
          <p className="text-gray-400 text-sm">Organize and toggle visibility for your portfolio projects.</p>
          <p className="text-gray-400 text-sm">Organize, toggle visibility, and update references for portfolio projects.</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {items.map((item, index) => (
          <div key={item.id} className={`bg-[#0f172a] p-5 rounded-xl border relative transition-colors ${item.visible === false ? "border-gray-700 opacity-70" : "border-[#334155]"}`}>
            <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
              <button
                type="button"
                onClick={() => toggleVisibility(index)}
                className={`text-gray-500 hover:text-[#61dafb] transition-colors ${item.visible === false ? "text-yellow-500" : ""}`}
                title={item.visible === false ? "Show Project" : "Hide Project"}
              >
                {item.visible === false ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
              <button
                type="button"
                onClick={() => moveProject(index, 'up')}
                disabled={index === 0}
                className="text-gray-500 hover:text-[#61dafb] disabled:opacity-30 transition-colors ml-2"
                title="Move Up"
              >
                <ChevronUp className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => moveProject(index, 'down')}
                disabled={index === items.length - 1}
                className="text-gray-500 hover:text-[#61dafb] disabled:opacity-30 transition-colors"
                title="Move Down"
              >
                <ChevronDown className="w-5 h-5" />
              </button>
              <button type="button" onClick={() => handleDeleteItem(item.id, index)} className="text-gray-500 hover:text-red-400 transition-colors ml-2" title="Delete Project">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

            {/* Image Upload */}
            <div className="mb-5">
              {item.imageUrl ? (
                <div className="relative w-full h-40 rounded-xl overflow-hidden border border-[#334155] group">
                  <img src={item.imageUrl} alt="Project preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <label className="cursor-pointer bg-white/10 hover:bg-white/20 text-white text-sm px-3 py-1.5 rounded-lg flex items-center gap-2">
                      <ImagePlus className="w-4 h-4" /> Change
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(item.id, e)} />
                    </label>
                    <button type="button" onClick={() => updateItem(index, "imageUrl", "")} className="bg-red-500/20 hover:bg-red-500/40 text-red-400 text-sm px-3 py-1.5 rounded-lg flex items-center gap-2">
                      <X className="w-4 h-4" /> Remove
                    </button>
                  </div>
                  {uploadingFor === item.id && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <Loader2 className="w-8 h-8 animate-spin text-[#61dafb]" />
                    </div>
                  )}
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-[#334155] rounded-xl cursor-pointer hover:border-[#61dafb]/50 hover:bg-[#61dafb]/5 transition-all">
                  {uploadingFor === item.id ? (
                    <Loader2 className="w-8 h-8 animate-spin text-[#61dafb]" />
                  ) : (
                    <>
                      <ImagePlus className="w-8 h-8 text-gray-500 mb-2" />
                      <span className="text-sm text-gray-400">Click to upload project image</span>
                    </>
                  )}
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(item.id, e)} disabled={uploadingFor !== null} />
                </label>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Project Title</label>
                <input type="text" value={item.title} onChange={(e) => updateItem(index, "title", e.target.value)} className="w-full bg-[#1e293b] border border-[#334155] rounded-xl py-2 px-4 text-white focus:outline-none focus:border-[#61dafb]" placeholder="My Awesome App" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Subtitle</label>
                <input type="text" value={item.subtitle} onChange={(e) => updateItem(index, "subtitle", e.target.value)} className="w-full bg-[#1e293b] border border-[#334155] rounded-xl py-2 px-4 text-white focus:outline-none focus:border-[#61dafb]" placeholder="Short tagline" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-gray-400">Description</label>
                <textarea value={item.description} onChange={(e) => updateItem(index, "description", e.target.value)} rows={3} className="w-full bg-[#1e293b] border border-[#334155] rounded-xl py-2 px-4 text-white focus:outline-none focus:border-[#61dafb] resize-y" placeholder="What does this project do?" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Tech Stack (comma-separated)</label>
                <input type="text" value={item.tech.join(", ")} onChange={(e) => updateItem(index, "tech", e.target.value.split(",").map((t) => t.trim()).filter(Boolean))} className="w-full bg-[#1e293b] border border-[#334155] rounded-xl py-2 px-4 text-white focus:outline-none focus:border-[#61dafb]" placeholder="React Native, TypeScript, Firebase" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Platform</label>
                <input type="text" value={item.platform} onChange={(e) => updateItem(index, "platform", e.target.value)} className="w-full bg-[#1e293b] border border-[#334155] rounded-xl py-2 px-4 text-white focus:outline-none focus:border-[#61dafb]" placeholder="Android & iOS" />
              </div>

              {/* Divider for URLs */}
              <div className="md:col-span-2 pt-1">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">Store & Repo Links</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
                      <span className="text-green-400">▶</span> Play Store URL
                    </label>
                    <input type="text" value={item.playStoreUrl} onChange={(e) => updateItem(index, "playStoreUrl", e.target.value)} className="w-full bg-[#1e293b] border border-[#334155] rounded-xl py-2 px-4 text-white text-sm focus:outline-none focus:border-[#61dafb]" placeholder="https://play.google.com/..." />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
                      <span className="text-blue-400">🍎</span> App Store URL
                    </label>
                    <input type="text" value={item.appStoreUrl} onChange={(e) => updateItem(index, "appStoreUrl", e.target.value)} className="w-full bg-[#1e293b] border border-[#334155] rounded-xl py-2 px-4 text-white text-sm focus:outline-none focus:border-[#61dafb]" placeholder="https://apps.apple.com/..." />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
                      <span className="text-gray-400">⌥</span> GitHub URL
                    </label>
                    <input type="text" value={item.githubUrl} onChange={(e) => updateItem(index, "githubUrl", e.target.value)} className="w-full bg-[#1e293b] border border-[#334155] rounded-xl py-2 px-4 text-white text-sm focus:outline-none focus:border-[#61dafb]" placeholder="https://github.com/..." />
                  </div>
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-gray-400">Card Gradient (Tailwind)</label>
                <input type="text" value={item.color} onChange={(e) => updateItem(index, "color", e.target.value)} className="w-full bg-[#1e293b] border border-[#334155] rounded-xl py-2 px-4 text-white focus:outline-none focus:border-[#61dafb] font-mono text-sm" placeholder="from-blue-500 to-indigo-600" />
              </div>
            </div>
          </div>
        ))}

        <button type="button" onClick={handleAddItem} className="w-full py-4 border-2 border-dashed border-[#334155] text-gray-400 hover:text-white hover:border-[#61dafb] rounded-xl flex items-center justify-center gap-2 transition-all">
          <Plus className="w-5 h-5" /> Add Project
        </button>

        <div className="flex justify-end pt-4 border-t border-[#334155]">
          <button type="submit" disabled={saving || uploadingFor !== null} className="bg-[#61dafb] text-[#0f172a] font-bold py-2.5 px-6 rounded-xl disabled:opacity-50 hover:opacity-90 flex items-center gap-2 transition-all">
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            Save Projects
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProjectsAdmin;
