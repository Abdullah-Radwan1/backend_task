import { z } from "zod";

export const createPostSchema = z.object({
  body: z.object({
    title: z
      .string({ required_error: "Title is required" })
      .min(3, { message: "Title must be at least 3 characters" })
      .max(100, { message: "Title cannot exceed 100 characters" })
      .trim(),
    content: z
      .string({ required_error: "Content is required" })
      .min(5, { message: "Content must be at least 5 characters" })
      .trim(),
  }),
  image: z.string().optional(),
});

export const updatePostSchema = z.object({
  body: z.object({
    title: z
      .string()
      .min(3, { message: "Title must be at least 3 characters" })
      .max(100, { message: "Title cannot exceed 100 characters" })
      .trim()
      .optional(),
    content: z
      .string()
      .min(5, { message: "Content must be at least 5 characters" })
      .trim()
      .optional(),
  }),
});
