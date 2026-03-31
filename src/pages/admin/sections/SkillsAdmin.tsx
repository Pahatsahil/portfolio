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
import { Loader2, Plus, Save, Trash2, Eye, EyeOff, ChevronDown, ChevronRight, Pencil, Check, X } from "lucide-react";
import { toast } from "sonner";

interface Skill {
  id: string;
  name: string;
  category: string;
  visible: boolean;
}

const SkillsAdmin = () => {
  const [items, setItems] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set());
  const [editingCategory, setEditingCategory] = useState<{ old: string; new: string } | null>(null);
  const [newCategoryName, setNewCategoryName] = useState("");

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        if (!db) return;
        const qs = await getDocs(collection(db, COLLECTIONS.SKILLS));
        const data = qs.docs.map((d) => ({
          id: d.id,
          visible: true, // default true for legacy entries
          ...d.data(),
        })) as Skill[];
        setItems(data);
      } catch (error) {
        console.error("Error fetching skills:", error);
        toast.error("Failed to load skills");
      } finally {
        setLoading(false);
      }
    };
    fetchSkills();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db) { toast.error("Database not initialized"); return; }
    setSaving(true);
    try {
      for (const item of items) {
        const itemData = { ...item } as any;
        delete itemData.id;
        itemData.updatedAt = serverTimestamp();
        if (item.id.startsWith("temp-")) {
          const docRef = await addDoc(collection(db, COLLECTIONS.SKILLS), itemData);
          item.id = docRef.id;
        } else {
          await setDoc(doc(db, COLLECTIONS.SKILLS, item.id), itemData, { merge: true });
        }
      }
      toast.success("Skills saved successfully");
    } catch (error) {
      console.error("Error saving skills:", error);
      toast.error("Failed to save skills");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSkill = async (id: string) => {
    if (!id.startsWith("temp-") && db) {
      if (!window.confirm("Delete this skill?")) return;
      try {
        await deleteDoc(doc(db, COLLECTIONS.SKILLS, id));
        toast.success("Skill deleted");
      } catch { toast.error("Failed to delete"); return; }
    }
    setItems((prev) => prev.filter((s) => s.id !== id));
  };

  const updateSkill = (id: string, field: keyof Skill, value: any) => {
    setItems((prev) => prev.map((s) => s.id === id ? { ...s, [field]: value } : s));
  };

  const addSkillToCategory = (category: string) => {
    setItems((prev) => [...prev, { id: `temp-${Date.now()}`, name: "", category, visible: true }]);
  };

  const addNewCategory = () => {
    const name = newCategoryName.trim();
    if (!name) return;
    setItems((prev) => [...prev, { id: `temp-${Date.now()}`, name: "", category: name, visible: true }]);
    setNewCategoryName("");
  };

  const renameCategory = (oldName: string, newName: string) => {
    const trimmed = newName.trim();
    if (!trimmed || trimmed === oldName) { setEditingCategory(null); return; }
    setItems((prev) => prev.map((s) => s.category === oldName ? { ...s, category: trimmed } : s));
    setEditingCategory(null);
  };

  const deleteCategory = (category: string) => {
    if (!window.confirm(`Delete the entire "${category}" category and all its skills?`)) return;
    const toDelete = items.filter((s) => s.category === category && !s.id.startsWith("temp-"));
    // Fire-and-forget async deletes
    if (db) toDelete.forEach((s) => deleteDoc(doc(db, COLLECTIONS.SKILLS, s.id)).catch(console.error));
    setItems((prev) => prev.filter((s) => s.category !== category));
    toast.success(`"${category}" category deleted`);
  };

  const toggleCategoryVisibility = (category: string, visible: boolean) => {
    setItems((prev) => prev.map((s) => s.category === category ? { ...s, visible } : s));
  };

  const toggleCollapse = (category: string) => {
    setCollapsedCategories((prev) => {
      const next = new Set(prev);
      next.has(category) ? next.delete(category) : next.add(category);
      return next;
    });
  };

  // Group skills by category
  const grouped: Record<string, Skill[]> = {};
  items.forEach((s) => {
    if (!grouped[s.category]) grouped[s.category] = [];
    grouped[s.category].push(s);
  });

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-[#61dafb]" /></div>;

  return (
    <div className="bg-[#1e293b]/50 p-6 rounded-xl border border-[#334155]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold font-['Space_Grotesk'] text-white">Skills</h2>
          <p className="text-gray-400 text-sm">Grouped by category. Toggle eye to show/hide on resume & portfolio.</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        {/* Category groups */}
        {Object.entries(grouped).map(([category, skills]) => {
          const collapsed = collapsedCategories.has(category);
          const allVisible = skills.every((s) => s.visible);
          const someVisible = skills.some((s) => s.visible);

          return (
            <div key={category} className="bg-[#0f172a] rounded-xl border border-[#334155] overflow-hidden">
              {/* Category header */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-[#334155]/60">
                <button type="button" onClick={() => toggleCollapse(category)} className="text-gray-400 hover:text-white transition-colors flex-shrink-0">
                  {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {/* Category name / edit field */}
                {editingCategory?.old === category ? (
                  <div className="flex items-center gap-2 flex-1">
                    <input
                      type="text"
                      value={editingCategory.new}
                      onChange={(e) => setEditingCategory({ old: category, new: e.target.value })}
                      className="bg-[#1e293b] border border-[#61dafb] rounded-lg px-3 py-1 text-white text-sm focus:outline-none"
                      autoFocus
                      onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); renameCategory(category, editingCategory.new); } if (e.key === "Escape") setEditingCategory(null); }}
                    />
                    <button type="button" onClick={() => renameCategory(category, editingCategory.new)} className="text-green-400 hover:text-green-300"><Check className="w-4 h-4" /></button>
                    <button type="button" onClick={() => setEditingCategory(null)} className="text-gray-400 hover:text-white"><X className="w-4 h-4" /></button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className="font-semibold text-white text-sm">{category}</span>
                    <span className="text-xs text-gray-500">({skills.length} skills)</span>
                    <button type="button" onClick={() => setEditingCategory({ old: category, new: category })} className="text-gray-500 hover:text-[#61dafb] transition-colors ml-1">
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                <div className="flex items-center gap-2 flex-shrink-0 ml-auto">
                  {/* Category-level toggle */}
                  <button
                    type="button"
                    onClick={() => toggleCategoryVisibility(category, !allVisible)}
                    title={allVisible ? "Hide entire category" : "Show entire category"}
                    className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg transition-all ${
                      allVisible ? "bg-green-500/15 text-green-400 hover:bg-green-500/25"
                      : someVisible ? "bg-yellow-500/15 text-yellow-400 hover:bg-yellow-500/25"
                      : "bg-[#1e293b] text-gray-500 hover:text-white"
                    }`}
                  >
                    {allVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    {allVisible ? "All visible" : someVisible ? "Partial" : "Hidden"}
                  </button>
                  <button type="button" onClick={() => deleteCategory(category)} className="text-gray-600 hover:text-red-400 transition-colors p-1" title="Delete category">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Skills list */}
              {!collapsed && (
                <div className="p-3 space-y-2">
                  {skills.map((skill) => (
                    <div key={skill.id} className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${skill.visible ? "bg-[#1e293b]/60" : "bg-[#1e293b]/20"}`}>
                      {/* Visibility toggle per skill */}
                      <button
                        type="button"
                        onClick={() => updateSkill(skill.id, "visible", !skill.visible)}
                        className={`flex-shrink-0 transition-colors ${skill.visible ? "text-green-400 hover:text-green-300" : "text-gray-600 hover:text-gray-400"}`}
                        title={skill.visible ? "Hide from resume" : "Show on resume"}
                      >
                        {skill.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>

                      <input
                        type="text"
                        value={skill.name}
                        onChange={(e) => updateSkill(skill.id, "name", e.target.value)}
                        className={`flex-1 bg-transparent border-b border-[#334155] focus:border-[#61dafb] py-1 px-1 text-sm focus:outline-none transition-colors ${skill.visible ? "text-white" : "text-gray-500"}`}
                        placeholder="Skill name (e.g. TypeScript)"
                        required
                      />

                      <button type="button" onClick={() => handleDeleteSkill(skill.id)} className="flex-shrink-0 text-gray-600 hover:text-red-400 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => addSkillToCategory(category)}
                    className="w-full py-2 text-xs text-gray-500 hover:text-[#61dafb] flex items-center justify-center gap-1.5 border border-dashed border-[#334155] rounded-lg hover:border-[#61dafb]/40 transition-all mt-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add skill to {category}
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {/* Add new category */}
        <div className="bg-[#0f172a] rounded-xl border border-dashed border-[#334155] p-4">
          <p className="text-xs text-gray-500 font-medium mb-3">NEW CATEGORY</p>
          <div className="flex gap-3">
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addNewCategory(); } }}
              className="flex-1 bg-[#1e293b] border border-[#334155] rounded-xl py-2 px-4 text-white text-sm focus:outline-none focus:border-[#61dafb]"
              placeholder="e.g. Frameworks, Tools, Databases..."
            />
            <button
              type="button"
              onClick={addNewCategory}
              disabled={!newCategoryName.trim()}
              className="bg-[#61dafb]/10 text-[#61dafb] hover:bg-[#61dafb]/20 disabled:opacity-40 px-4 py-2 rounded-xl text-sm flex items-center gap-2 transition-all"
            >
              <Plus className="w-4 h-4" /> Create
            </button>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-[#334155]">
          <button type="submit" disabled={saving} className="bg-[#61dafb] text-[#0f172a] font-bold py-2.5 px-6 rounded-xl disabled:opacity-50 hover:opacity-90 flex items-center gap-2 transition-all">
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            Save All Skills
          </button>
        </div>
      </form>
    </div>
  );
};

export default SkillsAdmin;
