import { useState } from "react";

export const useToast = () => {
  const [toast, setToast] = useState({ 
    message: "", 
    type: "", 
    visible: false 
  });

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type, visible: true });

    // Auto-hide after 3 seconds
    setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 3000);
  };

  return { toast, showToast };
};