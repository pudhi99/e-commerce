import HeroBanner from "@/components/home/HeroBanner";
import FeaturedCategories from "@/components/home/FeaturedCategories";
import NewArrivals from "@/components/home/NewArrivals";
import SpecialOffers from "@/components/home/SpecialOffers";
import PopularProducts from "@/components/home/PopularProducts";
import Newsletter from "@/components/home/Newsletter";

export default async function HomePage() {
  const categories = await prisma.category.findMany({
    include: {
      parent: true,
      products: true,
    },
  });
  return (
    <div className="space-y-12">
      <HeroBanner />
      <FeaturedCategories categories={categories} />
      <NewArrivals />
      <SpecialOffers />
      <PopularProducts />
      <Newsletter />
    </div>
  );
}
