// src/app/(dashboard)/dashboard/products/edit/[id]/page.js
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ProductForm } from "@/components/products/ProductForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function EditProductPage({ params }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    async function fetchProduct() {
      try {
        const { id } = await params;
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/products/${id}`
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch product");
        }

        // Transform the data to match form expectations
        const formattedProduct = {
          ...data,
          price: data.price.toString(),
          oldPrice: data.oldPrice?.toString() || "",
          inventory: data.inventory.toString(),
          variants: data.variants.map((variant) => ({
            ...variant,
            price: variant.price?.toString() || "",
            inventory: variant.inventory.toString(),
          })),
        };

        setProduct(formattedProduct);
      } catch (error) {
        console.error("Error fetching product:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to fetch product",
          variant: "destructive",
        });
        router.push("/dashboard/products");
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [params.id, router, toast]);

  async function handleSubmit(data) {
    try {
      // Data is already transformed by Zod schema
      const { id } = await params;
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products/${await id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to update product");
      }

      toast({
        title: "Success",
        description: "Product updated successfully",
      });

      router.push("/dashboard/products");
      router.refresh();
    } catch (error) {
      console.error("Error updating product:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update product",
        variant: "destructive",
      });
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="p-6">Loading product data...</CardContent>
        </Card>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Edit Product: {product.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductForm initialData={product} onSubmit={handleSubmit} />
        </CardContent>
      </Card>
    </div>
  );
}
