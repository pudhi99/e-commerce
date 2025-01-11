import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Newsletter() {
  return (
    <section className="bg-background py-16">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
        <p className="mb-8">
          Subscribe to our newsletter for the latest updates and exclusive
          offers.
        </p>
        <div className="max-w-md mx-auto flex gap-4">
          <Input placeholder="Enter your email" type="email" />
          <Button>Subscribe</Button>
        </div>
      </div>
    </section>
  );
}
