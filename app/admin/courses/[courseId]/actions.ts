"use server";

import { requireUser } from "@/hooks/require-user";
import { CourseLevel, CourseStatus } from "@/lib/generated/prisma";
import { prisma } from "@/lib/prisma";
import { ApiResponse } from "@/utils/types";
import {
  chapterSchema,
  ChapterSchema,
  courseSchema,
  CourseSchema,
  lessonSchema,
  LessonSchema,
} from "@/utils/zod-schemas";
import { revalidatePath } from "next/cache";
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

export async function reorderLessons(
  chapterId: string,
  lessons: { id: string; position: number }[],
  courseId: string
): Promise<ApiResponse> {
  const user = await requireUser();

  try {
    if (!lessons || lessons.length === 0) {
      return {
        status: "error",
        message: "No lessons provided for reordering",
      };
    }

    const updates = lessons.map((lesson) =>
      prisma.lesson.update({
        where: {
          id: lesson.id,
          chapterId,
        },
        data: {
          position: lesson.position,
        },
      })
    );

    await prisma.$transaction(updates);

    revalidatePath(`/admin/courses/${courseId}/edit`);

    return {
      status: "success",
      message: "Lessons reordered successfully",
    };
  } catch (error) {
    return {
      status: "error",
      message: "Something went wrong",
    };
  }
}

export async function reorderChapters(
  courseId: string,
  chapters: { id: string; position: number }[]
): Promise<ApiResponse> {
  const user = await requireUser();

  try {
    if (!chapters || chapters.length === 0) {
      return {
        status: "error",
        message: "No chapters provided for reordering",
      };
    }

    const updates = chapters.map((chapter) =>
      prisma.chapter.update({
        where: {
          id: chapter.id,
          courseId,
        },
        data: {
          position: chapter.position,
        },
      })
    );

    await prisma.$transaction(updates);

    revalidatePath(`/admin/courses/${courseId}/edit`);

    return {
      status: "success",
      message: "Chapters reordered successfully",
    };
  } catch (error) {
    return {
      status: "error",
      message: "Something went wrong. Try again later.",
    };
  }
}

export async function createChapter(data: ChapterSchema): Promise<ApiResponse> {
  const user = await requireUser();

  try {
    const values = chapterSchema.safeParse(data);

    if (!values.success) {
      return {
        status: "error",
        message: "Invalid Form Data",
      };
    }

    await prisma.$transaction(async (tx) => {
      const maxPosition = await tx.chapter.findFirst({
        where: {
          courseId: values.data.courseId,
        },
        select: {
          position: true,
        },
        orderBy: {
          position: "desc",
        },
      });

      await tx.chapter.create({
        data: {
          title: values.data.name,
          courseId: values.data.courseId,
          position: (maxPosition?.position ?? 0) + 1,
        },
      });

      revalidatePath(`/admin/courses/${values.data.courseId}/edit`);
    });

    return {
      status: "success",
      message: "Chapter created successfully",
    };
  } catch (error) {
    return {
      status: "error",
      message: "Something went wrong. Try again later.",
    };
  }
}

export async function createLesson(data: LessonSchema): Promise<ApiResponse> {
  const user = await requireUser();

  try {
    const values = lessonSchema.safeParse(data);

    if (!values.success) {
      return {
        status: "error",
        message: "Invalid Form Data",
      };
    }

    await prisma.$transaction(async (tx) => {
      const maxPosition = await tx.lesson.findFirst({
        where: {
          chapterId: values.data.chapterId,
        },
        select: {
          position: true,
        },
        orderBy: {
          position: "desc",
        },
      });

      await tx.lesson.create({
        data: {
          title: values.data.name,
          description: values.data.description,
          videoKey: values.data.videoKey,
          thumbnailKey: values.data.thumbnailKey,
          position: (maxPosition?.position ?? 0) + 1,
          chapterId: values.data.chapterId,
        },
      });

      revalidatePath(`/admin/courses/${values.data.courseId}/edit`);
    });

    return {
      status: "success",
      message: "Lesson created successfully",
    };
  } catch (error) {
    return {
      status: "error",
      message: "Something went wrong. Try again later.",
    };
  }
}

export async function deleteLesson({
  chapterId,
  courseId,
  lessonId,
}: {
  chapterId: string;
  courseId: string;
  lessonId: string;
}): Promise<ApiResponse> {
  const user = await requireUser();

  try {
    const chapterWithLessons = await prisma.chapter.findUnique({
      where: {
        id: chapterId,
        courseId,
      },
      select: {
        lessons: {
          orderBy: {
            position: "asc",
          },
          select: {
            id: true,
            position: true,
          },
        },
      },
    });

    if (!chapterWithLessons) {
      return {
        status: "error",
        message: "Chapter not found",
      };
    }

    const lessons = chapterWithLessons.lessons;

    const lessonToDelete = lessons.find((lesson) => lesson.id === lessonId);
    if (!lessonToDelete) {
      return {
        status: "error",
        message: "Lesson not found in the chapter",
      };
    }

    const remainingLessons = lessons.filter((lesson) => lesson.id !== lessonId);

    const updates = remainingLessons.map((lesson, index) => {
      return prisma.lesson.update({
        where: { id: lesson.id },
        data: { position: index + 1 },
      });
    });

    await prisma.$transaction([
      ...updates,
      prisma.lesson.delete({
        where: { id: lessonId, chapterId },
      }),
    ]);

    revalidatePath(`/admin/courses/${user.id}/edit`);

    return {
      status: "success",
      message: "Lesson deleted successfully",
    };
  } catch (error) {
    return {
      status: "error",
      message: "Something went wrong. Try again later.",
    };
  }
}

export async function deleteChapter({
  chapterId,
  courseId,
}: {
  chapterId: string;
  courseId: string;
}): Promise<ApiResponse> {
  const user = await requireUser();

  try {
    const courseWithChapters = await prisma.course.findUnique({
      where: {
        id: courseId,
      },
      select: {
        chapters: {
          orderBy: {
            position: "asc",
          },
          select: {
            id: true,
            position: true,
          },
        },
      },
    });

    if (!courseWithChapters) {
      return {
        status: "error",
        message: "Course not found",
      };
    }

    const chapters = courseWithChapters.chapters;

    const chapterToDelete = chapters.find(
      (chapter) => chapter.id === chapterId
    );
    if (!chapterToDelete) {
      return {
        status: "error",
        message: "Chapter not found in the course",
      };
    }

    const remainingChapters = chapters.filter(
      (chapter) => chapter.id !== chapterId
    );

    const updates = remainingChapters.map((chapter, index) => {
      return prisma.chapter.update({
        where: { id: chapter.id },
        data: { position: index + 1 },
      });
    });

    await prisma.$transaction([
      ...updates,
      prisma.chapter.delete({
        where: { id: chapterId, courseId },
      }),
    ]);

    revalidatePath(`/admin/courses/${user.id}/edit`);

    return {
      status: "success",
      message: "Chapter deleted successfully",
    };
  } catch (error) {
    return {
      status: "error",
      message: "Something went wrong. Try again later.",
    };
  }
}

export type Course = Awaited<ReturnType<typeof getCourse>>;
