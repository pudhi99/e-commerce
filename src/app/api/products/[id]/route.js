import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const VALID_PRODUCT_TYPES = [
  "CLOTHING",
  "FOOD",
  "GROCERY",
  "CUSTOMIZED",
  "ELECTRONICS",
  "OTHER",
];
// src/app/api/products/[id]/route.js
export async function GET(request, { params }) {
  const { id } = await params;
  try {
    const product = await prisma.product.findUnique({
      where: { id: id },
      include: {
        categories: true,
        variants: true,
        seller: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Get related products
    const relatedProducts = await prisma.product.findMany({
      where: {
        categories: {
          some: {
            id: { in: product.categories.map((c) => c.id) },
          },
        },
        NOT: { id: product.id },
        published: true,
      },
      take: 8,
      include: {
        categories: true,
      },
    });

    return NextResponse.json({ ...product, relatedProducts });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

// Update product
export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!session || !["ADMIN", "SELLER"].includes(session.user.role)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    let data;
    try {
      data = await request.json();
      console.log("Received update data:", data);
    } catch (e) {
      return NextResponse.json(
        { success: false, error: "Invalid JSON data" },
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({
      where: { id: await params.id },
      include: { seller: true },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Check if user is authorized to update
    if (session.user.role !== "ADMIN" && product.sellerId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Extract and validate fields to match POST route structure
    const {
      name,
      description,
      price,
      oldPrice,
      type,
      inventory,
      images,
      details,
      categories,
      variants,
      published,
      featured,
    } = data;

    // Validate product type
    if (!VALID_PRODUCT_TYPES.includes(type)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid product type. Must be one of: ${VALID_PRODUCT_TYPES.join(
            ", "
          )}`,
        },
        { status: 400 }
      );
    }

    const updatedProduct = await prisma.product.update({
      where: { id: await params.id },
      data: {
        name,
        description,
        price: parseFloat(price),
        oldPrice: oldPrice ? parseFloat(oldPrice) : null,
        type,
        inventory: parseInt(inventory),
        published: Boolean(published),
        featured: Boolean(featured),
        images: Array.isArray(images) ? images : [],
        details: details || {},
        categories:
          categories?.length > 0
            ? {
                set: [],
                connect: categories.map((id) => ({ id: String(id) })),
              }
            : undefined,
        variants:
          variants?.length > 0
            ? {
                deleteMany: {},
                create: variants.map((variant) => ({
                  name: variant.name,
                  value: variant.value,
                  sku: variant.sku || null,
                  price: variant.price || null,
                  inventory: parseInt(variant.inventory || "0"),
                })),
              }
            : undefined,
      },
      include: {
        categories: true,
        variants: true,
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    console.log("Updated product:", updatedProduct);

    return NextResponse.json({
      success: true,
      data: updatedProduct,
    });
  } catch (error) {
    console.error("Error updating product:", error);

    // Check for specific Prisma errors
    if (error.code === "P2002") {
      return NextResponse.json(
        {
          success: false,
          error: "A product with this name already exists",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to update product",
        ...(process.env.NODE_ENV === "development" && { details: error.stack }),
      },
      { status: 500 }
    );
  }
}

// Delete product
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.product.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
