"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";

import Image from "next/image";
import Link from "next/link";
import { toast } from "@/hooks/use-toast";

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState([
    {
      id: 1,
      name: "Wireless Headphones",
      price: 99.99,
      image: "https://picsum.photos/400/300?random=1",
      inStock: true,
    },
    {
      id: 2,
      name: "Smartphone",
      price: 699.99,
      image: "https://picsum.photos/400/300?random=2",
      inStock: false,
    },
    // Add more items as needed
  ]);

  const removeFromWishlist = (itemId) => {
    setWishlistItems((prev) => prev.filter((item) => item.id !== itemId));
    toast({
      title: "Item removed",
      description: "Item has been removed from your wishlist.",
    });
  };

  const addToCart = (item) => {
    // Add your cart logic here
    toast({
      title: "Added to cart",
      description: "Item has been added to your cart.",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <Heart className="h-6 w-6" />
            My Wishlist
          </CardTitle>
        </CardHeader>
        <CardContent>
          {wishlistItems.length === 0 ? (
            <div className="text-center py-8">
              <Heart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">
                Your wishlist is empty
              </h3>
              <p className="text-muted-foreground mb-4">
                Save items youd like to buy later by clicking the heart icon on
                product pages.
              </p>
              <Button asChild>
                <Link href="/products">Start Shopping</Link>
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {wishlistItems.map((item) => (
                <Card key={item.id} className="relative group">
                  <CardContent className="p-4">
                    <div className="relative mb-4">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={300}
                        height={300}
                        className="w-full h-48 object-cover rounded-md"
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeFromWishlist(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <h3 className="font-medium mb-2">{item.name}</h3>
                    <p className="text-lg font-bold mb-2">
                      ${item.price.toFixed(2)}
                    </p>
                    <div className="flex justify-between items-center">
                      <span
                        className={
                          item.inStock ? "text-green-600" : "text-red-600"
                        }
                      >
                        {item.inStock ? "In Stock" : "Out of Stock"}
                      </span>
                      <Button
                        onClick={() => addToCart(item)}
                        disabled={!item.inStock}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Add to Cart
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
