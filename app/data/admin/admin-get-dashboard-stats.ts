import "server-only";

import { requireUser } from "@/hooks/require-user";
import { prisma } from "@/lib/prisma";

export async function adminGetDashboardStats() {
  await requireUser();

  const [totalSignups, totalCustomers, totalCourses, totalLessons] =
    await Promise.all([
      // total signups
      prisma.user.count(),

      // total customers
      prisma.user.count({
        where: {
          enrollments: {
            some: {},
          },
        },
      }),

      // total courses
      prisma.course.count(),

      // total lessons
      prisma.lesson.count(),
    ]);

  return {
    totalSignups,
    totalCustomers,
    totalCourses,
    totalLessons,
  };
}
