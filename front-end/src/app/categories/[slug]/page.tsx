"use client";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import ProductCard from "@/components/ProductCard";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number; // Assuming this is the FINAL price after discount
  originalPrice?: number; // Add original price if available
  discountPercentage?: number; // Add discount percentage
  rating?: number; // Add rating
  imageUrl?: string;
  images?: { url: string }[];
  categoryId: number;
  active?: boolean;
  slug?: string; 
}

interface Category {
  id: number;
  name: string;
  description?: string;
  imageUrl?: string;
  slug?: string;
}

export default function CategoryProductsPage() {
  const params = useParams();
  const categorySlug = params.slug as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("none");

  useEffect(() => {
    async function fetchCategory() {
      try {
        setLoading(true);
        const categoriesResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`)
        if (!categoriesResponse.ok) {
          throw new Error("Failed to fetch categories");
        }
        const categoriesData = await categoriesResponse.json();
        setCategory(categoriesData);
       } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load categories. Please try again.");
       } finally {
        setLoading(false);
       }
      }
      fetchCategory();
    }, []);
  useEffect(() => {
    async function fetchCategoryAndProducts() {
      try {
        setLoading(true);
        // Fetch products for this category
        const productsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/category/${categorySlug}`);
        if (!productsResponse.ok) {
          throw new Error("Failed to fetch products");
        }
        const productsData = await productsResponse.json();
        setProducts(productsData);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load category products. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    if (categorySlug) {
      fetchCategoryAndProducts();
    }
  }, [categorySlug]);

  
  
  const filteredProducts = useMemo(() => {
    let result = products;
    // search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(q) ||
          product.description.toLowerCase().includes(q)
      );
    }
    // price range filter
    const min = minPrice !== "" ? parseFloat(minPrice) : undefined;
    const max = maxPrice !== "" ? parseFloat(maxPrice) : undefined;
    if (min !== undefined) {
      result = result.filter((p) => (typeof p.price === "number" ? p.price : Number(p.price)) >= min!);
    }
    if (max !== undefined) {
      result = result.filter((p) => (typeof p.price === "number" ? p.price : Number(p.price)) <= max!);
    }
    // sort
    if (sortBy && sortBy !== "none") {
      const sorted = [...result];
      switch (sortBy) {
        case "price-asc":
          sorted.sort((a, b) => (a.price as number) - (b.price as number));
          break;
        case "price-desc":
          sorted.sort((a, b) => (b.price as number) - (a.price as number));
          break;
        case "name-asc":
          sorted.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case "name-desc":
          sorted.sort((a, b) => b.name.localeCompare(a.name));
          break;
      }
      return sorted;
    }
    return result;
  }, [products, searchQuery, minPrice, maxPrice, sortBy]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      
      {/* Header with category info */}
      <header className="relative py-8 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4">
          {category?.imageUrl && (
            <div className="absolute inset-0 opacity-10" style={{ 
              backgroundImage: `url(${category.imageUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              zIndex: 0
            }}></div>
          )}
          <div className="relative z-10">
            <h1 className="text-3xl font-bold mb-2">{category?.name || "Loading..."}</h1>
            {category?.description && (
              <p className="text-muted-foreground max-w-2xl">{category.description}</p>
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 container mx-auto px-4 py-6">
        {/* Search and filters */}
        <div className="mb-6">
          <div className="relative max-w-sm">
            <Input
              type="search"
              placeholder="Buscar productos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          {/* Price Range Filter and Sort By Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            {/* Price Range Filter */}
            <div className="flex-1 max-w-sm sm:max-w-xs flex gap-2">
              <Input
                type="number"
                placeholder="Precio Mín."
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-1/2"
              />
              <Input
                type="number"
                placeholder="Precio Máx."
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-1/2"
              />
            </div>
            {/* Sort By Filter */}
            <div className="flex-1 max-w-sm sm:max-w-xs">
              <Select onValueChange={(value) => setSortBy(value)} defaultValue={sortBy}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Ordenar por..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sin ordenar</SelectItem>
                  <SelectItem value="price-asc">Precio: Menor a Mayor</SelectItem>
                  <SelectItem value="price-desc">Precio: Mayor a Menor</SelectItem>
                  <SelectItem value="name-asc">Nombre: A-Z</SelectItem>
                  <SelectItem value="name-desc">Nombre: Z-A</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex h-[400px] items-center justify-center">
            <div className="text-center">
              <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              <p className="text-muted-foreground">Loading products...</p>
            </div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
            <h3 className="mt-4 text-lg font-semibold">No products found</h3>
            <p className="mb-4 mt-2 text-sm text-muted-foreground">
              {searchQuery ? "Try a different search term" : "There are no products in this category yet."}
            </p>
            <Link href="/" passHref>
              <Button>
                Back to Shop
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {filteredProducts.length > 20 && (
          <div className="mt-8">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" isActive>
                    1
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">2</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">3</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </main>
      
      {/* Footer */}
      <footer className="border-t py-6 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} Your Store Name. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
