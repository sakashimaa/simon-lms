import { ChartAreaInteractive } from "@/components/sidebar/chart-area-interactive";
import { SectionCards } from "@/components/sidebar/section-cards";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { adminGetEnrollmentStats } from "../data/admin/admin-get-enrollment-stats";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { adminGetRecentCourses } from "../data/admin/admin-get-recent-courses";
import { EmptyState } from "@/components/general/empty-state";
import { Plus } from "lucide-react";
import { AdminCourseCard } from "./_components/AdminCourseCard";
import { Suspense } from "react";
import { AdminCourseCardSkeleton } from "./courses/page";

export default async function AdminPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return redirect("/login");
  }

  const enrollmentStats = await adminGetEnrollmentStats();

  return (
    <>
      <SectionCards />
      <ChartAreaInteractive enrollmentStats={enrollmentStats} />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Recent Courses</h2>
          <Link
            className={buttonVariants({ variant: "outline" })}
            href="/admin/courses"
          >
            View All Courses
          </Link>
        </div>

        <Suspense fallback={<RecentCoursesSkeletonLayout />}>
          <RenderRecentCourses />
        </Suspense>
      </div>
    </>
  );
}

async function RenderRecentCourses() {
  const data = await adminGetRecentCourses();

  if (data.length === 0) {
    return (
      <EmptyState
        title="No courses found"
        description="Create a course to get started"
        buttonText="Create Course"
        buttonHref="/admin/courses/create"
        buttonIcon={<Plus className="size-4" />}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {data.map((course) => (
        <AdminCourseCard key={course.id} course={course} />
      ))}
    </div>
  );
}

function RecentCoursesSkeletonLayout() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {Array.from({ length: 2 }).map((_, index) => (
        <AdminCourseCardSkeleton key={index} />
      ))}
    </div>
  );
}
