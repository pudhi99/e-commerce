// src/app/(shop)/products/[slug]/page.js
import { Suspense } from "react";
import ProductGallery from "@/components/product/ProductGallery";
import ProductInfo from "@/components/product/ProductInfo";
import RelatedProducts from "@/components/product/RelatedProducts";
// import { Breadcrumb } from "@/components/ui/breadcrumb";

async function getProduct(slug) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/products/${slug}`
    );
    if (!res.ok) throw new Error("Failed to fetch product");
    return res.json();
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
}

export default async function ProductPage({ params }) {
  const product = await getProduct(params.slug);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* <Breadcrumb className="mb-8">
        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
        <Breadcrumb.Item href="/products">Products</Breadcrumb.Item>
        <Breadcrumb.Item>{product.name}</Breadcrumb.Item>
      </Breadcrumb> */}

      <div className="flex flex-col lg:flex-row gap-8 mb-16">
        <Suspense fallback={<div>Loading gallery...</div>}>
          <ProductGallery images={product.images} />
        </Suspense>
        <Suspense fallback={<div>Loading product info...</div>}>
          <ProductInfo product={product} />
        </Suspense>
      </div>

      <Suspense fallback={<div>Loading related products...</div>}>
        <RelatedProducts products={product.relatedProducts} />
      </Suspense>
    </div>
  );
}
