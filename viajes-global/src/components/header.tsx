"use client";

import { useState, useEffect } from "react";
import Nav from "@/components/nav";
import { useAuth } from "@/hooks/useAuth";
export default function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);


  const handleLogout = () => {
    logout();
  };

  if (!isClient) {
    return <div>Loading...</div>;
  }

  return (
    <Nav
      isLoggedIn={isAuthenticated}
      userEmail={user?.correo}
      onLogout={handleLogout}
    />
  );
}