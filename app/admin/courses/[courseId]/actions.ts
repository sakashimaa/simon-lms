"use server";

import { requireUser } from "@/hooks/require-user";
import { CourseLevel, CourseStatus } from "@/lib/generated/prisma";
import { prisma } from "@/lib/prisma";
import { ApiResponse } from "@/utils/types";
import { courseSchema, CourseSchema } from "@/utils/zod-schemas";
import { notFound } from "next/navigation";

export async function getCourse(courseId: string) {
  const user = await requireUser();

  const course = await prisma.course.findUnique({
    where: {
      id: courseId,
      userId: user.id,
    },
    select: {
      id: true,
      title: true,
      description: true,
      fileKey: true,
      price: true,
      duration: true,
      level: true,
      category: true,
      smallDescription: true,
      slug: true,
      status: true,
      chapters: {
        select: {
          id: true,
          title: true,
          position: true,
          lessons: {
            select: {
              id: true,
              title: true,
              description: true,
              thumbnailKey: true,
              videoKey: true,
              position: true,
            },
          },
        },
      },
    },
  });

  if (!course) {
    return notFound();
  }

  return course;
}

export async function updateCourse(
  courseId: string,
  data: CourseSchema
): Promise<ApiResponse> {
  try {
    const user = await requireUser();

    const values = courseSchema.safeParse(data);

    if (!values.success) {
      return {
        status: "error",
        message: "Invalid Form Data",
      };
    }

    await prisma.course.update({
      where: {
        id: courseId,
        userId: user.id,
      },
      data: {
        ...values.data,
        level: values.data.level as CourseLevel,
        status: values.data.status as CourseStatus,
      },
    });

    return {
      status: "success",
      message: "Course updated successfully",
    };
  } catch (error) {
    return {
      status: "error",
      message: "Something went wrong",
    };
  }
}

export type Course = Awaited<ReturnType<typeof getCourse>>;
