import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { CoursesPageClient } from "../_components/CoursesPageClient";
import { getCourses } from "../actions";
import { toast } from "sonner";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { AdminCourseCard } from "../_components/AdminCourseCard";

export default async function CoursesPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return redirect("/login");
  }

  const courses = await getCourses();

  if (!courses) {
    toast.error("Error fetching courses. Try again later");
    return redirect("/admin");
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Your Courses</h1>

        <Link className={buttonVariants()} href="/admin/courses/create">
          Create Course
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-7">
        {courses.map((course) => (
          <AdminCourseCard key={course.id} course={course} />
        ))}
      </div>
    </>
  );
}
