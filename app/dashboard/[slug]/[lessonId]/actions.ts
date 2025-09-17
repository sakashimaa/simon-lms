"use server";

import { requireUser } from "@/hooks/require-user";
import { prisma } from "@/lib/prisma";
import { ApiResponse } from "@/utils/types";
import { revalidatePath } from "next/cache";

export async function MarkLessonAsComplete(
  lessonId: string,
  slug: string
): Promise<ApiResponse> {
  const user = await requireUser();

  try {
    await prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId: user.id,
          lessonId,
        },
      },
      update: {
        completed: true,
      },
      create: {
        lessonId,
        userId: user.id,
        completed: true,
      },
    });

    revalidatePath(`/dashboard/${slug}`);

    return {
      status: "success",
      message: "Progress updated successfully",
    };
  } catch {
    return {
      status: "error",
      message: "Failed mark lesson as complete. Try again later.",
    };
  }
}
