"use server";

import { requireUser } from "@/hooks/require-user";
import { prisma } from "@/lib/prisma";
import { ApiResponse } from "@/utils/types";
import { lessonSchema, LessonSchema } from "@/utils/zod-schemas";
import { notFound } from "next/navigation";

export async function getLesson(
  courseId: string,
  chapterId: string,
  lessonId: string
) {
  const user = await requireUser();

  const data = await prisma.lesson.findUnique({
    where: {
      id: lessonId,
    },
    select: {
      title: true,
      videoKey: true,
      thumbnailKey: true,
      description: true,
      id: true,
      position: true,
    },
  });

  if (!data) {
    return notFound();
  }

  return data;
}

export async function updateLesson(
  lessonId: string,
  data: LessonSchema
): Promise<ApiResponse> {
  const user = await requireUser();

  try {
    const values = lessonSchema.safeParse(data);

    if (!values.success) {
      return {
        status: "error",
        message: "Invalid Form Data",
      };
    }

    await prisma.lesson.update({
      where: {
        id: lessonId,
      },
      data: {
        title: values.data.name,
        description: values.data.description,
        videoKey: values.data.videoKey,
        thumbnailKey: values.data.thumbnailKey,
      },
    });

    return {
      status: "success",
      message: "Lesson updated successfully",
    };
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      message: "Something went wrong. Try again later.",
    };
  }
}

export type Lesson = Awaited<ReturnType<typeof getLesson>>;
