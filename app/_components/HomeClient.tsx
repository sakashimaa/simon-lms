"use client";

import { ThemeToggler } from "@/components/general/theme-toggler";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Loader } from "lucide-react";
import { toast } from "sonner";

export function HomeClient() {
  const [isPendingLogout, startTransitionLogout] = useTransition();
  const router = useRouter();

  const { data: session, isPending, error, refetch } = authClient.useSession();

  async function signOut() {
    startTransitionLogout(async () => {
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
    });
  }

  return (
    <div>
      <ThemeToggler />
      {session ? (
        <div>
          <p>{session.user.name}</p>
          <Button onClick={signOut} disabled={isPendingLogout}>
            {isPendingLogout ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              "Logout"
            )}
          </Button>
        </div>
      ) : (
        <Button onClick={() => router.push("/login")}>Login</Button>
      )}
    </div>
  );
}
