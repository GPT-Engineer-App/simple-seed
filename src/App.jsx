import { Route, BrowserRouter as Router, Routes, Navigate } from "react-router-dom";
import Index from "./pages/Index.jsx";

import Navbar from "./components/Navbar.jsx"; // Import the Navbar component
import { useSupabaseAuth, SupabaseAuthUI } from "./integrations/supabase/auth.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

function App() {
  const { session } = useSupabaseAuth();

  const Login = () => (
    <div className="h-screen w-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md mx-auto">
        <SupabaseAuthUI />
      </div>
    </div>
  );
  return (
    <Router>
      <Navbar /> {/* Add the Navbar component here */}
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Index />
            </ProtectedRoute>
          }
        />
        <Route
          path="/login"
          element={session ? <Navigate to="/" replace /> : <Login />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
