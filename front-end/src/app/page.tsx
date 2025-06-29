"use client"
import Navigation from "@/components/Navigation";
import HeroBanner from "@/components/home/HeroBanner";
import CategoryGrid from "@/components/home/CategoryGrid";
import ShopCTA from "@/components/home/ShopCTA";
import Footer from "@/components/Footer";

interface Category {
  id: number;
  name: string;
  description?: string;
  imageUrl?: string;
  parentCategoryId?: number;
  featured: boolean;
}

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      {/* Spacer para evitar saltos cuando la navegación se vuelve fixed */}
      <div className="h-[76px] md:h-[84px] hidden" id="nav-spacer"></div>
      <HeroBanner />
      <CategoryGrid />
      <ShopCTA />
      <Footer />
    </div>
  );
}
