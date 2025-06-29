"use client"
import Navigation from "@/components/Navigation";
import HeroBanner from "@/components/home/HeroBanner";
import CategoryGrid from "@/components/home/CategoryGrid";
import ShopCTA from "@/components/home/ShopCTA";
import Footer from "@/components/Footer";
import AuthPage from "@/components/home/AuthPage";

interface Category {
  id: number;
  name: string;
  description?: string;
  imageUrl?: string;
  parentCategoryId?: number;
  featured: boolean;
}

export default function Login() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <AuthPage />
      <Footer />
    </div>
  );
}
