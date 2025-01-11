// src/app/(dashboard)/dashboard/categories/page.js
import { Button } from "@/components/ui/button";
import CategoriesTable from "@/components/categories/CategoriesTable";
import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    include: {
      parent: true,
      products: true,
    },
  });

  return (
    <div className="space-y-4 p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Categories</h2>
        <Link href="/dashboard/categories/add">
          <Button>Add Category</Button>
        </Link>
      </div>
      <CategoriesTable categories={categories} />
    </div>
  );
}
