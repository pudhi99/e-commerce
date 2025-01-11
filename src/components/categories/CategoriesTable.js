"use client";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash } from "lucide-react";
import Image from "next/image";

export default function CategoriesTable({ categories }) {
  const router = useRouter();

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this category?")) {
      try {
        const response = await fetch(`/api/categories/${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          router.refresh();
        }
      } catch (error) {
        console.error("Error deleting category:", error);
      }
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Parent Category</TableHead>
            <TableHead>Products</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <TableRow key={category.id}>
              <TableCell>
                {category.image ? (
                  <div className="relative h-12 w-12">
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="rounded-md object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-12 w-12 rounded-md bg-gray-100" />
                )}
              </TableCell>
              <TableCell className="font-medium">{category.name}</TableCell>
              <TableCell>{category.description || "—"}</TableCell>
              <TableCell>{category.parent?.name || "—"}</TableCell>
              <TableCell>{category.products?.length || 0}</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    router.push(`/dashboard/categories/edit/${category.id}`)
                  }
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(category.id)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
