import { Card, CardContent, CardFooter } from '@/components/ui/card';

export default function PopularProducts() {
  return (
    <section className="container mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold mb-8">Popular Products</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {Array(4).fill(null).map((_, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <img src={`/api/placeholder/200/200`} alt="Product" className="w-full h-48 object-cover rounded-lg" />
            </CardContent>
            <CardFooter className="flex flex-col items-start p-4">
              <h3 className="font-semibold">Popular Product</h3>
              <p className="text-primary">$129.99</p>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}
