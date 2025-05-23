"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import AnnouncementBanner from "@/components/home/AnnouncementBanner";
import HeroBanner from "@/components/home/HeroBanner";
import CategoryGrid from "@/components/home/CategoryGrid";
import { toast } from "sonner";

interface Category {
  id: number;
  name: string;
  description?: string;
  imageUrl?: string;
  parentCategoryId?: number;
  featured: boolean;
}

export default function Home() {
  const [featuredCategories, setFeaturedCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch("http://localhost:3300/categories");
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data = await response.json();
        // Filter to get featured categories or just take the first 3 if none are featured
        const featured = data.filter((cat: Category) => cat.featured);
        setFeaturedCategories(featured.length > 0 ? featured.slice(0, 3) : data.slice(0, 3));
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to load categories. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <AnnouncementBanner />
      <Navigation />
      
      {/* Spacer para evitar saltos cuando la navegación se vuelve fixed */}
      <div className="h-[76px] md:h-[84px] hidden" id="nav-spacer"></div>
      
      <HeroBanner />
      <CategoryGrid />
    </div>
  );
}
