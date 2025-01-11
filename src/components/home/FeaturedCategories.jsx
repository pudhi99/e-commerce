import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

export default function FeaturedCategories({ categories }) {
  const all_categories = categories.length > 0 ? categories : [];
  return (
    <section className="container mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold mb-8">Shop by Category</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {all_categories?.map((category) => (
          <Card key={category.name}>
            <Link
              href={`/products?category=${category.slug}&minPrice=0&maxPrice=1000000&page=1`}
            >
              <CardContent className="p-4">
                <Image
                  src={category.image}
                  alt={category.name}
                  width={300}
                  height={300}
                  className="w-full h-40 object-cover rounded-lg mb-4"
                />
                <h3 className="text-lg font-semibold text-center">
                  {category.name}
                </h3>
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>
    </section>
  );
}
