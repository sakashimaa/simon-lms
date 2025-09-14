"use client";

import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function useSignout() {
  const router = useRouter();

  const handleSignOut = async function handleLogout() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("Logged out successfully");
          router.push("/login");
        },
        onError: () => {
          toast.error("Failed to log out. Try again later");
        },
      },
    });
  };

  return handleSignOut;
}
