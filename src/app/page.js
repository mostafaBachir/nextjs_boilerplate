"use client";

import { Button } from "@/components/ui/button";
import { useToastStore } from "@/store/toast-store";

export default function Home() {
  const { showToast } = useToastStore();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Button
        onClick={() => showToast("Hello depuis Zustand avec Sonner !", "success")}
      >
        Afficher la notification
      </Button>
    </div>
  );
}
