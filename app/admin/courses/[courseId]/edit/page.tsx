import { getCourse } from "../actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EditCourseForm } from "./_components/EditCourseForm";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { CourseStructure } from "./_components/CourseStructure";

export default async function EditCoursePage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;

  const course = await getCourse(courseId);

  return (
    <>
      <div className="flex items-center gap-4">
        <Link
          href="/admin/courses"
          className={buttonVariants({ variant: "outline" })}
        >
          <ArrowLeft className="size-4" /> Go Back
        </Link>
      </div>

      <div>
        <h1 className="text-3xl font-bold mb-8">
          Edit Course:{" "}
          <span className="text-primary underline">{course.title}</span>
        </h1>

        <Tabs defaultValue="basic-info" className="w-full">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="basic-info">Basic Info</TabsTrigger>
            <TabsTrigger value="course-structure">Course Structure</TabsTrigger>
          </TabsList>
          <TabsContent value="basic-info">
            <Card>
              <CardHeader>
                <CardTitle>Basic Info</CardTitle>
                <CardDescription>
                  Edit basic information about the course
                </CardDescription>
              </CardHeader>
              <CardContent>
                <EditCourseForm course={course} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="course-structure">
            <Card>
              <CardHeader>
                <CardTitle>Course Structure</CardTitle>
                <CardDescription>Edit course structure</CardDescription>
              </CardHeader>
              <CardContent>
                <CourseStructure data={course} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
