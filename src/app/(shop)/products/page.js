// src/app/(shop)/products/page.js

import ProductsList from "@/components/product/ProductsList";

export default async function ProductsPage() {
  const categories = await prisma.category.findMany({
    include: {
      parent: true,
      products: true,
    },
  });
  return <ProductsList categories={categories} />;
}
