"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import CategoryCard from "@/components/home/CategoryCard";
import Navigation from "@/components/Navigation";


interface Category {
  id: number;
  name: string;
  description?: string;
  imageUrl?: string;
  parentCategoryId?: number;
  featured: boolean;
}

export default function CategoryGrid() {
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
      <Navigation />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-4 md:px-8 py-8">
      {loading ? (
        // Loading skeleton
        Array(3).fill(0).map((_, index) => (
          <div key={index} className="aspect-square bg-gray-200 animate-pulse relative">
            <div className="absolute inset-0 bg-black/10 flex items-end p-6">
              <div className="h-8 bg-gray-300 w-3/4 rounded"></div>
            </div>
          </div>
        ))
      ) : featuredCategories.length > 0 ? (
        // Display fetched categories
        featuredCategories.map((category) => (
          <CategoryCard 
            key={category.id}
            id={category.id}
            name={category.name}
            imageUrl={category.imageUrl}
          />
        ))
      ) : (
        // Fallback if no categories found
        <div className="col-span-3 py-12 text-center">
          <h3 className="text-xl font-semibold text-gray-700">No categories found</h3>
          <p className="mt-2 text-gray-500">Check back soon for our product categories!</p>
        </div>
      )}
    </div>
  </div>
  );
}