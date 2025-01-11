// src/app/(dashboard)/dashboard/categories/add/page.js
import CategoryForm from "@/components/categories/CategoryForm";
import prisma from "@/lib/prisma";

export default async function AddCategoryPage() {
  const categories = await prisma.category.findMany();

  return (
    <div className="p-8">
      <CategoryForm categories={categories} />
    </div>
  );
}
