"use server";

import { requireUser } from "@/hooks/require-user";
import { CourseLevel, CourseStatus } from "@/lib/generated/prisma";
import { prisma } from "@/lib/prisma";
import { ApiResponse } from "@/utils/types";
import { courseSchema, CourseSchema } from "@/utils/zod-schemas";
import { notFound } from "next/navigation";

export async function createCourse(data: CourseSchema): Promise<ApiResponse> {
  try {
    const user = await requireUser();
    const values = courseSchema.safeParse(data);

    if (!values.success) {
      return {
        status: "error",
        message: "Invalid Form Data",
      };
    }

    await prisma.course.create({
      data: {
        ...values.data,
        userId: user.id,
        status: values.data.status as CourseStatus,
        level: values.data.level as CourseLevel,
      },
    });

    return {
      status: "success",
      message: "Course created successfully",
    };
  } catch (error) {
    return {
      status: "error",
      message: "Something went wrong",
    };
  }
}

export async function getCourses() {
  const user = await requireUser();

  const courses = await prisma.course.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return courses;
}

export type Courses = Awaited<ReturnType<typeof getCourses>>;
