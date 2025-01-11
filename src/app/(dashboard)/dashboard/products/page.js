// src/app/(dashboard)/dashboard/products/page.js
import { Suspense } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProductsTable } from "@/components/products/ProductsTable";
import { Plus } from "lucide-react";

export default function ProductsPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <Link href="/dashboard/products/add">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </Link>
      </div>

      <Suspense fallback={<div>Loading products...</div>}>
        <ProductsTable />
      </Suspense>
    </div>
  );
}
