// Adjust the path to your Prisma client
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import crypto from "crypto";
import prisma from "@/lib/prisma";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function findImageByHash(hash) {
  try {
    return await prisma.image.findUnique({
      where: { hash: hash },
    });
  } catch (error) {
    console.error("Error finding image:", error);
    throw new Error("Failed to find image");
  }
}

async function saveImageHash(hash, url) {
  return prisma.image.create({
    data: { hash, url },
  });
}

export async function POST(request) {
  if (!request.body)
    return NextResponse.json({ error: "No file received" }, { status: 400 });

  const file = request.body;
  const fileBuffer = await new Response(file).arrayBuffer();
  const hash = crypto
    .createHash("sha256")
    .update(Buffer.from(fileBuffer))
    .digest("hex");

  // Check if the image already exists
  const existingImage = await findImageByHash(hash);
  if (existingImage) {
    return NextResponse.json({ url: existingImage.url });
  }

  const mime = request.headers.get("content-type");
  const fileBase64 = `data:${mime};base64,${Buffer.from(fileBuffer).toString(
    "base64"
  )}`;

  try {
    const result = await cloudinary.uploader.upload(fileBase64, {
      folder: "store-categories",
    });

    // Save the hash and URL to the database
    await saveImageHash(hash, result.secure_url);

    return NextResponse.json({ url: result.secure_url });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
