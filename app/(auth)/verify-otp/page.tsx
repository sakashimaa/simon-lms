"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { authClient } from "@/lib/auth-client";
import { Loader } from "lucide-react";
import { notFound, useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

export default function VerifyOtpPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [otp, setOtp] = useState("");
  const [isPending, startTransition] = useTransition();

  const email = searchParams.get("email");

  if (!email) {
    return notFound();
  }

  async function handleVerifyOtp() {
    startTransition(async () => {
      await authClient.signIn.emailOtp({
        email: email as string,
        otp,
        fetchOptions: {
          onSuccess: () => {
            toast.success("OTP verified successfully");
            router.push("/");
          },
          onError: (err) => {
            console.log(err);
            toast.error("Invalid OTP");
            setOtp("");
          },
        },
      });
    });
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <CardTitle>Verify OTP</CardTitle>
        <CardDescription className="text-muted-foreground tracking-tight">
          Enter the code sent to {email}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 items-center justify-center">
        <InputOTP maxLength={6} value={otp} onChange={(e) => setOtp(e)}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>

        <Button
          className="w-full"
          onClick={handleVerifyOtp}
          disabled={isPending}
          variant="secondary"
        >
          {isPending ? (
            <>
              <Loader className="w-4 h-4 animate-spin" /> Working...
            </>
          ) : (
            "Verify Code"
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
