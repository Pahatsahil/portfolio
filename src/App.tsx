import { Routes, Route } from "react-router-dom";
import Portfolio from "./pages/Portfolio";
import Resume from "./pages/Resume";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminPanel from "./pages/admin/AdminPanel";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Toaster } from "sonner";

function App() {
  return (
    <>
      <Toaster position="top-right" theme="dark" />
      <Routes>
        <Route path="/" element={<Portfolio />} />
        <Route path="/resume" element={<Resume />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <AdminPanel />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </>
  );
}

export default App;
