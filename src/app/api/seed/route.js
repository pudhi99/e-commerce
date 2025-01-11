// src/app/api/seed/route.js
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request) {
  console.log();
  try {
    const userId = "cm5dvjrnj0000h80vhp5bhrgp";

    // Create Categories
    const categories = await Promise.all([
      prisma.category.create({
        data: {
          name: "Electronics",
          slug: "electronics",
          description: "Latest electronic gadgets and devices",
          image: "https://picsum.photos/400/300?random=1",
        },
      }),
      prisma.category.create({
        data: {
          name: "Clothing",
          slug: "clothing",
          description: "Fashion and apparel",
          image: "https://picsum.photos/400/300?random=2",
        },
      }),
      prisma.category.create({
        data: {
          name: "Food & Beverages",
          slug: "food-beverages",
          description: "Fresh and packaged food items",
          image: "https://picsum.photos/400/300?random=3",
        },
      }),
      prisma.category.create({
        data: {
          name: "Home & Living",
          slug: "home-living",
          description: "Home decor and furniture",
          image: "https://picsum.photos/400/300?random=4",
        },
      }),
    ]);

    // Sample Products Data
    const productsData = [
      {
        name: "Smart 4K TV",
        description: "55-inch Smart TV with HDR",
        price: 699.99,
        oldPrice: 899.99,
        type: ProductType.ELECTRONICS, // Issue 1: Need to use proper enum value
        inventory: 50,
        published: true, // Issue 2: Missing in original data
        featured: true,
        images: [
          "https://picsum.photos/400/300?random=1",
          "https://picsum.photos/400/300?random=2",
        ],
        details: {
          material: "Premium",
          warranty: "1 year",
          shipping: "Free",
        },
        sellerId: userId,
        categories: {
          connect: [{ id: categories[0].id }],
        },
        variants: {
          create: [
            {
              name: "Size",
              value: "55 inch",
              price: 699.99,
              inventory: 30,
            },
            {
              name: "Size",
              value: "65 inch",
              price: 999.99,
              inventory: 20,
            },
          ],
        },
      },
      // ... other products
    ];

    // Create Products
    const products = await Promise.all(
      productsData.map(async (productData) => {
        const slug = productData.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");

        return prisma.product.create({
          data: {
            name: productData.name,
            slug,
            description: productData.description,
            price: productData.price,
            oldPrice: productData.oldPrice,
            type: productData.type,
            inventory: productData.inventory,
            published: productData.published,
            featured: productData.featured,
            images: productData.images,
            details: productData.details,
            sellerId: userId,
            categories: productData.categories,
            variants: productData.variants,
          },
          include: {
            categories: true,
            variants: true,
          },
        });
      })
    );

    return NextResponse.json({
      success: true,
      data: {
        categories: categories.length,
        products: products.length,
      },
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
