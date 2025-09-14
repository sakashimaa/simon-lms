import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { CreateCourseForm } from "./_components/CreateCourseForm";
import { Course } from "../[courseId]/actions";

export default async function CreateCoursePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return redirect("/login");
  }

  return <CreateCourseForm />;
}
