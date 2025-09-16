import "server-only";

import { requireUser } from "@/hooks/require-user";
import { prisma } from "@/lib/prisma";

export async function adminGetRecentCourses() {
  await requireUser();

  const data = await prisma.course.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 2,
    select: {
      id: true,
      title: true,
      smallDescription: true,
      duration: true,
      level: true,
      status: true,
      price: true,
      fileKey: true,
      slug: true,
    },
  });

  return data;
}

export type RecentCourses = Awaited<
  ReturnType<typeof adminGetRecentCourses>
>[0];
