// src\app\api\cart\route.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

// Get cart items
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const cart = await prisma.cart?.findUnique({
      where: {
        userId: session.user.id,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart) {
      // Create empty cart if it doesn't exist
      const newCart = await prisma.cart?.create({
        data: {
          userId: session.user.id,
          items: [],
        },
      });
      return NextResponse.json(newCart);
    }

    return NextResponse.json(cart);
  } catch (error) {
    console.log("Failed to fetch cart:", error);
    return NextResponse.json(
      { error: "Failed to fetch cart" },
      { status: 500 }
    );
  }
}

// Update cart items
export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { items } = await request.json();

    // Update cart in database
    const updatedCart = await prisma.cart.upsert({
      where: {
        userId: session.user.id,
      },
      create: {
        userId: session.user.id,
        items: {
          create: items.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
          })),
        },
      },
      update: {
        items: {
          deleteMany: {},
          create: items.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
          })),
        },
      },
    });

    return NextResponse.json(updatedCart);
  } catch (error) {
    console.error("Failed to update cart:", error);
    return NextResponse.json(
      { error: "Failed to update cart" },
      { status: 500 }
    );
  }
}

// Delete cart
export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response(null, { status: 401 });
    }

    const { productId } = await request.json();

    const cart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
    });

    if (!cart) {
      return new Response(null, { status: 404 });
    }

    // Delete the specific cart item
    await prisma.cartItem.deleteMany({
      where: {
        cartId: cart.id,
        productId: productId,
      },
    });

    return new Response(null, { status: 200 });
  } catch (error) {
    console.error("Delete cart item error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to delete cart item" }),
      {
        status: 500,
      }
    );
  }
}
