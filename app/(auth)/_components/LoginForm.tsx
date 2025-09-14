"use client";

import { GitHub } from "@/components/logos/Github";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { emailOtpSchema, EmailOtpSchema } from "@/utils/zod-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export function LoginForm() {
  const [isPendingGithub, startTransitionGithub] = useTransition();
  const [isPendingEmail, startTransitionEmail] = useTransition();
  const router = useRouter();

  const form = useForm<EmailOtpSchema>({
    resolver: zodResolver(emailOtpSchema),
    defaultValues: {
      email: "",
    },
  });

  async function handleGithubLogin() {
    startTransitionGithub(async () => {
      await authClient.signIn.social({
        provider: "github",
        callbackURL: "/",
        fetchOptions: {
          onSuccess: () => {
            toast.success("Login successful, you will be redirected...");
          },
          onError: () => {
            toast.error("Login failed. Try again later.");
          },
        },
      });
    });
  }

  async function onSubmit(data: EmailOtpSchema) {
    startTransitionEmail(async () => {
      await authClient.emailOtp.sendVerificationOtp({
        email: data.email,
        type: "sign-in",
      });

      toast.success("Verification code sent to your email");
      router.push(`/verify-otp?email=${data.email}`);
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Welcome Back!</CardTitle>
        <CardDescription>
          Login with your github or email account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          className="w-full"
          variant="outline"
          onClick={handleGithubLogin}
          disabled={isPendingGithub}
        >
          {isPendingGithub ? (
            <>
              <Loader className="size-4 animate-spin" /> Working...
            </>
          ) : (
            <>
              <GitHub className="size-4" /> Sign In with Github
            </>
          )}
        </Button>

        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
          <span className="relative z-10 bg-card px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>

        <div className="grid gap-3">
          <div className="grid gap-2">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-2"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="johndoe@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isPendingEmail}
                  variant="secondary"
                >
                  {isPendingEmail ? (
                    <>
                      <Loader className="size-4 animate-spin" /> Working...
                    </>
                  ) : (
                    <>
                      <Mail className="size-4" />
                      Continue with email
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
