import { EditLessonClient } from "./_components/EditLessonClient";
import { getLesson } from "./actions";

export default async function EditLessonPage({
  params,
}: {
  params: Promise<{ courseId: string; chapterId: string; lessonId: string }>;
}) {
  const { courseId, chapterId, lessonId } = await params;
  const lesson = await getLesson(courseId, chapterId, lessonId);

  return (
    <div>
      <EditLessonClient
        lesson={lesson}
        chapterId={chapterId}
        courseId={courseId}
      />
    </div>
  );
}
