"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, ShoppingCart, UserCog, Menu, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import SessionDropdown from "../auth/SessionDropdown";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetHeader,
} from "@/components/ui/sheet";

export default function Header({ session }) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);

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

  const navLinks = [
    {
      href: "/products?category=All&minPrice=0&maxPrice=1000000&page=1",
      label: "Products",
    },
    {
      href: "/categories",
      label: "Categories",
    },
    {
      href: "/deals",
      label: "Deals",
    },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 border-b z-50 bg-card">
      <div className="container mx-auto px-4">
        <div className="h-16 flex items-center justify-between">
          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col space-y-4 mt-8">
                  {/* Mobile Search */}
                  <form onSubmit={handleSearch} className="relative w-full">
                    <Input
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search products..."
                      className="w-full pl-10"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </form>

                  {/* Mobile Navigation Links */}
                  {navLinks.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="text-lg font-medium hover:text-primary transition py-2"
                      onClick={() => setIsOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <Link href="/" className="text-xl font-bold text-primary">
            STORE
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="hover:text-primary transition"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Search */}
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

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            {session?.user.role === "ADMIN" && (
              <Button variant="ghost" size="icon">
                <Link href="/dashboard" className="hover:text-primary">
                  <UserCog className="h-5 w-5" />
                </Link>
              </Button>
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
