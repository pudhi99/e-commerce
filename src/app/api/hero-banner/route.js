// src/app/api/hero-banner/route.js
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  console.log("prisma called");
  try {
    const banners = await prisma.heroBanner.findMany({
      where: {
        isActive: true,
      },
    });
    return NextResponse.json(banners);
  } catch (error) {
    console.log("Error fetching banners:", error);
    return NextResponse.json(
      { error: "Failed to fetch active banners" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const data = await req.json();
    const banner = await prisma.heroBanner.create({
      data,
    });
    return NextResponse.json(banner);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create banner" },
      { status: 500 }
    );
  }
}
