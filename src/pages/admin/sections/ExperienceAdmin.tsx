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
import { db, COLLECTIONS } from "../../../lib/firebase";
import {
  Loader2,
  Plus,
  Save,
  Trash2,
  GripVertical,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";

interface Experience {
  id: string;
  title: string;
  company: string;
  period: string;
  highlights: string[];
}

const ExperienceAdmin = () => {
  const [items, setItems] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchExperience = async () => {
      try {
        if (!db) return;
        const querySnapshot = await getDocs(
          collection(db, COLLECTIONS.EXPERIENCE),
        );
        const data = querySnapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })) as Experience[];
        setItems(data);
      } catch (error) {
        console.error("Error fetching experience:", error);
        toast.error("Failed to load experience");
      } finally {
        setLoading(false);
      }
    };
    fetchExperience();
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
          const docRef = await addDoc(
            collection(db, COLLECTIONS.EXPERIENCE),
            itemData,
          );
          item.id = docRef.id;
        } else {
          await setDoc(doc(db, COLLECTIONS.EXPERIENCE, item.id), itemData, {
            merge: true,
          });
        }
      }
      toast.success("Experience saved successfully");
    } catch (error) {
      console.error("Error saving experience:", error);
      toast.error("Failed to save experience");
    } finally {
      setSaving(false);
    }
  };

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        id: `temp-${Date.now()}`,
        title: "",
        company: "",
        period: "",
        highlights: [""],
      },
    ]);
  };

  const handleDeleteItem = async (id: string, index: number) => {
    if (!id.startsWith("temp-") && db) {
      if (
        !window.confirm("Delete this experience entry? This cannot be undone.")
      )
        return;
      try {
        await deleteDoc(doc(db, COLLECTIONS.EXPERIENCE, id));
        toast.success("Entry deleted");
      } catch {
        toast.error("Failed to delete");
        return;
      }
    }
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof Experience, value: any) => {
    setItems((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const moveJob = (index: number, direction: "up" | "down") => {
    setItems((prev) => {
      const next = [...prev];
      if (direction === "up" && index > 0) {
        [next[index], next[index - 1]] = [next[index - 1], next[index]];
      } else if (direction === "down" && index < next.length - 1) {
        [next[index], next[index + 1]] = [next[index + 1], next[index]];
      }
      return next;
    });
  };

  // ── Highlight bullet helpers ──
  const updateHighlight = (
    itemIndex: number,
    hIndex: number,
    value: string,
  ) => {
    setItems((prev) => {
      const next = [...prev];
      const highlights = [...next[itemIndex].highlights];
      highlights[hIndex] = value;
      next[itemIndex] = { ...next[itemIndex], highlights };
      return next;
    });
  };

  const addHighlight = (itemIndex: number) => {
    setItems((prev) => {
      const next = [...prev];
      next[itemIndex] = {
        ...next[itemIndex],
        highlights: [...next[itemIndex].highlights, ""],
      };
      return next;
    });
  };

  const removeHighlight = (itemIndex: number, hIndex: number) => {
    setItems((prev) => {
      const next = [...prev];
      const highlights = next[itemIndex].highlights.filter(
        (_, i) => i !== hIndex,
      );
      next[itemIndex] = { ...next[itemIndex], highlights };
      return next;
    });
  };

  // ── Drag to reorder bullets ──
  const moveHighlight = (itemIndex: number, from: number, to: number) => {
    if (to < 0 || to >= items[itemIndex].highlights.length) return;
    setItems((prev) => {
      const next = [...prev];
      const highlights = [...next[itemIndex].highlights];
      const [moved] = highlights.splice(from, 1);
      highlights.splice(to, 0, moved);
      next[itemIndex] = { ...next[itemIndex], highlights };
      return next;
    });
  };

  const [dragOver, setDragOver] = useState<{ item: number; h: number } | null>(
    null,
  );
  const [dragging, setDragging] = useState<{ item: number; h: number } | null>(
    null,
  );

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
            Experience
          </h2>
          <p className="text-gray-400 text-sm">
            Drag ☰ to reorder bullet points — top bullets appear first on the
            resume.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {items.map((item, index) => (
          <div
            key={item.id}
            className="bg-[#0f172a] p-5 rounded-xl border border-[#334155] relative"
          >
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <button
                type="button"
                onClick={() => moveJob(index, "up")}
                disabled={index === 0}
                className="text-gray-500 hover:text-[#61dafb] disabled:opacity-30 transition-colors"
                title="Move Job Up"
              >
                <ChevronUp className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => moveJob(index, "down")}
                disabled={index === items.length - 1}
                className="text-gray-500 hover:text-[#61dafb] disabled:opacity-30 transition-colors"
                title="Move Job Down"
              >
                <ChevronDown className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => handleDeleteItem(item.id, index)}
                className="text-gray-500 hover:text-red-400 transition-colors ml-2"
                title="Delete Job"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5 mt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">
                  Job Title
                </label>
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => updateItem(index, "title", e.target.value)}
                  className="w-full bg-[#1e293b] border border-[#334155] rounded-xl py-2 px-4 text-white focus:outline-none focus:border-[#61dafb]"
                  placeholder="Software Engineer"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">
                  Company
                </label>
                <input
                  type="text"
                  value={item.company}
                  onChange={(e) => updateItem(index, "company", e.target.value)}
                  className="w-full bg-[#1e293b] border border-[#334155] rounded-xl py-2 px-4 text-white focus:outline-none focus:border-[#61dafb]"
                  placeholder="Acme Corp"
                  required
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-gray-400">
                  Period
                </label>
                <input
                  type="text"
                  value={item.period}
                  onChange={(e) => updateItem(index, "period", e.target.value)}
                  className="w-full bg-[#1e293b] border border-[#334155] rounded-xl py-2 px-4 text-white focus:outline-none focus:border-[#61dafb]"
                  placeholder="Jan 2022 – Present"
                  required
                />
              </div>
            </div>

            {/* Bullet Points with drag-to-reorder */}
            <div className="space-y-2">
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium text-gray-400">
                  Highlights{" "}
                  <span className="text-gray-600 font-normal">
                    (drag ☰ to reorder — first = shown first on resume)
                  </span>
                </label>
                <button
                  type="button"
                  onClick={() => addHighlight(index)}
                  className="text-xs text-[#61dafb] hover:text-white flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Add Bullet
                </button>
              </div>

              {item.highlights.map((highlight, hIndex) => (
                <div
                  key={hIndex}
                  className={`flex items-start gap-2 rounded-lg transition-colors ${
                    dragOver?.item === index && dragOver.h === hIndex
                      ? "bg-[#61dafb]/10 outline outline-1 outline-[#61dafb]/40"
                      : ""
                  }`}
                  draggable
                  onDragStart={() => setDragging({ item: index, h: hIndex })}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver({ item: index, h: hIndex });
                  }}
                  onDragEnd={() => {
                    setDragging(null);
                    setDragOver(null);
                  }}
                  onDrop={() => {
                    if (dragging && dragging.item === index) {
                      moveHighlight(index, dragging.h, hIndex);
                    }
                    setDragging(null);
                    setDragOver(null);
                  }}
                >
                  {/* Drag handle */}
                  <div className="mt-2.5 text-gray-600 hover:text-gray-400 cursor-grab active:cursor-grabbing flex-shrink-0">
                    <GripVertical className="w-4 h-4" />
                  </div>
                  {/* Up/Down arrows for accessibility */}
                  <div className="flex flex-col mt-1 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => moveHighlight(index, hIndex, hIndex - 1)}
                      disabled={hIndex === 0}
                      className="text-gray-600 hover:text-[#61dafb] disabled:opacity-20 disabled:cursor-default p-0.5"
                    >
                      <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveHighlight(index, hIndex, hIndex + 1)}
                      disabled={hIndex === item.highlights.length - 1}
                      className="text-gray-600 hover:text-[#61dafb] disabled:opacity-20 disabled:cursor-default p-0.5"
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <span className="text-[#818cf8] mt-2.5 flex-shrink-0">▸</span>
                  <textarea
                    value={highlight}
                    onChange={(e) =>
                      updateHighlight(index, hIndex, e.target.value)
                    }
                    rows={2}
                    className="flex-1 bg-[#1e293b] border border-[#334155] rounded-lg py-2 px-3 text-white text-sm focus:outline-none focus:border-[#61dafb] resize-y"
                    placeholder="Achieved X by doing Y, resulting in Z..."
                    required
                  />
                  <button
                    type="button"
                    onClick={() => removeHighlight(index, hIndex)}
                    className="mt-2 text-gray-500 hover:text-red-400 transition-colors p-1 flex-shrink-0"
                    disabled={item.highlights.length <= 1}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={handleAddItem}
          className="w-full py-4 border-2 border-dashed border-[#334155] text-gray-400 hover:text-white hover:border-[#61dafb] rounded-xl flex items-center justify-center gap-2 transition-all"
        >
          <Plus className="w-5 h-5" />
          Add Experience
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
            Save Experience
          </button>
        </div>
      </form>
    </div>
  );
};

export default ExperienceAdmin;
