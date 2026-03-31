import { useState, useEffect } from "react";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db, COLLECTIONS } from "../../../lib/firebase";
import {
  Loader2,
  Save,
  Eye,
  EyeOff,
  LayoutGrid,
  LayoutList,
  Plus,
  Minus,
  Palette,
  FileText,
} from "lucide-react";
import { toast } from "sonner";
import { useExperience, useProjects, useResumeSettings, type ResumeSettings, DEFAULT_RESUME_SETTINGS } from "../../../hooks/usePortfolioData";

const ResumeSettingsAdmin = () => {
  const { settings: currentSettings, loading: settingsLoading } = useResumeSettings();
  const [settings, setSettings] = useState<ResumeSettings>(DEFAULT_RESUME_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const { experiences, loading: expLoading } = useExperience();
  const { projects, loading: projLoading } = useProjects();

  useEffect(() => {
    if (!settingsLoading && currentSettings) {
      setSettings(currentSettings);
    }
  }, [settingsLoading, currentSettings]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db) {
      toast.error("Database not initialized");
      return;
    }
    setSaving(true);
    try {
      await setDoc(
        doc(db, COLLECTIONS.RESUME_SETTINGS, "main"),
        { ...settings, updatedAt: serverTimestamp() },
        { merge: true },
      );
      toast.success("Resume settings saved — changes are live immediately.");
    } catch (err) {
      console.error("Error saving resume settings:", err);
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const toggle = (key: keyof ResumeSettings) =>
    setSettings((s) => ({ ...s, [key]: !s[key as keyof typeof s] }));

  const bumpLimit = (id: string, delta: number, max: number) => {
    setSettings((s) => {
      const cur = s.jobLimits[id] ?? max;
      const next = Math.max(0, Math.min(max, cur + delta));
      return { ...s, jobLimits: { ...s.jobLimits, [id]: next } };
    });
  };

  const toggleProjectVisibility = (id: string) => {
    setSettings((s) => {
      const currentVis = s.projectVisibility?.[id] ?? true; // true by default
      return {
        ...s,
        projectVisibility: {
          ...(s.projectVisibility || {}),
          [id]: !currentVis,
        },
      };
    });
  };

  const sections: { key: keyof ResumeSettings; label: string; desc: string }[] =
    [
      {
        key: "showBio",
        label: "Bio / Summary",
        desc: "The short paragraph at the top of the main column",
      },
      {
        key: "showSkills",
        label: "Skills",
        desc: "The skills section in the sidebar",
      },
      {
        key: "showEducation",
        label: "Education",
        desc: "Degrees listed in the sidebar",
      },
      {
        key: "showCerts",
        label: "Certifications",
        desc: "Certificates listed in the sidebar",
      },
      {
        key: "showProjects",
        label: "Projects",
        desc: "Projects section in the main column",
      },
    ];

  if (settingsLoading || expLoading || projLoading || !settings)
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-[#61dafb]" />
      </div>
    );

  return (
    <div className="bg-[#1e293b]/50 p-6 rounded-xl border border-[#334155]">
      <div className="mb-6">
        <h2 className="text-xl font-bold font-['Space_Grotesk'] text-white">
          Resume Settings
        </h2>
        <p className="text-gray-400 text-sm">
          Control how your resume looks when someone opens{" "}
          <code className="text-[#61dafb] text-xs">/resume</code>. Changes are
          persisted in Firestore — no code edits needed.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">

        {/* Theme Toggle */}
        <div className="bg-[#0f172a] rounded-xl border border-[#334155] p-5">
          <h3 className="font-semibold text-white mb-1">Theme</h3>
          <p className="text-xs text-gray-500 mb-4">
            Select the overall design and aesthetic of your resume.
          </p>
          <div className="grid grid-cols-2 gap-3">
            {(
              [
                {
                  val: "classic",
                  Icon: FileText,
                  label: "Classic (Deedy)",
                  desc: "Clean, white, minimalist",
                },
                {
                  val: "modern",
                  Icon: Palette,
                  label: "Modern Dark",
                  desc: "Dark background, vibrant headers",
                },
              ] as const
            ).map(({ val, Icon, label, desc }) => (
              <button
                key={val}
                type="button"
                onClick={() => setSettings((s) => ({ ...s, theme: val }))}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                  settings.theme === val
                    ? "border-[#61dafb] bg-[#61dafb]/10 text-white"
                    : "border-[#334155] text-gray-400 hover:border-[#334155]/80 hover:text-gray-300"
                }`}
              >
                <Icon
                  className={`w-8 h-8 ${settings.theme === val ? "text-[#61dafb]" : "text-gray-600"}`}
                />
                <span className="font-semibold text-sm">{label}</span>
                <span className="text-xs text-gray-500 text-center">{desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Layout Toggle */}
        <div className="bg-[#0f172a] rounded-xl border border-[#334155] p-5">
          <h3 className="font-semibold text-white mb-1">Layout</h3>
          <p className="text-xs text-gray-500 mb-4">
            Choose between a traditional single-column or a modern two-column
            (sidebar + main) layout.
          </p>
          <div className="grid grid-cols-2 gap-3">
            {(
              [
                {
                  val: "1col",
                  Icon: LayoutList,
                  label: "Single Column",
                  desc: "Classic top-to-bottom",
                },
                {
                  val: "2col",
                  Icon: LayoutGrid,
                  label: "Two Column",
                  desc: "Sidebar + Main (recommended)",
                },
              ] as const
            ).map(({ val, Icon, label, desc }) => (
              <button
                key={val}
                type="button"
                onClick={() => setSettings((s) => ({ ...s, layout: val }))}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                  settings.layout === val
                    ? "border-[#61dafb] bg-[#61dafb]/10 text-white"
                    : "border-[#334155] text-gray-400 hover:border-[#334155]/80 hover:text-gray-300"
                }`}
              >
                <Icon
                  className={`w-8 h-8 ${settings.layout === val ? "text-[#61dafb]" : "text-gray-600"}`}
                />
                <span className="font-semibold text-sm">{label}</span>
                <span className="text-xs text-gray-500">{desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Section Visibility */}
        <div className="bg-[#0f172a] rounded-xl border border-[#334155] p-5">
          <h3 className="font-semibold text-white mb-1">Section Visibility</h3>
          <p className="text-xs text-gray-500 mb-4">
            Toggle which sections appear on the printed/downloaded resume.
          </p>
          <div className="space-y-2">
            {sections.map(({ key, label, desc }) => {
              const isOn = settings[key] as boolean;
              return (
                <div
                  key={key}
                  className={`flex items-center justify-between p-3 rounded-lg transition-colors ${isOn ? "bg-[#1e293b]" : "bg-[#0d1117]"}`}
                >
                  <div>
                    <p
                      className={`text-sm font-medium ${isOn ? "text-white" : "text-gray-500"}`}
                    >
                      {label}
                    </p>
                    <p className="text-xs text-gray-600">{desc}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggle(key)}
                    className={`flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg transition-all flex-shrink-0 ml-4 ${
                      isOn
                        ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                        : "bg-[#334155]/50 text-gray-500 hover:text-white"
                    }`}
                  >
                    {isOn ? (
                      <Eye className="w-4 h-4" />
                    ) : (
                      <EyeOff className="w-4 h-4" />
                    )}
                    {isOn ? "Shown" : "Hidden"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Job Bullet Limits */}
        <div className="bg-[#0f172a] rounded-xl border border-[#334155] p-5">
          <h3 className="font-semibold text-white mb-1">Experience Detail Level</h3>
          <p className="text-xs text-gray-500 mb-4">
            Control the maximum number of bullet points shown for each job. Useful for keeping your resume to one page!
          </p>
          <div className="space-y-3">
            {experiences.map((exp) => {
              const max = exp.highlights.length;
              const cur = settings.jobLimits[exp.id] ?? max;
              return (
                <div key={exp.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-lg bg-[#1e293b]">
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-medium text-white truncate">{exp.company}</span>
                    <span className="text-xs text-gray-400 truncate">{exp.title}</span>
                  </div>
                  <div className="flex items-center gap-4 bg-[#0f172a] p-1.5 rounded-lg border border-[#334155] flex-shrink-0">
                    <button
                      type="button"
                      className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-md transition-all disabled:opacity-30 disabled:hover:bg-transparent"
                      onClick={() => bumpLimit(exp.id, -1, max)}
                      disabled={cur === 0}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <div className="flex flex-col items-center min-w-[3rem]">
                      <span className="text-sm font-bold text-[#61dafb] leading-none">{cur}</span>
                      <span className="text-[0.6rem] text-gray-500 uppercase tracking-widest mt-1">of {max}</span>
                    </div>
                    <button
                      type="button"
                      className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-md transition-all disabled:opacity-30 disabled:hover:bg-transparent"
                      onClick={() => bumpLimit(exp.id, 1, max)}
                      disabled={cur === max}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Project Resume Limits */}
        <div className="bg-[#0f172a] rounded-xl border border-[#334155] p-5">
          <h3 className="font-semibold text-white mb-1">Project Inclusion</h3>
          <p className="text-xs text-gray-500 mb-4">
            Select which projects should appear specifically on the printed/downloaded resume. This only affects the resume, not the public website.
          </p>
          <div className="space-y-3">
            {projects.map((proj) => {
              const isShown = settings.projectVisibility?.[proj.id] ?? true;
              return (
                <div key={proj.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-lg bg-[#1e293b]">
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-medium text-white truncate">{proj.title}</span>
                    <span className="text-xs text-gray-400 truncate">{proj.subtitle}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleProjectVisibility(proj.id)}
                    className={`flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg transition-all flex-shrink-0 ${
                      isShown
                        ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                        : "bg-[#334155]/50 text-gray-500 hover:text-white"
                    }`}
                  >
                    {isShown ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    {isShown ? "Included" : "Excluded"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

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
            Save & Apply to Live Resume
          </button>
        </div>
      </form>
    </div>
  );
};

export default ResumeSettingsAdmin;
