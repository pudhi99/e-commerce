// src/app/(auth)/error/page.js
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AuthErrorPage({ searchParams }) {
  const error = searchParams?.error || "Something went wrong";

  const errorMessages = {
    Configuration: "There is a problem with the server configuration.",
    AccessDenied:
      "Access denied. You do not have permission to access this resource.",
    Verification:
      "The verification link may have expired or already been used.",
    default: "An unexpected error occurred.",
  };

  const message = errorMessages[error] || errorMessages.default;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg text-center">
        <h2 className="text-3xl font-bold text-red-600">
          Authentication Error
        </h2>
        <p className="text-gray-600">{message}</p>
        <div className="space-y-4">
          <Button asChild className="w-full">
            <Link href="/login">Back to Login</Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/">Go to Homepage</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
