// src/app/api/products/route.js
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

// Constants
const VALID_PRODUCT_TYPES = [
  "CLOTHING",
  "FOOD",
  "GROCERY",
  "CUSTOMIZED",
  "ELECTRONICS",
  "OTHER",
  "ALL",
];
const DEFAULT_PAGE_SIZE = 12;
const MAX_PAGE_SIZE = 50;

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    // Pagination parameters
    const page = Math.max(1, parseInt(searchParams.get("page")) || 1);
    const limit = Math.min(
      50,
      Math.max(1, parseInt(searchParams.get("limit")) || 12)
    );

    // Filter parameters
    const search = searchParams.get("search")?.trim() || "";
    const category = searchParams.get("category");
    const minPrice = parseFloat(searchParams.get("minPrice")) || 0;
    const maxPrice =
      parseFloat(searchParams.get("maxPrice")) || Number.MAX_SAFE_INTEGER;
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    // Build the where clause
    const where = {
      published: true,
      price: {
        gte: minPrice,
        lte: maxPrice,
      },
      // Add search filter if search term exists
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
        ],
      }),
      // Add category filter only if category exists and is not 'All'
      ...(category &&
        category !== "All" && {
          categories: {
            some: {
              slug: category,
            },
          },
        }),
    };

    // Fetch products and total count
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        select: {
          id: true,
          slug: true,
          name: true,
          description: true,
          price: true,
          oldPrice: true,
          inventory: true,
          published: true,
          featured: true,
          images: true,
          details: true,
          createdAt: true,
          updatedAt: true,
          categories: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          variants: {
            select: {
              id: true,
              name: true,
              price: true,
              sku: true,
              inventory: true,
              value: true,
            },
          },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({
      products,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        current: page,
        limit,
      },
      filters: {
        search,
        category,
        minPrice,
        maxPrice,
        sortBy,
        sortOrder,
      },
    });
  } catch (error) {
    console.error("Error details:", {
      name: error.name,
      message: error.message,
      code: error.code,
    });
    return NextResponse.json(
      {
        error: "Failed to fetch products",
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    // 1. Validate session
    const session = await getServerSession(authOptions);
    if (!session || !["ADMIN", "SELLER"].includes(session.user.role)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 2. Parse and validate request data
    let data;
    try {
      data = await request.json();
      console.log("Received product data:", data);
    } catch (e) {
      return NextResponse.json(
        { success: false, error: "Invalid JSON data" },
        { status: 400 }
      );
    }

    // 3. Extract and validate fields
    const {
      name,
      description,
      price,
      type,
      images,
      details,
      categories,
      variants,
      inventory,
      published,
      featured,
      oldPrice,
    } = data;

    // Validate required fields
    if (!name || !description || !price || !type) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

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

    // Validate variants if present
    if (variants && Array.isArray(variants)) {
      console.log("Processing variants:", variants);

      // Validate each variant
      for (const variant of variants) {
        if (!variant.name || !variant.value) {
          return NextResponse.json(
            {
              success: false,
              error: "Each variant must have a name and value",
            },
            { status: 400 }
          );
        }
      }
    }

    // 4. Create the product data object
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const productData = {
      name,
      slug,
      description,
      price: parseFloat(price),
      oldPrice: oldPrice ? parseFloat(oldPrice) : null,
      type,
      inventory: parseInt(inventory || "0"),
      published: Boolean(published),
      featured: Boolean(featured),
      images: Array.isArray(images) ? images : [],
      details: details || {},
      sellerId: session.user.id,

      // Handle categories if present
      ...(categories?.length > 0 && {
        categories: {
          connect: categories.map((id) => ({ id: String(id) })),
        },
      }),

      // Handle variants if present
      ...(variants?.length > 0 && {
        variants: {
          create: variants.map((variant) => ({
            name: variant.name,
            value: variant.value,
            sku: variant.sku || null,
            price: variant.price ? parseFloat(variant.price) : null,
            inventory: parseInt(variant.inventory || "0"),
          })),
        },
      }),
    };

    console.log("Final product data being sent to database:", productData);

    // 5. Create the product
    const product = await prisma.product.create({
      data: productData,
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

    console.log("Created product with variants:", product);

    // 6. Return success response
    return NextResponse.json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error("Error creating product:", error);

    // Handle specific Prisma errors
    if (error.code === "P2002") {
      return NextResponse.json(
        {
          success: false,
          error: "A product with this name already exists",
        },
        { status: 400 }
      );
    }

    // Log detailed error in development
    if (process.env.NODE_ENV === "development") {
      console.error("Detailed error:", {
        message: error.message,
        stack: error.stack,
        code: error.code,
      });
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to create product",
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
