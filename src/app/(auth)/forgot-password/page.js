// src/app/(auth)/forgot-password/page.js
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Reset Password</h2>
          <p className="mt-2 text-gray-600">
            Enter your email to reset your password
          </p>
        </div>
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
