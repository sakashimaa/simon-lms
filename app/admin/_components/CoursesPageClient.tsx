"use client";

import { Courses } from "../actions";

interface iAppProps {
  courses: Courses;
}

export function CoursesPageClient({ courses }: iAppProps) {
  return <div>CoursesPageClient</div>;
}
