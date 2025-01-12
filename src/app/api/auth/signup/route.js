// src/app/api/auth/signup/route.js
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    const { name, email, password } = await request.json();

    // Validate input
    if (!name || !email || !password) {
      return Response.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return Response.json({ message: "User already exists" }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "ADMIN",
      },
    });

    return Response.json(
      { message: "User created successfully" },
      { status: 201 }
    );
  } catch (error) {
    return Response.json({ message: "Something went wrong" }, { status: 500 });
  }
}
