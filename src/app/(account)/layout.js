// src/app/(shop)/layout.js
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function ShopLayout({ children }) {
  return (
    <>
      <Header />
      <main className="pt-16 min-h-screen">{children}</main>
      <Footer />
    </>
  );
}
