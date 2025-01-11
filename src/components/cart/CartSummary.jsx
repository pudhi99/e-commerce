// src\components\cart\CartSummary.jsx
"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useCartStore from "@/store/cartStore";

export default function CartSummary() {
  const { subtotal, shipping, tax, total } = useCartStore();
  const router = useRouter();

  const summaryItems = [
    { label: "Subtotal", value: subtotal },
    { label: "Shipping", value: shipping },
    { label: "Tax", value: tax },
  ];

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {summaryItems.map(({ label, value }) => (
          <div key={label} className="flex justify-between text-sm">
            <span className="text-gray-600">{label}</span>
            <span>${value.toFixed(2)}</span>
          </div>
        ))}
        <div className="my-4 border-t pt-4">
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
        <div className="text-sm text-gray-500">
          {shipping === 0 ? (
            <p>✨ You qualify for free shipping!</p>
          ) : (
            <p>Add ${(100 - subtotal).toFixed(2)} more for free shipping</p>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={() => router.push("/checkout")}>
          Proceed to Checkout
        </Button>
      </CardFooter>
    </Card>
  );
}
