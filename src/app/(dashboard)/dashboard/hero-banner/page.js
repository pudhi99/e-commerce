// src/app/(dashboard)/dashboard/hero-banner/page.js
"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { HeroBannerTable } from "@/components/hero-banner/HeroBannerTable";
import { useToast } from "@/hooks/use-toast";

export default function HeroBannerPage() {
  const [banners, setBanners] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const response = await fetch("/api/hero-banner");
      const data = await response.json();
      if (data.error) {
        toast({
          title: "Error",
          description: "Failed to fetch hero banners",
          variant: "destructive",
        });
        setBanners([]);
      } else {
        setBanners(data);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch hero banners",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Hero Banners</h1>
        <Button asChild>
          <a href="/dashboard/hero-banner/add">
            <Plus className="mr-2 h-4 w-4" /> Add New Banner
          </a>
        </Button>
      </div>
      <HeroBannerTable banners={banners} onUpdate={fetchBanners} />
    </div>
  );
}
