import { useState, lazy, Suspense } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { useNavigate } from "react-router-dom";
import {
  LogOut,
  Settings,
  Briefcase,
  Code2,
  GraduationCap,
  Award,
  User,
  Phone,
  FileText,
  Loader2,
  ArrowLeft,
} from "lucide-react";

const BasicsAdmin = lazy(() => import("./sections/BasicsAdmin"));
const ExperienceAdmin = lazy(() => import("./sections/ExperienceAdmin"));
const ProjectsAdmin = lazy(() => import("./sections/ProjectsAdmin"));
const SkillsAdmin = lazy(() => import("./sections/SkillsAdmin"));
const EducationAdmin = lazy(() => import("./sections/EducationAdmin"));
const CertificationsAdmin = lazy(
  () => import("./sections/CertificationsAdmin"),
);
const ContactAdmin = lazy(() => import("./sections/ContactAdmin"));
const ResumeSettingsAdmin = lazy(
  () => import("./sections/ResumeSettingsAdmin"),
);

const SectionLoader = () => (
  <div className="flex justify-center p-16">
    <Loader2 className="w-8 h-8 animate-spin text-[#61dafb]" />
  </div>
);

const tabs = [
  { id: "basics", label: "Basics", icon: User },
  { id: "experience", label: "Experience", icon: Briefcase },
  { id: "projects", label: "Projects", icon: Code2 },
  { id: "skills", label: "Skills", icon: Settings },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "certifications", label: "Certifications", icon: Award },
  { id: "contact", label: "Contact Config", icon: Phone },
  { id: "resume-settings", label: "Resume Settings", icon: FileText },
];

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("basics");
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
      navigate("/admin/login");
    }
  };

  return (
    // Outer shell: full-height flex row, no scroll on the shell itself
    <div className="flex h-screen bg-[#0f172a] text-white overflow-hidden">
      {/* ── Sidebar (fixed height, independent scroll) ── */}
      <aside className="w-64 flex-shrink-0 flex flex-col bg-[#1e293b]/80 border-r border-[#334155]">
        {/* Logo — never scrolls away */}
        <div className="flex-shrink-0 p-6 border-b border-[#334155]">
          <a href="/" className="toolbar-back">
            <ArrowLeft size={24} />
            <h1 className="text-xl font-bold font-['Space_Grotesk'] tracking-wide">
              Portfolio <span className="text-[#61dafb]">Admin</span>
            </h1>
          </a>
        </div>

        {/* Nav — scrolls independently when tabs overflow */}
        <nav className="flex-1 overflow-y-auto py-3">
          <ul className="space-y-0.5 px-3">
            {tabs.map(({ id, label, icon: Icon }) => {
              const isActive = activeTab === id;
              return (
                <li key={id}>
                  <button
                    onClick={() => setActiveTab(id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                      isActive
                        ? "bg-[#61dafb]/10 text-[#61dafb] font-semibold"
                        : "text-gray-400 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    {label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Sign-out — always pinned to the bottom */}
        <div className="flex-shrink-0 p-4 border-t border-[#334155]">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 justify-center py-2.5 text-gray-400 hover:text-red-400 transition-colors rounded-lg hover:bg-red-400/10 text-sm"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ── Main content (scrolls independently) ── */}
      <main className="flex-1 overflow-y-auto p-8 bg-[#0a0f1e]">
        <div className="max-w-4xl mx-auto">
          <Suspense fallback={<SectionLoader />}>
            {activeTab === "basics" && <BasicsAdmin />}
            {activeTab === "experience" && <ExperienceAdmin />}
            {activeTab === "projects" && <ProjectsAdmin />}
            {activeTab === "skills" && <SkillsAdmin />}
            {activeTab === "education" && <EducationAdmin />}
            {activeTab === "certifications" && <CertificationsAdmin />}
            {activeTab === "contact" && <ContactAdmin />}
            {activeTab === "resume-settings" && <ResumeSettingsAdmin />}
          </Suspense>
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;
