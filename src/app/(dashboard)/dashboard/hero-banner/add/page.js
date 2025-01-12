// src/app/(dashboard)/dashboard/hero-banner/add/page.js
"use client";
import { HeroBannerForm } from "@/components/hero-banner/HeroBannerForm";

export default function AddHeroBannerPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Add Hero Banner</h1>
      <HeroBannerForm />
    </div>
  );
}
