import { Button } from "@/components/ui/button";

export default function HeroBanner() {
  return (
    <div className="relative h-[600px] bg-background">
      <div className="container mx-auto px-4 h-full flex items-center">
        <div className="max-w-xl">
          <h1 className="text-5xl font-bold mb-6">Discover Your Style</h1>
          <p className="text-xl mb-8">
            Shop the latest trends and find your perfect look.
          </p>
          <Button size="lg">Shop Now</Button>
        </div>
      </div>
    </div>
  );
}
