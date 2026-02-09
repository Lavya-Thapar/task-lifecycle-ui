"use client";

import { useRouter } from "next/navigation";
import { logoutUser } from "../services/auth";

const LogoutButton = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logoutUser();
      localStorage.clear();
      router.replace("/login");
    } catch (error) {
      console.error(error);
      alert("Logout failed");
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="logout-btn"
    >
      Logout
    </button>
  );
};

export default LogoutButton;
