"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge"; // Import Badge for stock status

// --- EDIT 1: Update Product Interface ---
interface Image {
  id: number;
  url: string;
  altText?: string;
}

// --- EDIT 1: Ensure Product interface includes slug ---
interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  categoryId: number;
  active?: boolean;
  images?: Image[];
  stock: number;
  brand?: string;
  discount?: number;
  slug: string; // Add slug field if not already present
}
// --- END EDIT 1 ---

interface Category {
  id: number;
  name: string;
  slug?: string; // Add slug to Category interface
}

export default function ProductDetailPage() {
  const params = useParams();
  const productSlug = params.slug as string;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProductDetails() {
      if (!productSlug) {
        toast.error("Product identifier is missing from URL.");
        setLoading(false);
        setProduct(null);
        return;
      }
      
      try {
        setLoading(true);
         
        // First try to fetch by slug (since we're in [slug]/page.tsx)
        let productResponse = await fetch(`http://localhost:3300/products/slug/${productSlug}`);
        
        // If not found by slug and it's numeric, try by ID
        if (!productResponse.ok && /^\d+$/.test(productSlug)) {
          productResponse = await fetch(`http://localhost:3300/products/${productSlug}`);
        }
        
        // If still not found
        if (!productResponse.ok) {
          if (productResponse.status === 404) {
            console.error(`Product with identifier "${productSlug}" not found.`);
            toast.error("Product not found.");
          } else {
            console.error(`Server error: ${productResponse.status}`);
            toast.error(`Error loading product: ${productResponse.statusText}`);
          }
          setProduct(null);
          return;
        }
        
        const productData = await productResponse.json();
        console.log("Product data received:", productData); // Para depuración
        setProduct(productData);

        // Fetch category details
        if (productData.categoryId) {
          const categoryResponse = await fetch(`http://localhost:3300/categories/${productData.categoryId}`);
          if (categoryResponse.ok) {
            const categoryData = await categoryResponse.json();
            setCategory(categoryData);
          } else {
            console.warn(`Failed to fetch category details for ID: ${productData.categoryId}`);
          }
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
        toast.error("Failed to load product details. Please try again.");
        setProduct(null);
      } finally {
        setLoading(false);
      }
    }

    if (productSlug) {
      fetchProductDetails();
    }
  }, [productSlug]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navigation />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-[400px]">
            <div className="text-center">
              <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
              <p className="text-muted-foreground">Loading product details...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navigation />
        <main className="flex-1 container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="mb-6">The product you are looking for does not exist or has been removed.</p>
          <Link href="/shop">
            <Button>Back to Shop</Button>
          </Link>
        </main>
      </div>
    );
  }

  // Ensure useEffect fetches the updated product structure including images, stock, brand, discount

  // --- EDIT 2: Helper to get primary image URL ---
  const getPrimaryImageUrl = () => {
    if (product?.images && product.images.length > 0) {
      // Assuming the first image is the primary one
      return product.images[0].url;
    }
    // return product?.imageUrl; // Fallback if you still use single imageUrl
    return null; // No image available
  };
  const primaryImageUrl = getPrimaryImageUrl();
  // --- END EDIT 2 ---

  // --- EDIT 3: Calculate final price ---
  const originalPrice = product?.price ?? 0;
  const discountAmount = product?.discount ?? 0;
  const finalPrice = originalPrice - discountAmount;
  const hasDiscount = discountAmount > 0;
  // --- END EDIT 3 ---


  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Assuming Navigation component provides the header similar to the screenshot */}
      <Navigation />

      <main className="flex-1 container mx-auto px-4 py-8">
        {/* --- EDIT 4: Adjust Grid Layout --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Image Section */}
          {/* Use aspect-ratio for better consistency */}
          <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center overflow-hidden border">
            {primaryImageUrl ? (
              <img
                src={primaryImageUrl}
                alt={product?.name ?? 'Product image'}
                // Adjust object-fit as needed (contain or cover)
                className="w-full h-full object-contain"
                onError={(e) => { e.currentTarget.src = "https://via.placeholder.com/600?text=Image+Error"; }} // Basic error handling
              />
            ) : (
              // Placeholder similar to screenshot
              <div className="flex flex-col items-center justify-center text-muted-foreground">
                 {/* Placeholder Icon */}
                 <svg className="w-16 h-16 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                <p className="text-sm">No image available</p>
              </div>
            )}
          </div>
          {/* --- END EDIT 4 --- */}

          {/* Product Details Section */}
          <div>
            {/* Optional: Breadcrumbs or Category Link */}
            <div className="mb-2 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-primary">Home</Link>
              {category && (
                <>
                  <span className="mx-2">/</span>
                  <Link href={`/categories/${category.slug || category.id}`} className="hover:text-primary">
                    {category.name}
                  </Link>
                </>
              )}
               <span className="mx-2">/</span>
               <span>{product?.name}</span> {/* Current product */}
            </div>

            {/* --- EDIT 5: Display Brand --- */}
            {product?.brand && (
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{product.brand}</p>
            )}
            {/* --- END EDIT 5 --- */}

            <h1 className="text-3xl lg:text-4xl font-bold mb-3">{product?.name}</h1>

            {/* --- EDIT 6: Display Price with Discount --- */}
            <div className="flex items-baseline gap-3 mb-4">
               <p className={`text-2xl lg:text-3xl font-bold ${hasDiscount ? 'text-red-600' : 'text-primary'}`}>
                 ${finalPrice.toFixed(2)}
               </p>
               {hasDiscount && (
                 <p className="text-lg text-muted-foreground line-through">
                   ${originalPrice.toFixed(2)}
                 </p>
               )}
            </div>
            {/* --- END EDIT 6 --- */}

            {/* --- EDIT 7: Display Stock Status --- */}
            <div className="mb-5">
              {product && product.stock > 0 ? (
                 product.stock < 10 ? (
                   <Badge variant="outline" className="text-yellow-600 border-yellow-500">Low Stock ({product.stock} left)</Badge>
                 ) : (
                   <Badge variant="outline" className="text-green-600 border-green-500">In Stock</Badge>
                 )
              ) : (
                <Badge variant="destructive">Out of Stock</Badge>
              )}
              {/* Display unavailable status if product is inactive */}
              {product?.active === false && (
                 <Badge variant="destructive" className="ml-2">Currently Unavailable</Badge>
              )}
            </div>
            {/* --- END EDIT 7 --- */}

            {/* Description */}
            {/* Use prose for better text formatting */}
            <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none mb-6">
              <p>{product?.description || "No description available."}</p>
            </div>

            {/* Variants Section Placeholder (Implement later if needed) */}
            {/* <div> ... Variant selection UI ... </div> */}

            {/* Add to Cart Button */}
            <Button
              size="lg"
              // Disable if inactive OR out of stock
              disabled={product?.active === false || (product?.stock ?? 0) <= 0}
              className="w-full sm:w-auto"
              // onClick={handleAddToCart} // Add your cart logic handler here
            >
              Add to Cart
            </Button>

             {/* Optional: Add Wishlist button, etc. */}

          </div>
        </div>

        {/* Optional: Reviews Section Placeholder (Implement later if needed) */}
        {/* <div className="mt-12"> ... Reviews display ... </div> */}

      </main>

      {/* Footer - Keep or modify as needed */}
      <footer className="border-t py-6 bg-gray-100 dark:bg-gray-900 mt-12">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Your Store Name. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}