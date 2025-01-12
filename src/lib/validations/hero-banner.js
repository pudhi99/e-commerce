import * as z from "zod";

export const heroBannerSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  primaryButtonText: z.string().optional(),
  primaryButtonLink: z.string().optional(),
  secondaryButtonText: z.string().optional(),
  secondaryButtonLink: z.string().optional(),
  images: z.array(z.string()).min(1, "At least one image is required"),
  isActive: z.boolean().default(true),
});
