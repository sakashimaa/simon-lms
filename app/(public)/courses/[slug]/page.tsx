import { getPublicFacingCourseBySlug } from "../actions";
import { SlugClient } from "../_components/SlugClient";

export default async function CoursePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const course = await getPublicFacingCourseBySlug(slug);

  return <SlugClient course={course} />;
}
