// src\app\(dashboard)\dashboard\products\add\page.js
"use client";

import { useRouter } from "next/navigation";
import { ProductForm } from "@/components/products/ProductForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function AddProductPage() {
  const router = useRouter();
  const { toast } = useToast();

  async function handleSubmit(data) {
    try {
      console.log("Form data before submission:", data);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      // Attempt to parse JSON response
      let result;
      try {
        result = await response.json();
      } catch (e) {
        console.error("Failed to parse JSON response:", e);
        throw new Error(
          "Invalid response from server. Please check the backend."
        );
      }

      // Handle unsuccessful response
      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to create product");
      }

      // Show success toast and redirect
      toast({
        title: "Success",
        description: "Product created successfully",
      });
      router.push("/dashboard/products");
      router.refresh();
    } catch (error) {
      console.error("Error creating product:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create product",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Add New Product</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductForm onSubmit={handleSubmit} />
        </CardContent>
      </Card>
    </div>
  );
}
