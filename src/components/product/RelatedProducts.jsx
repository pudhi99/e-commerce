"use client";
import useEmblaCarousel from "embla-carousel-react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default function RelatedProducts({ products }) {
  const [carouselRef] = useEmblaCarousel({
    slidesToScroll: 1,
    align: "start",
  });

  const ProductCard = ({ product }) => (
    <Card className="group hover:shadow-lg transition-shadow duration-300 border-none">
      <Link href={`/products/${product.id}`}>
        <div className="relative w-full pt-[100%] bg-background overflow-hidden rounded-t-lg">
          {product.images && product.images[0] && (
            <div className="absolute inset-0">
              <Image
                src={product.images[0]}
                alt={product.name}
                width={400}
                height={400}
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
      </CardContent>
    </Card>
  );

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold mb-6">Related Products</h2>

      {/* Carousel for mobile */}
      <div className="lg:hidden overflow-hidden" ref={carouselRef}>
        <div className="flex gap-4">
          {products.map((product) => (
            <div key={product.id} className="flex-[0_0_280px]">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>

      {/* Grid for large devices */}
      <div className="hidden lg:grid lg:grid-cols-4 lg:gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
