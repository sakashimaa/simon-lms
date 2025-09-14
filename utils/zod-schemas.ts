import { z } from "zod";

export const emailOtpSchema = z.object({
  email: z.string().email().min(1, { message: "Email is required" }),
});

export const courseLevels = ["Beginner", "Intermediate", "Advanced"];
export const courseStatuses = ["Draft", "Published", "Archived"];

export const courseCategories = [
  "Web Development",
  "Mobile Development",
  "Data Science",
  "AI",
  "Machine Learning",
  "Blockchain",
  "Cloud Computing",
  "Cybersecurity",
  "DevOps",
  "UI/UX Design",
  "Game Development",
  "Software Testing",
  "Database Management",
];

export const courseSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title is required" })
    .max(100, { message: "Title must be less than 100 characters" }),
  description: z.string().min(3, { message: "Description is required" }),
  fileKey: z.string().min(1, { message: "File Key is required" }),
  price: z.number().min(1, { message: "Price is required" }),
  duration: z
    .number()
    .min(1, { message: "Duration is required" })
    .max(500, { message: "Duration must be less than 500 hours" }),
  level: z.enum(courseLevels, { message: "Level is required" }),
  category: z.enum(courseCategories, { message: "Category is required" }),
  smallDescription: z
    .string()
    .min(3, { message: "Small Description is required" })
    .max(200, {
      message: "Small Description must be less than 200 characters",
    }),
  slug: z.string().min(3, { message: "Slug is required" }),
  status: z.enum(courseStatuses, { message: "Status is required" }),
});

export type EmailOtpSchema = z.infer<typeof emailOtpSchema>;
export type CourseSchema = z.infer<typeof courseSchema>;
