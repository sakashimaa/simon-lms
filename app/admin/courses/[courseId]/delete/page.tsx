import { DeleteCourseModal } from "@/app/admin/_components/DeleteCourseModal";

export default async function DeleteCoursePage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;

  return <DeleteCourseModal courseId={courseId} />;
}
