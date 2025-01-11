"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ProductCard from "./ProductCard";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { PackageSearch } from "lucide-react";
import ProductsGridSkeleton from "../skeleton/ProductsGridSkeleton";

export default function ProductsList({ categories }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    category: searchParams.get("category") || "All",
    minPrice: searchParams.get("minPrice") || "0",
    maxPrice: searchParams.get("maxPrice") || "1000000",
    page: searchParams.get("page") || "1",
  });

  console.log(filters, "filters");
  const [pagination, setPagination] = useState({
    total: 0,
    pages: 0,
    current: 1,
  });

  const updateURL = (newFilters) => {
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    router.push(`/products?${params.toString()}`);
  };

  const handleFilterChange = (key, value) => {
    const newFilters = {
      ...filters,
      [key]: value,
      page: "1", // Reset page when filters change
    };
    setFilters(newFilters);
    updateURL(newFilters);
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        ...filters,
        limit: "12",
      }).toString();
      const response = await fetch(`/api/products?${queryParams}`);
      const data = await response.json();
      setProducts(data.products);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [searchParams]);

  const handleClearFilters = () => {
    const defaultFilters = {
      search: "",
      category: "",
      minPrice: "0",
      maxPrice: "1000000",
      page: "1",
    };
    setFilters(defaultFilters);
    updateURL(defaultFilters);
  };

  const NoProductsFound = () => (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <PackageSearch className="w-16 h-16 text-gray-400 mb-4" />
      <h3 className="text-xl font-semibold mb-2">No Products Found</h3>
      <p className="text-gray-600 mb-4 max-w-md">
        We couldn't find any products matching your current filters:
        {filters.search && (
          <span className="block">Search: "{filters.search}"</span>
        )}
        {filters.category !== "all" && (
          <span className="block">
            Category:{" "}
            {categories.find((c) => c.slug === filters.category)?.name}
          </span>
        )}
        <span className="block">
          Price Range: ${filters.minPrice} - ${filters.maxPrice}
        </span>
      </p>
      <Button onClick={handleClearFilters} variant="outline">
        Clear All Filters
      </Button>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Our Products</h1>
        <p className="text-gray-600">
          {filters.category
            ? `Browsing ${
                categories.find((c) => c.slug === filters.category)?.name ||
                filters.category
              }`
            : "Discover our amazing collection"}
        </p>
      </div>

      {/* Enhanced Filters Section */}
      <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 mb-8 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Search Input with Icon */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Search Products</label>
            <Input
              placeholder="Search products..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className="w-full bg-white/10"
            />
          </div>

          {/* Category Select */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Category</label>
            <Select
              value={filters.category}
              onValueChange={(value) => handleFilterChange("category", value)}
            >
              <SelectTrigger className="w-full bg-white/10">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Categories</SelectItem>
                {categories.map(({ slug, name }) => (
                  <SelectItem key={slug} value={slug}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Price Range Slider */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Price Range</label>
            <div className="px-2 pt-2">
              <Slider
                min={0}
                max={1000000}
                step={10}
                value={[parseInt(filters.minPrice), parseInt(filters.maxPrice)]}
                onValueChange={([min, max]) => {
                  handleFilterChange("minPrice", min.toString());
                  handleFilterChange("maxPrice", max.toString());
                }}
                className="mb-2"
              />
              <div className="flex justify-between text-sm text-gray-400">
                <span>${filters.minPrice}</span>
                <span>${filters.maxPrice}</span>
              </div>
            </div>
          </div>

          {/* Clear Filters Button */}
          <div className="flex items-end">
            <Button
              variant="outline"
              onClick={handleClearFilters}
              className="w-full bg-white/10 hover:bg-white/20"
            >
              Clear Filters
            </Button>
          </div>
        </div>
      </div>

      {loading ? (
        <ProductsGridSkeleton />
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <NoProductsFound />
      )}

      {products.length > 0 && (
        <div className="mt-8 flex justify-center">
          <div className="flex gap-2">
            {Array.from({ length: pagination?.pages || 0 }, (_, i) => (
              <Button
                key={i + 1}
                variant={pagination.current === i + 1 ? "default" : "outline"}
                onClick={() => handleFilterChange("page", (i + 1).toString())}
              >
                {i + 1}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
