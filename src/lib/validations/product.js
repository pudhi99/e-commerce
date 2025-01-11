import * as z from "zod";

const variantSchema = z.object({
  name: z.string().min(1, "Variant name is required"),
  value: z.string().min(1, "Variant value is required"),
  sku: z.string().optional().nullable(),
  price: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val ? parseFloat(val) : null)),
  inventory: z
    .string()
    .default("0")
    .transform((val) => parseInt(val)),
});

export const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.string().transform((val) => parseFloat(val)),
  oldPrice: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val ? parseFloat(val) : null)),
  type: z.enum([
    "CLOTHING",
    "FOOD",
    "GROCERY",
    "CUSTOMIZED",
    "ELECTRONICS",
    "OTHER",
  ]),
  inventory: z.string().transform((val) => parseInt(val)),
  published: z.boolean().default(false),
  featured: z.boolean().default(false),
  images: z.array(z.string()).default([]),
  details: z.record(z.any()).default({}),
  categories: z.array(z.string()),
  variants: z.array(variantSchema).default([]),
});
