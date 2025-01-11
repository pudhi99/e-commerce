"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingCart, Heart } from "lucide-react";

export default function ProductInfo({ product }) {
  // Parse variants into colors and sizes
  const variants = product?.variants || [];
  const [selectedVariant, setSelectedVariant] = useState(variants[0] || null);

  // Format price for display
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "INR",
    }).format(price);
  };

  return (
    <div className="w-full lg:w-1/2 lg:pl-8">
      <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

      <div className="flex items-center mb-6">
        <span className="text-2xl font-bold mr-4">
          {formatPrice(product.price)}
        </span>
        {product.oldPrice && (
          <span className="text-lg line-through text-gray-500">
            {formatPrice(product.oldPrice)}
          </span>
        )}
      </div>

      {variants.length > 0 && (
        <div className="mb-6">
          <h3 className="font-medium mb-2">Select Variant</h3>
          <div className="flex flex-wrap gap-2">
            {variants.map((variant) => {
              // Check if the variant value is a color code
              const isColorValue = variant.value.startsWith("#");

              return (
                <Button
                  key={variant.id}
                  variant={
                    selectedVariant?.id === variant.id ? "default" : "outline"
                  }
                  onClick={() => setSelectedVariant(variant)}
                  className={`${isColorValue ? "w-12 h-12" : "px-4 py-2"}`}
                  style={isColorValue ? { backgroundColor: variant.value } : {}}
                >
                  {!isColorValue && variant.name}
                </Button>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex space-x-4 mb-8">
        <Button className="flex-1" size="lg" disabled={product.inventory === 0}>
          <ShoppingCart className="mr-2 h-5 w-5" />
          {product.inventory === 0 ? "Out of Stock" : "Add to Cart"}
        </Button>
        <Button variant="outline" size="lg">
          <Heart className="h-5 w-5" />
        </Button>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-600">
          {product.inventory > 0
            ? `${product.inventory} units in stock`
            : "Currently out of stock"}
        </p>
      </div>

      <Tabs defaultValue="description">
        <TabsList>
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
        </TabsList>
        <TabsContent value="description" className="mt-4">
          {product.description}
        </TabsContent>
        <TabsContent value="details" className="mt-4">
          {Object.keys(product.details || {}).length > 0 ? (
            <ul className="list-disc pl-4">
              {Object.entries(product.details).map(([key, value], index) => (
                <li key={index}>{`${key}: ${value}`}</li>
              ))}
            </ul>
          ) : (
            <p>No additional details available.</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
