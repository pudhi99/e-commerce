"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

export default function HeroBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [bannerData, setBannerData] = useState({
    title: "Elevate Your Style Beyond Ordinary",
    subtitle: "Discover the Future of Fashion",
    description:
      "Experience fashion reimagined with our curated collection of cutting-edge designs and timeless classics.",
    primaryButtonText: "Explore Collection",
    primaryButtonLink: "/products",
    secondaryButtonText: "View Lookbook",
    secondaryButtonLink: "/products",
    images: [
      "/api/placeholder/600/800",
      "/api/placeholder/600/800",
      "/api/placeholder/600/800",
      "/api/placeholder/600/800",
    ],
  });

  // Initialize Embla carousel with autoplay plugin
  const [emblaRef] = useEmblaCarousel(
    {
      loop: true,
      align: "center",
      skipSnaps: false,
    },
    [
      Autoplay({
        delay: 4000,
        stopOnInteraction: false,
      }),
    ]
  );

  useEffect(() => {
    const fetchBannerData = async () => {
      try {
        const response = await fetch("/api/hero-banner");
        const data = await response.json();
        if (data && data.length > 0) {
          setBannerData(data[0]);
        }
      } catch (error) {
        console.error("Failed to fetch banner data:", error);
      }
    };

    fetchBannerData();
    setIsVisible(true);
  }, []);

  return (
    <div className="relative h-[85vh] bg-gradient-to-br from-background via-background to-primary/5 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse delay-700" />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:44px_44px]" />

      <div className="container mx-auto px-4 h-full relative">
        <div className="h-full flex flex-col md:flex-row items-center justify-between gap-12">
          {/* Text Content */}
          <div
            className={`max-w-xl space-y-6 transition-all duration-1000 delay-300 transform ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            <div className="flex items-center gap-2 text-primary">
              <Sparkles className="h-5 w-5" />
              <span className="text-sm font-medium">{bannerData.subtitle}</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              {bannerData.title}
            </h1>

            <p className="text-lg text-muted-foreground">
              {bannerData.description}
            </p>

            <div className="flex items-center gap-4 pt-4">
              <Button size="lg" className="group" asChild>
                <a href={bannerData.primaryButtonLink}>
                  {bannerData.primaryButtonText}
                  <ArrowRight className="ml-2 h-4 w-4 transform transition-transform group-hover:translate-x-1" />
                </a>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href={bannerData.secondaryButtonLink}>
                  {bannerData.secondaryButtonText}
                </a>
              </Button>
            </div>

            {/* Stats */}
            <div className="flex gap-8 pt-8 border-t">
              <div>
                <div className="text-2xl font-bold">2500+</div>
                <div className="text-sm text-muted-foreground">Products</div>
              </div>
              <div>
                <div className="text-2xl font-bold">150+</div>
                <div className="text-sm text-muted-foreground">Brands</div>
              </div>
              <div>
                <div className="text-2xl font-bold">98%</div>
                <div className="text-sm text-muted-foreground">
                  Happy Clients
                </div>
              </div>
            </div>
          </div>

          {/* Carousel Section */}
          <div
            className={`relative w-full md:w-1/2 h-[400px] transition-all duration-1000 delay-500 transform ${
              isVisible
                ? "translate-x-0 opacity-100"
                : "translate-x-10 opacity-0"
            }`}
          >
            {/* Updated Embla Carousel structure */}
            <div className="overflow-hidden h-full rounded-2xl" ref={emblaRef}>
              <div className="flex h-full touch-pan-y">
                {bannerData.images.map((src, index) => (
                  <div
                    key={index}
                    className="flex-[0_0_100%] min-w-0 relative h-full"
                  >
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent z-10" />
                    <img
                      src={src}
                      alt={`Featured collection ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Floating card */}
            <div className="absolute -bottom-6 -left-6 bg-card p-4 rounded-xl shadow-lg border backdrop-blur-sm z-20">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="font-medium">New Collection</div>
                  <div className="text-sm text-muted-foreground">
                    Just Dropped
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
