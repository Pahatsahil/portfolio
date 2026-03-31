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
import { db } from "../../../lib/firebase";
import { Loader2, Plus, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Education {
  id: string;
  degree: string;
  institution: string;
  period: string;
  grade: string;
  order: number;
}

const EducationAdmin = () => {
  const [items, setItems] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchEducation = async () => {
      try {
        if (!db) return;
        const querySnapshot = await getDocs(collection(db, "education"));
        const data = querySnapshot.docs
          .map((d) => ({ id: d.id, ...d.data() }) as Education)
          .sort((a, b) => (a.order || 0) - (b.order || 0));
        setItems(data);
      } catch (error) {
        console.error("Error fetching education:", error);
        toast.error("Failed to load education");
      } finally {
        setLoading(false);
      }
    };
    fetchEducation();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db) {
      toast.error("Database not initialized");
      return;
    }
    setSaving(true);
    try {
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const itemData = { ...item, order: i } as any;
        delete itemData.id;
        itemData.updatedAt = serverTimestamp();
        if (item.id.startsWith("temp-")) {
          const docRef = await addDoc(collection(db, "education"), itemData);
          items[i].id = docRef.id;
        } else {
          await setDoc(doc(db, "education", item.id), itemData, {
            merge: true,
          });
        }
      }
      toast.success("Education saved successfully");
    } catch (error) {
      console.error("Error saving education:", error);
      toast.error("Failed to save education");
    } finally {
      setSaving(false);
    }
  };

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        id: `temp-${Date.now()}`,
        degree: "",
        institution: "",
        period: "",
        grade: "",
        order: items.length,
      },
    ]);
  };

  const handleDeleteItem = async (id: string, index: number) => {
    if (!id.startsWith("temp-") && db) {
      if (!window.confirm("Delete this education entry?")) return;
      try {
        await deleteDoc(doc(db, "education", id));
        toast.success("Entry deleted");
      } catch {
        toast.error("Failed to delete");
        return;
      }
    }
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const updateItem = (
    index: number,
    field: keyof Education,
    value: string | number,
  ) => {
    setItems((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
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
          <h2 className="text-xl font-bold font-['Space_Grotesk'] text-white">
            Education
          </h2>
          <p className="text-gray-400 text-sm">
            Manage degrees and academic qualifications.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        {items.map((item, index) => (
          <div
            key={item.id}
            className="bg-[#0f172a] p-5 rounded-xl border border-[#334155] relative"
          >
            <button
              type="button"
              onClick={() => handleDeleteItem(item.id, index)}
              className="absolute top-4 right-4 text-gray-500 hover:text-red-400 transition-colors"
            >
              <Trash2 className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-gray-400">
                  Degree / Qualification
                </label>
                <input
                  type="text"
                  value={item.degree}
                  onChange={(e) => updateItem(index, "degree", e.target.value)}
                  className="w-full bg-[#1e293b] border border-[#334155] rounded-xl py-2 px-4 text-white focus:outline-none focus:border-[#61dafb]"
                  placeholder="Bachelor of Computer Applications (BCA)"
                  required
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-gray-400">
                  Institution
                </label>
                <input
                  type="text"
                  value={item.institution}
                  onChange={(e) =>
                    updateItem(index, "institution", e.target.value)
                  }
                  className="w-full bg-[#1e293b] border border-[#334155] rounded-xl py-2 px-4 text-white focus:outline-none focus:border-[#61dafb]"
                  placeholder="Indira Gandhi National Open University"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">
                  Year
                </label>
                <input
                  type="text"
                  value={item.period}
                  onChange={(e) => updateItem(index, "period", e.target.value)}
                  className="w-full bg-[#1e293b] border border-[#334155] rounded-xl py-2 px-4 text-white focus:outline-none focus:border-[#61dafb]"
                  placeholder="2022 – 2025"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">
                  Grade / GPA (Optional)
                </label>
                <input
                  type="text"
                  value={item.grade}
                  onChange={(e) => updateItem(index, "grade", e.target.value)}
                  className="w-full bg-[#1e293b] border border-[#334155] rounded-xl py-2 px-4 text-white focus:outline-none focus:border-[#61dafb]"
                  placeholder="8.5 CGPA"
                />
              </div>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={handleAddItem}
          className="w-full py-4 border-2 border-dashed border-[#334155] text-gray-400 hover:text-white hover:border-[#61dafb] rounded-xl flex items-center justify-center gap-2 transition-all"
        >
          <Plus className="w-5 h-5" />
          Add Degree
        </button>

        <div className="flex justify-end pt-4 border-t border-[#334155]">
          <button
            type="submit"
            disabled={saving}
            className="bg-[#61dafb] text-[#0f172a] font-bold py-2.5 px-6 rounded-xl disabled:opacity-50 hover:opacity-90 flex items-center gap-2 transition-all"
          >
            {saving ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            Save Education
          </button>
        </div>
      </form>
    </div>
  );
};

export default EducationAdmin;
