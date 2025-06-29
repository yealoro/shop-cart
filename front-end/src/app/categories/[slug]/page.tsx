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
import { StarIcon, HeartIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/context/CartContext"; // Import useCart hook

interface Product {
  id: number;
  name: string;
  description: string;
  price: number; // Assuming this is the FINAL price after discount
  originalPrice?: number; // Add original price if available
  discountPercentage?: number; // Add discount percentage
  rating?: number; // Add rating
  imageUrl?: string; // Or images?: { url: string }[];
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
  
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { addItem } = useCart(); // Use the addItem function from cart context
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
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"> {/* Adjusted grid columns for potentially smaller cards */}
            {filteredProducts.map((product) => {
              // Calculate if there is a discount to show
              const hasDiscount = product.originalPrice && product.originalPrice > product.price;
              const discountValue = product.discountPercentage ?? (hasDiscount ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100) : 0);

              return (
                <Link 
                  href={`/products/${product.slug || product.id}`} 
                  key={product.id}
                  className="group" // Add group for potential hover effects on buttons
                >
                  <Card className="overflow-hidden h-full transition-shadow duration-200 hover:shadow-lg border rounded-lg flex flex-col"> {/* Added rounded-lg and flex */}
                    <div className="relative">
                      {/* Discount Badge */}
                      {hasDiscount && discountValue > 0 && (
                        <Badge 
                          variant="destructive" // Use destructive variant for red color
                          className="absolute top-2 left-2 z-10 rounded-full px-2 py-0.5 text-xs" // Adjusted styling
                        >
                          -{discountValue}%
                        </Badge>
                      )}
                      
                      {/* Wishlist Button */}
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="absolute top-1 right-1 z-10 h-8 w-8 rounded-full bg-white/70 hover:bg-white dark:bg-black/50 dark:hover:bg-black"
                        onClick={(e) => { e.preventDefault(); /* Add wishlist logic */ toast.info("Added to wishlist (placeholder)"); }}
                      >
                        <HeartIcon className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                      </Button>
                      
                      {/* Product image */}
                      <div className="aspect-square w-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden">
                        {product.imageUrl ? (
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" // Added hover effect
                          />
                        ) : (
                          // Placeholder similar to the image
                          <div className="flex h-full w-full items-center justify-center text-gray-300 dark:text-gray-600">
                             {/* Placeholder Icon - You can use an SVG or an icon library */}
                             <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <CardContent className="p-3 flex-grow flex flex-col justify-between"> {/* Adjusted padding and flex */}
                      <div> {/* Top part of content */}
                        {/* Rating */}
                        {product.rating && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                            <StarIcon className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
                            <span>{product.rating.toFixed(1)}</span>
                          </div>
                        )}
                        
                        {/* Product name */}
                        <p className="font-medium text-xl leading-tight line-clamp-2 mb-2">{product.name}</p>
                      </div>

                      {/* Bottom part of content (Price and Cart Button) */}
                      <div className="flex items-end justify-between mt-auto pt-2">
                        {/* Price */}
                        <div>
                          {hasDiscount && product.originalPrice != null && (
                            <p className="text-xs text-muted-foreground line-through">
                              ${(+product.originalPrice).toFixed(2)} 
                            </p>
                          )}
                          <p className={`font-semibold ${hasDiscount ? 'text-red-600' : 'text-foreground'}`}>
                            ${product.price != null ? (+product.price).toFixed(2) : 'N/A'} 
                          </p>
                        </div>
                        
                        {/* Add to Cart Button */}
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={(e) => { 
                            e.preventDefault(); 
                            addItem(product, 1); // Add 1 quantity of the product to cart
                            toast.success(`${product.name} added to cart!`);
                          }}
                        >
                          <ShoppingCartIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
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
