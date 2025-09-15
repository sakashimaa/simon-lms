"use server";

import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export async function getPublicFacingCourses() {
  const data = await prisma.course.findMany({
    where: {
      status: "Published",
    },
    select: {
      id: true,
      title: true,
      price: true,
      smallDescription: true,
      slug: true,
      fileKey: true,
      level: true,
      duration: true,
      category: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return data;
}

export async function getPublicFacingCourseBySlug(slug: string) {
  const data = await prisma.course.findUnique({
    where: {
      slug,
      status: "Published",
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
          lessons: {
            select: {
              id: true,
              title: true,
            },
            orderBy: {
              position: "asc",
            },
          },
        },
        orderBy: {
          position: "asc",
        },
      },
    },
  });

  if (!data) {
    return notFound();
  }

  return data;
}

export type PublicCourse = Awaited<
  ReturnType<typeof getPublicFacingCourses>
>[0];

export type PublicCourseBySlug = Awaited<
  ReturnType<typeof getPublicFacingCourseBySlug>
>;
