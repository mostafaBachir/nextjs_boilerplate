import { create } from "zustand";
import { toast } from "sonner";

export const useToastStore = create((set) => ({
  message: "",
  type: "info",
  showToast: (message, type = "info") => {
    // Appelle automatiquement le bon toast
    switch (type) {
      case "success":
        toast.success(message);
        break;
      case "error":
        toast.error(message);
        break;
      case "warning":
        toast.warning(message);
        break;
      case "info":
        toast.info(message);
        break;
      default:
        toast(message);
    }

    // Optionnel : stocke le message/type pour historique ou logs
    set({ message, type });
  },
}));