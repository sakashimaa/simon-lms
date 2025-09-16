"use client";

import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import { enrollInCourse } from "../actions";
import { toast } from "sonner";
import { Loader } from "lucide-react";

interface iAppProps {
  courseId: string;
}

export function EnrollmentButton({ courseId }: iAppProps) {
  const [isPending, startTransition] = useTransition();

  async function onSubmit() {
    startTransition(async () => {
      const result = await enrollInCourse(courseId);

      if (result.status === "error") {
        toast.error(result.message);
      } else {
        toast.success(result.message);
      }
    });
  }

  return (
    <Button className="w-full" onClick={onSubmit} disabled={isPending}>
      {isPending ? (
        <>
          <Loader className="size-4 animate-spin" /> Working...
        </>
      ) : (
        "Enroll Now"
      )}
    </Button>
  );
}
