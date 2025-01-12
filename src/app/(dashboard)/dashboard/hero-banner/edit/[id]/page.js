// src/app/(dashboard)/dashboard/hero-banner/edit/[id]/page.js
"use client";
import { useEffect, useState } from "react";
import { HeroBannerForm } from "@/components/hero-banner/HeroBannerForm";
import { useToast } from "@/hooks/use-toast";

export default function EditHeroBannerPage({ params }) {
  const [banner, setBanner] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const response = await fetch(`/api/hero-banner/${params.id}`);
        const data = await response.json();
        setBanner(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch banner details",
          variant: "destructive",
        });
      }
    };

    fetchBanner();
  }, [params.id]);

  if (!banner) return <div>Loading...</div>;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Edit Hero Banner</h1>
      <HeroBannerForm initialData={banner} />
    </div>
  );
}
