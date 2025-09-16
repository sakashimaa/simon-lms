import { getPublicFacingCourseBySlug } from "../actions";
import { SlugClient } from "../_components/SlugClient";
import { checkIfCourseBought } from "@/app/data/user-is-enrolled";

export default async function CoursePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const course = await getPublicFacingCourseBySlug(slug);
  const isEnrolled = await checkIfCourseBought(course.id);

  return <SlugClient course={course} isEnrolled={isEnrolled} />;
}
