"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  categoryId: number;
  active?: boolean;
  slug?: string; // Add slug to the Product interface
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
  
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchCategoryAndProducts() {
      try {
        setLoading(true);
        
        
        // Fetch products for this category
        const productsResponse = await fetch(`http://localhost:3300/products/category/${categorySlug}`);
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

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
              placeholder="Search products..."
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
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4">
            {filteredProducts.map((product) => (
              <Link 
                href={`/products/${product.slug || product.id}`} 
                key={product.id}
              >
                <Card className="overflow-hidden h-full transition-all duration-200 hover:shadow-md border-0 bg-transparent">
                  <div className="relative">
                    {/* Product badge */}
                    <div className="absolute top-2 left-2 z-10">
                      <div className="bg-black text-white text-xs px-2 py-1 rounded-sm">
                       SALE
                      </div>
                    </div>
                    
                    {/* Product image */}
                    <div className="aspect-square w-full bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 relative">
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <div className="text-center">
                            <div className="text-3xl text-gray-400">📷</div>
                          </div>
                        </div>
                      )}
                      
                      {/* Size badge - positioned at bottom right */}
                      <div className="absolute bottom-2 right-2 bg-white dark:bg-gray-800 text-black dark:text-white text-xs px-2 py-1 rounded-sm">
                        SIZE<br />4.7"x6"
                      </div>
                    </div>
                  </div>
                  
                  <CardContent className="p-3 pt-4">
                    {/* Product name with colored bar */}
                    <div className="flex items-center mb-2">
                      <p className="font-semibold text-lg line-clamp-1">{product.name}</p>
                    </div>
                    
                    {/* Price */}
                    <p className="text-sm font-normal">
                      ${(() => {
                        try {
                          return typeof product.price === 'number' 
                            ? product.price.toFixed(2) 
                            : Number(product.price).toFixed(2);
                        } catch (e) {
                          console.error(`Error formatting price for product ${product.id}:`, e);
                          return product.price || '0.00';
                        }
                      })()}
                    </p>
                  </CardContent>
                </Card>
              </Link>
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
