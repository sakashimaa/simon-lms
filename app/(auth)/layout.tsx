import { buttonVariants } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Logo from "@/public/logo.svg";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center">
      <Link
        href="/"
        className={buttonVariants({
          variant: "outline",
          className: "absolute top-4 left-4",
        })}
      >
        <ArrowLeft className="size-4" />
        Back
      </Link>
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link
          className="flex items-center gap-2 self-center font-medium"
          href="/"
        >
          <Image src={Logo} alt="Logo" className="size-10" />
          SimonLMS
        </Link>
        {children}
        <div className="text-balance text-xs text-muted-foreground text-center">
          By clicking continue, you agree to out{" "}
          <span className="hover:text-primary cursor-pointer hover:underline ">
            Terms of Service
          </span>{" "}
          and{" "}
          <span className="hover:text-primary cursor-pointer hover:underline ">
            Privacy Policy
          </span>
        </div>
      </div>
    </div>
  );
}
