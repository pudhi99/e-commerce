import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import useCartStore from "@/store/cartStore";
import { Loader2 } from "lucide-react";

export default function ProductCard({ product }) {
  const { toast } = useToast();
  const { data: session } = useSession();
  const addItem = useCartStore((state) => state.addItem);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const handleAddToCart = async () => {
    if (!product.inventory) {
      toast({
        title: "Out of stock",
        description: "Sorry, this product is currently out of stock.",
        variant: "destructive",
      });
      return;
    }

    setIsAddingToCart(true);
    try {
      await addItem(product, session);

      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
      });
    } catch (error) {
      console.error("Failed to add item to cart:", error);
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <Card className="group hover:shadow-lg transition-shadow duration-300">
      <Link href={`/products/${product.id}`}>
        <div className="relative w-full pt-[100%] bg-primary-foreground overflow-hidden rounded-t-lg">
          {product.images && product.images[0] && (
            <div className="absolute inset-0">
              <Image
                src={product.images[0]}
                alt={product.name}
                width={400}
                height={400}
                priority
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          )}
          {product.oldPrice && product.oldPrice > product.price && (
            <Badge className="absolute top-2 right-2 bg-red-500">
              {Math.round(
                ((product.oldPrice - product.price) / product.oldPrice) * 100
              )}
              % OFF
            </Badge>
          )}
        </div>
      </Link>
      <CardContent className="p-4">
        <div className="mb-2">
          {product.categories?.map((category) => (
            <Badge key={category.id} variant="outline" className="mr-2">
              {category.name}
            </Badge>
          ))}
        </div>
        <Link href={`/products/${product.id}`}>
          <h3 className="text-lg font-semibold mb-2 hover:text-primary">
            {product.name}
          </h3>
        </Link>
        <p className="text-gray-600 text-sm mb-2 line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold">
              ${product.price?.toFixed(2)}
            </span>
            {product.oldPrice && product.oldPrice > product.price && (
              <span className="text-gray-400 line-through">
                ${product.oldPrice?.toFixed(2)}
              </span>
            )}
          </div>
          {product.inventory <= 0 && (
            <Badge variant="outline" className="text-red-500 border-red-500">
              Out of Stock
            </Badge>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          onClick={handleAddToCart}
          className="w-full"
          disabled={isAddingToCart || product.inventory <= 0}
        >
          {isAddingToCart ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Adding...
            </>
          ) : product.inventory > 0 ? (
            "Add to Cart"
          ) : (
            "Out of Stock"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
