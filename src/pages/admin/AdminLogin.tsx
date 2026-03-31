import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { useNavigate } from "react-router-dom";
import { Loader2, Lock, Mail } from "lucide-react";
import { toast } from "sonner"; // Assuming sonner is installed based on standard setup, or window.alert as fallback

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) {
      toast.error("Firebase auth is not initialized");
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/admin");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Invalid login credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#1e293b]/50 p-8 rounded-2xl border border-[#334155] backdrop-blur-sm shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#0f172a] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#334155]">
            <Lock className="w-8 h-8 text-[#61dafb]" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2 font-['Space_Grotesk']">
            Admin Access
          </h1>
          <p className="text-gray-400 text-sm">
            Please sign in to access the portfolio dashboard
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 ml-1">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0f172a] border border-[#334155] rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-[#61dafb] focus:ring-1 focus:ring-[#61dafb] transition-all"
                placeholder="admin@example.com"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 ml-1">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#0f172a] border border-[#334155] rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-[#61dafb] focus:ring-1 focus:ring-[#61dafb] transition-all"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#61dafb] to-[#818cf8] text-[#0f172a] font-bold py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              "Sign In"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
