// src/app/(shop)/layout.js
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function ShopLayout({ children }) {
  const session = await getServerSession(authOptions);
  return (
    <>
      <Header session={session} />
      <main className="pt-16 min-h-screen">{children}</main>
      <Footer />
    </>
  );
}
