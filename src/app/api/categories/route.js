// src/app/api/categories/route.js
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        parent: true,
        products: true,
      },
    });
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  console.log("post method called");
  try {
    const data = await request.json();
    const category = await prisma.category.create({
      data: {
        name: data.name,
        slug: data.name.toLowerCase().replace(/\s+/g, "-"),
        description: data.description || null,
        image: data.image || null,
        parentId: data.parentId === "none" ? null : data.parentId || null,
      },
    });
    return NextResponse.json(category);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
