// src/components/products/ProductsTable.js
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export function ProductsTable() {
  const [products, setProducts] = useState([]);
  const { toast } = useToast();
  const router = useRouter();
  useEffect(() => {
    fetchProducts();
  }, []);

  // Fetch products
  async function fetchProducts() {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products`
      );
      const data = await response.json();
      setProducts(data.products);
    } catch (error) {
      console.log("Error fetching products:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch products",
      });
    }
  }

  // Delete product
  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this category?")) {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/products/${id}`,
          {
            method: "DELETE",
          }
        );
        router.refresh();

        if (response.ok) {
          router.refresh();
        }
      } catch (error) {
        console.log("Error deleting category:", error);
      }
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Inventory</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <TableRow key={product.id}>
            <TableCell>{product.name}</TableCell>
            <TableCell>{product.type}</TableCell>
            <TableCell>${product.price}</TableCell>
            <TableCell>{product.inventory}</TableCell>
            <TableCell>{product.published ? "Published" : "Draft"}</TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <Link href={`/dashboard/products/edit/${product.id}`}>
                    <DropdownMenuItem>
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuItem
                    onClick={() => handleDelete(product.id)}
                    className="text-red-600"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
