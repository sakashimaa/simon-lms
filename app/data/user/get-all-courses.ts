import { requireUser } from "@/hooks/require-user";
import { prisma } from "@/lib/prisma";
import "server-only";

export async function getAllCourses() {
  await requireUser();

  const courses = await prisma.course.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return courses;
}
