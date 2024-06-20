import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useSupabaseAuth } from "@/integrations/supabase/auth.jsx";

const Navbar = () => {
  const { logout } = useSupabaseAuth();

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-lg font-bold">
          MyApp
        </Link>
        <Button variant="destructive" onClick={logout}>
          Logout
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;