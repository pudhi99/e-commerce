"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, ShoppingCart, UserCog } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import SessionDropdown from "../auth/SessionDropdown";

export default function Header({ session }) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams({
      search: searchTerm,
      type: "ALL",
      minPrice: "0",
      maxPrice: "1000000",
      page: "1",
    });
    router.push(`/products?${params.toString()}`);
  };

  console.log(session, "session");

  return (
    <header className="fixed top-0 left-0 right-0 border-b z-50 bg-card">
      <div className="container mx-auto px-4">
        <div className="h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-primary">
            STORE
          </Link>
          <nav className="hidden md:flex space-x-6">
            <Link
              href="/products?category=All&minPrice=0&maxPrice=1000000&page=1"
              className="hover:text-primary transition"
            >
              Products
            </Link>
            <Link href="/categories" className="hover:text-primary transition">
              Categories
            </Link>
            <Link href="/deals" className="hover:text-primary transition">
              Deals
            </Link>
          </nav>
          <div className="hidden md:flex w-1/3">
            <form onSubmit={handleSearch} className="relative w-full">
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-10"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </form>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            {session.user.role == "ADMIN" ? (
              <Button variant="ghost" size="icon">
                <Link href="/dashboard" className="hover:text-primary">
                  <UserCog className="h-5 w-5" />
                </Link>
              </Button>
            ) : (
              ""
            )}

            <SessionDropdown session={session} />
            <Button variant="ghost" size="icon">
              <Link href="/cart" className="hover:text-primary">
                <ShoppingCart className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
