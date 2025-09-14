"use client";

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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RichTextEditor } from "@/components/RichTextEditor";
import {
  courseCategories,
  courseLevels,
  courseSchema,
  CourseSchema,
  courseStatuses,
} from "@/utils/zod-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  Loader,
  Loader2,
  PlusIcon,
  Sparkles,
  X,
} from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import slugify from "slugify";
import { UploadDropzone } from "@/utils/uploadthing";
import { toast } from "sonner";
import Image from "next/image";
import { useTransition } from "react";
import { createCourse } from "@/app/admin/actions";
import { useRouter } from "next/navigation";

export function CreateCourseForm() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<CourseSchema>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: "",
      description: "",
      fileKey: "",
      price: 0,
      duration: 1,
      level: "Beginner",
      category: "Web Development",
      status: "Draft",
      slug: "",
    },
  });

  async function onSubmit(data: CourseSchema) {
    startTransition(async () => {
      const result = await createCourse(data);

      if (result.status === "error") {
        toast.error(result.message);
      } else {
        toast.success(result.message);
        form.reset();
        router.push("/admin/courses");
      }
    });
  }

  return (
    <>
      <div className="flex items-center gap-4">
        <Link
          href="/admin/courses"
          className={buttonVariants({ variant: "outline" })}
        >
          <ArrowLeft className="size-4" /> Go Back
        </Link>
        <h1 className="text-2xl font-bold">Create Courses</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>
            Provide basic information about the course
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter title" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-4 items-end">
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Slug</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter slug" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="button"
                  className="w-fit"
                  onClick={() => {
                    const titleValue = form.getValues("title");

                    const slug = slugify(titleValue, { lower: true });
                    form.setValue("slug", slug, {
                      shouldValidate: true,
                    });
                  }}
                >
                  Generate Slug <Sparkles className="ml-1" size={16} />
                </Button>
              </div>

              <FormField
                control={form.control}
                name="smallDescription"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Small Description</FormLabel>
                    <FormControl>
                      <RichTextEditor
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Enter small description"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <RichTextEditor
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Enter description"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fileKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course Image</FormLabel>
                    <FormControl>
                      {field.value ? (
                        <div className="relative w-full max-w-md mx-auto">
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {courseCategories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="level"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Level</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {courseLevels.map((level) => (
                            <SelectItem key={level} value={level}>
                              {level}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Duration (hours)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter duration in hours"
                          type="number"
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Price ($)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter price in dollars"
                          type="number"
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {courseStatuses.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button className="w-full">
                {isPending ? (
                  <>
                    <Loader className="size-4 ml-1 animate-spin" /> Working...
                  </>
                ) : (
                  <>
                    Create Course <PlusIcon className="size-4 ml-1" />
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}
