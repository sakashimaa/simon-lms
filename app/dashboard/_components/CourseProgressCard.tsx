"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { EnrolledCourseType } from "@/app/data/user/get-enrolled-courses";
import { useCourseProgress } from "@/hooks/use-course-progress";
import { Progress } from "@/components/ui/progress";

interface iAppProps {
  course: EnrolledCourseType["Course"];
}

export function CourseProgressCard({ course }: iAppProps) {
  const { totalLessons, completedLessons, progressPercentage } =
    useCourseProgress({ courseData: course as any });

  return (
    <Card className="group relative py-0 gap-0">
      <Badge className="absolute top-2 right-2 z-10">{course.level}</Badge>
      <Image
        src={course.fileKey}
        alt="Thumbnail Image of Course"
        width={600}
        height={400}
        className="w-full rounded-t-xl aspect-video h-full object-cover"
      />

      <CardContent className="p-4">
        <Link
          href={`/dashboard/${course.slug}`}
          className="font-medium text-lg line-clamp-2 hover:underline group-hover:text-primary transition-colors"
        >
          {course.title}
        </Link>
        <p
          className="line-clamp-2 text-sm text-muted-foreground leading-tight mt-2"
          dangerouslySetInnerHTML={{ __html: course.smallDescription }}
        />

        <div className="space-y-4 mt-5">
          <div className="flex justify-between mb-1 text-sm">
            <p>Progress:</p>
            <p className="font-medium">{progressPercentage}%</p>
          </div>
          <Progress value={progressPercentage} className="h-1.5" />

          <p className="text-xs text-muted-foreground m-1">
            {completedLessons} of {totalLessons} completed
          </p>
        </div>

        <Link
          href={`/dashboard/${course.slug}`}
          className={buttonVariants({ className: "w-full mt-4" })}
        >
          Learn More <ArrowRight className="size-4" />
        </Link>
      </CardContent>
    </Card>
  );
}
