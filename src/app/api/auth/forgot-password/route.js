// src/app/api/auth/forgot-password/route.js
import prisma from "@/lib/prisma";
// import { createResetToken } from "@/lib/auth";
import { sendResetEmail } from "@/lib/email";

export async function POST(request) {
  try {
    const { email } = await request.json();

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return Response.json(
        { message: "No account found with this email" },
        { status: 404 }
      );
    }

    // const resetToken = await createResetToken(user.email);
    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`;

    await sendResetEmail(user.email, resetUrl);

    return Response.json(
      { message: "Reset link sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      { message: "Failed to send reset link" },
      { status: 500 }
    );
  }
}
