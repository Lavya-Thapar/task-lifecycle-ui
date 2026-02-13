"use client";

import { useRouter } from "next/navigation";
import { logoutUser } from "../services/auth";
import { useToast } from "../hooks/toast";

const LogoutButton = () => {
  const router = useRouter();
  const { toast, showToast } = useToast();

  const handleLogout = async () => {
    try {
      const success = await logoutUser(); 
      if (success) {
         localStorage.clear();
         showToast("Logged out successfully!", "success");
         
         // Wait 1 second before redirecting so user sees the toast
         setTimeout(() => {
             router.replace("/login");
         }, 1000);
      } else {
         showToast("Logout failed", "error");
      }
    } catch (error) {
      console.error(error);
      showToast("Logout failed", "error");
    }
  };

  return (
    <div>
      {toast.visible && (
          <div className={`toast-notification toast-${toast.type}`}>
            <span>{toast.message}</span>
          </div>
        )}
      <button
        onClick={handleLogout}
        className="logout-btn"
      >
        Logout
      </button>
    </div>
  );
};

export default LogoutButton;
