import { Button } from "@/components/ui/button";

export default function SpecialOffers() {
  return (
    <section className="bg-primary/10 py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8">Special Offers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-background p-8 rounded-lg">
            <h3 className="text-2xl font-bold mb-4">Summer Sale</h3>
            <p className="mb-4">Up to 50% off on selected items</p>
            <Button>Shop Now</Button>
          </div>
          <div className="bg-background p-8 rounded-lg">
            <h3 className="text-2xl font-bold mb-4">New Collection</h3>
            <p className="mb-4">Discover our latest arrivals</p>
            <Button>Explore</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
