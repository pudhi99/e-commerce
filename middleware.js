import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request) {
  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.rewrite(new URL("/login", request.url));
  }
  console.log("middleware");
  if (pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();
  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });
    console.log(token, "token");
    const pathname = request.nextUrl.pathname;
    console.log(pathname, "pathname");

    // Dashboard routes protection
    if (pathname.startsWith("/dashboard")) {
      return NextResponse.redirect(new URL("/login", request.url));

      if (!token || token.role !== "USER") {
        return NextResponse.redirect(new URL("/login", request.url));
      }
    }

    // Protected routes
    if (pathname.startsWith("/account") || pathname.startsWith("/checkout")) {
      if (!token) {
        return NextResponse.redirect(new URL("/login", request.url));
      }
    }

    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

// Simplified matcher configuration
export const config = {
  matcher: [],
};
