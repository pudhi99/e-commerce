// src/app/(dashboard)/dashboard/categories/edit/[id]/page.js
import CategoryForm from "@/components/categories/CategoryForm";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function EditCategoryPage({ params }) {
  const { id } = await params;
  const [category, categories] = await Promise.all([
    prisma.category.findUnique({
      where: { id: id },
    }),
    prisma.category.findMany(),
  ]);

  if (!category) {
    notFound();
  }

  return (
    <div className="p-8">
      <CategoryForm category={category} categories={categories} id={id} />
    </div>
  );
}
