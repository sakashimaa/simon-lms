"use client";

import Link from "next/link";
import { Lesson, updateLesson } from "../actions";
import { ArrowLeft, Loader, Pencil } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { lessonSchema, LessonSchema } from "@/utils/zod-schemas";
import { Input } from "@/components/ui/input";
import { RichTextEditor } from "@/components/RichTextEditor";
import { UploadDropzone } from "@/utils/uploadthing";
import { toast } from "sonner";
import { X } from "lucide-react";
import { useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface iAppProps {
  lesson: Lesson;
  chapterId: string;
  courseId: string;
}

export function EditLessonClient({ lesson, chapterId, courseId }: iAppProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<LessonSchema>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      name: lesson.title,
      chapterId,
      courseId,
      description: lesson.description ?? undefined,
      thumbnailKey: lesson.thumbnailKey ?? undefined,
      videoKey: lesson.videoKey ?? undefined,
    },
  });

  async function onSubmit(data: LessonSchema) {
    startTransition(async () => {
      const response = await updateLesson(lesson.id, data);

      if (response.status === "error") {
        toast.error(response.message);
      } else {
        toast.success(response.message);
        form.reset();
        router.push(`/admin/courses/${courseId}/edit`);
      }
    });
  }

  return (
    <div>
      <Link
        href={`/admin/courses/${courseId}/edit`}
        className={buttonVariants({ variant: "outline", className: "mb-6" })}
      >
        <ArrowLeft className="size-4" />
        <span>Go Back</span>
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Lesson Configuration</CardTitle>
          <CardDescription>
            Configure the video and description for this lesson
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Lesson Name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="thumbnailKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lesson Image</FormLabel>
                    <FormControl>
                      {field.value ? (
                        <div className="relative w-full max-w-2xl mx-auto">
                          <div className="relative aspect-video border rounded-lg overflow-hidden">
                            <Image
                              src={field.value}
                              alt="Course preview"
                              fill
                              className="object-cover"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute top-2 right-2"
                              onClick={() => {
                                field.onChange("");
                                toast.success("Image removed");
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                          <p className="text-sm text-muted-foreground mt-2 text-center">
                            Click the X to remove and upload a different image
                          </p>
                        </div>
                      ) : (
                        <UploadDropzone
                          className="mt-4 ut-button:bg-primary ut-button:ut-uploading:bg-primary/50 ut-button:ut-uploading-progress-bar:bg-primary/50 ut-button:ut-readying:bg-primary/50 border-1 border-dashed border-primary ut-label:text-primary"
                          endpoint="imageUploader"
                          onClientUploadComplete={(res) => {
                            field.onChange(res[0].ufsUrl);
                            toast.success("File uploaded successfully");
                          }}
                          onUploadError={(error: Error) => {
                            toast.error("Error uploading file");
                          }}
                        />
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="videoKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lesson Video</FormLabel>
                    <FormControl>
                      {field.value ? (
                        <div className="relative w-full max-w-2xl mx-auto">
                          <div className="relative aspect-video border rounded-lg overflow-hidden">
                            <video
                              src={field.value}
                              controls
                              className="w-full h-full object-cover"
                              preload="metadata"
                            >
                              Your browser does not support the video tag.
                            </video>
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute top-2 right-2"
                              onClick={() => {
                                field.onChange("");
                                toast.success("Video removed");
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                          <p className="text-sm text-muted-foreground mt-2 text-center">
                            Video preview - Click the X to remove and upload a
                            different video
                          </p>
                        </div>
                      ) : (
                        <UploadDropzone
                          className="mt-4 ut-button:bg-primary ut-button:ut-uploading:bg-primary/50 ut-button:ut-uploading-progress-bar:bg-primary/50 ut-button:ut-readying:bg-primary/50 border-1 border-dashed border-primary ut-label:text-primary"
                          endpoint="videoUploader"
                          onClientUploadComplete={(res) => {
                            field.onChange(res[0].ufsUrl);
                            toast.success("Video uploaded successfully");
                          }}
                          onUploadError={(error: Error) => {
                            toast.error("Error uploading video");
                          }}
                        />
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader className="size-4 animate-spin" /> Working...
                  </>
                ) : (
                  <>
                    <Pencil className="size-4" /> Save Changes
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
