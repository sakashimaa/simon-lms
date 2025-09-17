"use client";

import { LessonContentType } from "@/app/data/course/get-lesson-content";
import { RichTextEditor } from "@/components/RichTextEditor";
import { Button } from "@/components/ui/button";
import { Book, CheckCircle, Loader } from "lucide-react";
import { MarkLessonAsComplete } from "../actions";
import { useTransition } from "react";
import { toast } from "sonner";
import { useConfetti } from "@/hooks/use-confetti";

interface iAppProps {
  lesson: LessonContentType;
}

export function CourseContent({ lesson }: iAppProps) {
  const [isPending, startTransition] = useTransition();
  const { triggerConfetti } = useConfetti();

  function VideoPlayer({
    thumbnailKey,
    videoKey,
  }: {
    thumbnailKey: string;
    videoKey: string;
  }) {
    if (!videoKey) {
      return (
        <div className="aspect-video bg-muted rounded-lg flex flex-col items-center justify-center">
          <Book className="size-16 text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">
            This lesson does not have a video yet
          </p>
        </div>
      );
    }

    return (
      <div className="aspect-video bg-black rounded-lg relative overflow-hidden">
        <video
          src={videoKey}
          className="w-full h-full object-cover"
          controls
          poster={thumbnailKey}
        >
          <source src={videoKey} type="video/mp4" />
          <source src={videoKey} type="video/webm" />
          <source src={videoKey} type="video/ogg" />
          Your browser does not support the video tag.
        </video>
      </div>
    );
  }

  async function onSubmit() {
    startTransition(async () => {
      const result = await MarkLessonAsComplete(
        lesson.id,
        lesson.Chapter?.Course?.slug ?? ""
      );

      if (result.status === "error") {
        toast.error(result.message);
      } else {
        toast.success(result.message);
        triggerConfetti();
      }
    });
  }

  return (
    <div className="flex flex-col h-full bg-background pl-6">
      <VideoPlayer
        thumbnailKey={lesson.thumbnailKey ?? ""}
        videoKey={lesson.videoKey ?? ""}
      />

      <div className="py-4 border-b">
        {lesson.lessonProgress.length > 0 ? (
          <Button
            variant="outline"
            className="bg-green-500/10 text-green-500 hover:text-green-600 hover:cursor-pointer"
          >
            <CheckCircle className="size-4 mr-2 text-green-500" />
            Completed
          </Button>
        ) : (
          <Button
            variant="outline"
            onClick={async () => await onSubmit()}
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader className="size-4 animate-spin" /> Working...
              </>
            ) : (
              <>
                <CheckCircle className="size-4 mr-2 text-green-500" />
                Mark as Complete
              </>
            )}
          </Button>
        )}
      </div>

      <div>
        <h1>{lesson.title}</h1>

        {lesson.description && <RichTextEditor value={lesson.description} />}
      </div>
    </div>
  );
}
