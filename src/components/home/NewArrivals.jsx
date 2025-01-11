import { Card, CardContent, CardFooter } from '@/components/ui/card';

export default function NewArrivals() {
  const products = Array(8).fill({
    name: 'Product Name',
    price: '$99.99',
    image: '/api/placeholder/200/200'
  });

  return (
    <section className="container mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold mb-8">New Arrivals</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((product, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded-lg" />
            </CardContent>
            <CardFooter className="flex flex-col items-start p-4">
              <h3 className="font-semibold">{product.name}</h3>
              <p className="text-primary">{product.price}</p>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}
