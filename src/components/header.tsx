"use client";

import { useState, useEffect } from "react";
import Nav from "@/components/nav";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
export default function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
  const router = useRouter();
  const handleLogout = () => {
    router.push("/ingreso");
    logout();
  };

  if (!isClient) {
    return <div>Loading...</div>;
  }

  return (
    <Nav
      isLoggedIn={isAuthenticated}
      userEmail={user?.email}
      onLogout={handleLogout}
    />
  );
}