"use server";

import { requireUser } from "@/hooks/require-user";
import { prisma } from "@/lib/prisma";
import { ApiResponse } from "@/utils/types";
import { revalidatePath } from "next/cache";

export async function deleteCourse(courseId: string): Promise<ApiResponse> {
  const user = await requireUser();

  try {
    await prisma.course.delete({
      where: {
        id: courseId,
        userId: user.id,
      },
    });

    revalidatePath(`/admin/courses`);

    return {
      status: "success",
      message: "Course deleted successfully",
    };
  } catch (error) {
    return {
      status: "error",
      message: "Something went wrong. Try again later.",
    };
  }
}
