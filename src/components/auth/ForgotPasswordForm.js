// src/components/auth/ForgotPasswordForm.js
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: "", message: "" });

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setStatus({
        type: "success",
        message: "Password reset link has been sent to your email",
      });
      setEmail("");
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {status.message && (
        <div
          className={`p-4 rounded-lg text-sm ${
            status.type === "error"
              ? "bg-red-50 text-red-500"
              : "bg-green-50 text-green-500"
          }`}
        >
          {status.message}
        </div>
      )}

      <div>
        <Input
          type="email"
          name="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Sending..." : "Send Reset Link"}
      </Button>
    </form>
  );
}
