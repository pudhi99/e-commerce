// src/lib/validations/category.js
import * as z from "zod";

export const categorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  image: z.string().optional(),
  parentId: z.string().optional().nullable(),
});
