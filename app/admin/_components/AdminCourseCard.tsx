"use client";

import { RecentCourses } from "@/app/data/admin/admin-get-recent-courses";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Course, CourseLevel } from "@/lib/generated/prisma";
import {
  ArrowRight,
  Eye,
  MoreVertical,
  Pen,
  Pencil,
  School,
  TimerIcon,
  Trash,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface iAppProps {
  course: Course | RecentCourses;
}

export function AdminCourseCard({ course }: iAppProps) {
  return (
    <Card className="group relative gap-0 py-0 overflow-hidden">
      {/* absolute dropdown */}
      <div className="absolute top-4 right-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon">
              <MoreVertical className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem asChild>
              <Link href={`/admin/courses/${course.id}/edit`}>
                <Pencil className="size-4 mr-2" /> Edit Course
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <Link href={`/admin/courses/${course.slug}`}>
                <Eye className="size-4 mr-2" /> Preview
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem asChild>
              <Link href={`/admin/courses/${course.id}/delete`}>
                <Trash2 className="size-4 mr-2 text-destructive" /> Delete
                Course
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Image
        src={course.fileKey}
        alt="Thumnail Url"
        width={600}
        height={400}
        className="w-full rounded-t-lg aspect-video h-full object-cover"
      />

      <CardContent className="p-4">
        <Link
          href={`/admin/courses/${course.id}/edit`}
          className="font-medium text-lg line-clamp-2 hover:underline group-hover:text-primary transition-colors"
        >
          {course.title}
        </Link>

        <p
          className="line-clamp-2 text-sm text-muted-foreground leading-tight mt-2"
          dangerouslySetInnerHTML={{ __html: course.smallDescription }}
        />

        <div className="mt-4 flex items-center gap-x-5">
          <div className="flex items-center gap-x-2">
            <TimerIcon className="size-6 p-1 rounded-md text-primary bg-primary/10" />
            <p className="text-sm text-muted-foreground">{course.duration} h</p>
          </div>

          <div className="flex items-center gap-x-2">
            <School className="size-6 p-1 rounded-md text-primary bg-primary/10" />
            <p className="text-sm text-muted-foreground">{course.level}</p>
          </div>
        </div>

        <Link
          href={`/admin/courses/${course.id}/edit`}
          className={buttonVariants({ className: "w-full mt-4" })}
        >
          Edit Course <ArrowRight className="size-4" />
        </Link>
      </CardContent>
    </Card>
  );
}
