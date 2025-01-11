// src\app\(shop)\cart\page.js
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import CartItems from "@/components/cart/CartItems";
import CartSummary from "@/components/cart/CartSummary";
import { Button } from "@/components/ui/button";
import useCartStore from "@/store/cartStore";
import { ShoppingCart, Loader2 } from "lucide-react";

export default function CartPage() {
  const { data: session } = useSession();
  const { items, total, isLoading, initializeCart } = useCartStore();
  const router = useRouter();

  useEffect(() => {
    initializeCart(session);
  }, [session, initializeCart]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Loader2 className="mx-auto h-16 w-16 text-gray-400 mb-4 animate-spin" />
        <p className="text-gray-600">Loading your cart...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <ShoppingCart className="mx-auto h-16 w-16 text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <p className="text-gray-600 mb-8">
          {session
            ? "Looks like you haven't added anything to your cart yet."
            : "Sign in to sync your cart across devices."}
        </p>
        <div className="space-x-4">
          <Button
            onClick={() => router.push("/products")}
            className="inline-flex items-center"
          >
            Continue Shopping
          </Button>
          {!session && (
            <Button
              variant="outline"
              onClick={() => router.push("/login")}
              className="inline-flex items-center"
            >
              Sign In
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      {!session && (
        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <p className="text-blue-700">
            Sign in to sync your cart across devices and save your items for
            later.
            <Button
              variant="link"
              onClick={() => router.push("/login")}
              className="text-blue-700 underline ml-2"
            >
              Sign In
            </Button>
          </p>
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <CartItems session={session} />
        </div>
        <div className="lg:col-span-1">
          <CartSummary session={session} />
        </div>
      </div>
    </div>
  );
}
