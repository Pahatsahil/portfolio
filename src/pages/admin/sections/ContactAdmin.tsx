import { useState, useEffect } from "react";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db, COLLECTIONS } from "../../../lib/firebase";
import { Loader2, Save, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

interface ContactData {
  email: string;
  phone: string;
  showEmail: boolean;
  showPhone: boolean;
}

const ContactAdmin = () => {
  const [data, setData] = useState<ContactData>({
    email: "",
    phone: "",
    showEmail: false,
    showPhone: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchContact = async () => {
      try {
        if (!db) return;
        const docRef = doc(db, COLLECTIONS.CONTACT, "main");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const d = docSnap.data();
          setData({
            email: d.email || "",
            phone: d.phone || "",
            showEmail: d.showEmail || false,
            showPhone: d.showPhone || false,
          });
        }
      } catch (error) {
        console.error("Error fetching contact:", error);
        toast.error("Failed to load contact settings");
      } finally {
        setLoading(false);
      }
    };
    fetchContact();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db) { toast.error("Database not initialized"); return; }
    setSaving(true);
    try {
      const docRef = doc(db, COLLECTIONS.CONTACT, "main");
      await setDoc(docRef, { ...data, updatedAt: serverTimestamp() }, { merge: true });
      toast.success("Contact settings saved successfully");
    } catch (error) {
      console.error("Error saving contact:", error);
      toast.error("Failed to save contact settings");
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
          <h2 className="text-xl font-bold font-['Space_Grotesk'] text-white">Contact Config</h2>
          <p className="text-gray-400 text-sm">
            Control what contact info is publicly visible on your portfolio and resume.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Email */}
        <div className="bg-[#0f172a] p-5 rounded-xl border border-[#334155]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white">Email Address</h3>
            <button
              type="button"
              onClick={() => setData({ ...data, showEmail: !data.showEmail })}
              className={`flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg transition-all ${
                data.showEmail
                  ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                  : "bg-[#1e293b] text-gray-400 hover:text-white"
              }`}
            >
              {data.showEmail ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              {data.showEmail ? "Visible Publicly" : "Hidden"}
            </button>
          </div>
          <input
            type="email"
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
            className="w-full bg-[#1e293b] border border-[#334155] rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-[#61dafb] transition-all"
            placeholder="you@email.com"
          />
          <p className="text-xs text-gray-500 mt-2">
            {data.showEmail
              ? "✓ Email will be shown on your portfolio contact section and resume."
              : "Email is hidden from public view."}
          </p>
        </div>

        {/* Phone */}
        <div className="bg-[#0f172a] p-5 rounded-xl border border-[#334155]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white">Phone Number</h3>
            <button
              type="button"
              onClick={() => setData({ ...data, showPhone: !data.showPhone })}
              className={`flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg transition-all ${
                data.showPhone
                  ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                  : "bg-[#1e293b] text-gray-400 hover:text-white"
              }`}
            >
              {data.showPhone ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              {data.showPhone ? "Visible Publicly" : "Hidden"}
            </button>
          </div>
          <input
            type="text"
            value={data.phone}
            onChange={(e) => setData({ ...data, phone: e.target.value })}
            className="w-full bg-[#1e293b] border border-[#334155] rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-[#61dafb] transition-all"
            placeholder="+91 98765 43210"
          />
          <p className="text-xs text-gray-500 mt-2">
            {data.showPhone
              ? "✓ Phone will be shown on your resume."
              : "Phone is hidden from public view."}
          </p>
        </div>

        <div className="flex justify-end pt-4 border-t border-[#334155]">
          <button
            type="submit"
            disabled={saving}
            className="bg-[#61dafb] text-[#0f172a] font-bold py-2.5 px-6 rounded-xl disabled:opacity-50 hover:opacity-90 flex items-center gap-2 transition-all"
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            Save Contact Settings
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContactAdmin;
