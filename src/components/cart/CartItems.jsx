// src/components/cart/CartItems.jsx
"use client";
import Image from "next/image";
import { useState } from "react";
import { useSession } from "next-auth/react"; // Add this
import { Trash2, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import useCartStore from "@/store/cartStore";

export default function CartItems() {
  const { data: session } = useSession(); // Add this
  const { items, removeItem, updateQuantity } = useCartStore();
  const [loading, setLoading] = useState({});

  const handleQuantityChange = async (productId, newQuantity) => {
    setLoading((prev) => ({ ...prev, [productId]: true }));
    try {
      await updateQuantity(productId, newQuantity, session); // Pass session here
    } finally {
      setLoading((prev) => ({ ...prev, [productId]: false }));
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      await removeItem(productId, session); // Pass session here
    } catch (error) {
      console.error("Failed to remove item:", error);
    }
  };

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <Card key={item.id} className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex gap-4">
              <div className="relative h-24 w-24 flex-shrink-0">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover rounded-md"
                />
              </div>
              <div className="flex flex-1 flex-col justify-between">
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-gray-500">
                      ${item.price.toFixed(2)}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleRemoveItem(item.id)}
                    disabled={loading[item.id]}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() =>
                      handleQuantityChange(item.id, item.quantity - 1)
                    }
                    disabled={loading[item.id] || item.quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() =>
                      handleQuantityChange(item.id, item.quantity + 1)
                    }
                    disabled={
                      loading[item.id] ||
                      item.quantity >= (item.inventory || 99)
                    }
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
