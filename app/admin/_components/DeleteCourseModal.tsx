"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { ArrowLeft, Loader, Trash2 } from "lucide-react";
import Link from "next/link";
import { useTransition } from "react";
import { deleteCourse } from "../courses/[courseId]/delete/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function DeleteCourseModal({ courseId }: { courseId: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  async function onSubmit() {
    startTransition(async () => {
      const result = await deleteCourse(courseId);

      if (result.status === "error") {
        toast.error(result.message);
      } else {
        toast.success(result.message);
        router.push("/admin/courses");
      }
    });
  }

  return (
    <div className="max-w-xl mx-auto w-full">
      <Card className="mt-32">
        <CardHeader>
          <CardTitle>Are you sure?</CardTitle>
          <CardDescription>
            This action cannot be undone. This will permanently delete the
            course.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-end gap-2">
          <Link
            className={buttonVariants({ variant: "outline" })}
            href="/admin/courses"
          >
            Cancel
          </Link>

          <Button variant="destructive" onClick={onSubmit}>
            {isPending ? (
              <>
                <Loader className="size-4 animate-spin" /> Working...
              </>
            ) : (
              <>
                {" "}
                <Trash2 className="size-4" /> Delete
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
