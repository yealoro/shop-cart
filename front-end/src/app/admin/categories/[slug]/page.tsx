"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import Navigation from "@/components/Navigation"; // Assuming Navigation is still relevant or adjust as needed
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card"; // Ensure CardContent is used if needed, or remove if not
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

// ... existing interfaces (Product, Category) ...
interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  categoryId: number;
  active?: boolean;
}

interface Category {
  id: number;
  name: string;
  description?: string;
  imageUrl?: string;
  slug?: string; // Assuming slug comes from API or is generated
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
      // ... existing fetch logic ...
       try {
        setLoading(true);

        // Fetch all categories first to find the one with the matching slug
        // Consider fetching category by slug directly if your API supports it
        const categoriesResponse = await fetch(`http://localhost:3300/categories`);
        if (!categoriesResponse.ok) {
          throw new Error("Failed to fetch categories");
        }
        const categoriesData = await categoriesResponse.json();

        // Find the category with the matching slug (assuming slug generation logic)
        // IMPORTANT: Ensure your Category interface/API includes a 'slug' or you have a consistent way to generate it
        const foundCategory = categoriesData.find((cat: Category) =>
           (cat.slug || cat.name.toLowerCase().replace(/\s+/g, '-')) === categorySlug
        );


        if (!foundCategory) {
          // Try fetching by ID if slug is numeric (fallback or alternative)
          if (!isNaN(Number(categorySlug))) {
             const categoryByIdResponse = await fetch(`http://localhost:3300/categories/${categorySlug}`);
             if (categoryByIdResponse.ok) {
                 const categoryByIdData = await categoryByIdResponse.json();
                 setCategory(categoryByIdData);
                 // Fetch products for this category
                 const productsResponse = await fetch(`http://localhost:3300/products?categoryId=${categoryByIdData.id}`);
                 if (!productsResponse.ok) throw new Error("Failed to fetch products");
                 const productsData = await productsResponse.json();
                 // Filter only active products if needed, or adjust based on your requirements
                 setProducts(productsData.filter((p: Product) => p.active !== false));
                 setLoading(false);
                 return; // Exit function after successful fetch by ID
             }
          }
          throw new Error("Category not found");
        }

        setCategory(foundCategory);

        // Fetch products for this category
        const productsResponse = await fetch(`http://localhost:3300/products?categoryId=${foundCategory.id}`);
        if (!productsResponse.ok) {
          throw new Error("Failed to fetch products");
        }
        const productsData = await productsResponse.json();
        // Filter only active products if needed, or adjust based on your requirements
        setProducts(productsData.filter((p: Product) => p.active !== false));
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load category products. Please try again.");
        // Optionally redirect or show a more specific error message
      } finally {
        setLoading(false);
      }
    }

    if (categorySlug) {
      fetchCategoryAndProducts();
    }
  }, [categorySlug]);

  // Define filteredProducts based on searchQuery
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Ensure Navigation component is correctly imported and used */}
      <Navigation />

      {/* Header with category info - Make sure this JSX is present and correct */}
      <header className="bg-secondary py-4 shadow-sm">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="h-8 bg-gray-300 rounded w-1/4 animate-pulse"></div>
          ) : category ? (
            <h1 className="text-2xl font-semibold">{category.name} Products</h1>
          ) : (
            <h1 className="text-2xl font-semibold text-red-600">Category Not Found</h1>
          )}
          {category?.description && <p className="text-muted-foreground mt-1">{category.description}</p>}
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 container mx-auto px-4 py-6">
        {/* Search and filters - Make sure this JSX is present and correct */}
         <div className="mb-6 flex justify-between items-center">
           <div className="relative w-full max-w-sm">
             <Input
               type="search"
               placeholder="Search products in this category..."
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="pl-8" // Add padding for potential icon
             />
             {/* Optional: Add a search icon */}
             {/* <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /> */}
           </div>
           {/* Add filter/sort options here if needed */}
         </div>


        {loading ? (
           <div className="text-center py-10">Loading products...</div> // Simple loading text
        ) : filteredProducts.length === 0 ? (
           <div className="flex h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
            <h3 className="mt-4 text-lg font-semibold">No products found</h3>
            <p className="mb-4 mt-2 text-sm text-muted-foreground">
              {searchQuery ? "Try a different search term" : "There are no products in this category yet."}
            </p>
            {/* Link back to admin categories */}
            <Link href="/admin/categories" passHref>
              <Button variant="outline">
                Back to Categories
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4">
            {filteredProducts.map((product) => (
              // Link points to public product page. Change to /admin/products/[id] if needed.
              <Link href={`/products/${product.id}`} key={product.id}>
                 {/* Ensure Card and CardContent are used correctly */}
                <Card className="overflow-hidden h-full transition-all duration-200 hover:shadow-lg cursor-pointer group">
                   <CardContent className="p-0">
                     <div className="aspect-square overflow-hidden bg-muted flex items-center justify-center">
                       {product.imageUrl ? (
                         <img
                           src={product.imageUrl}
                           alt={product.name}
                           className="object-cover h-full w-full transition-transform duration-300 group-hover:scale-105"
                           onError={(e) => { e.currentTarget.src = "https://via.placeholder.com/300?text=No+Image"; }} // Fallback image
                         />
                       ) : (
                         <span className="text-sm text-muted-foreground">No Image</span>
                       )}
                     </div>
                     <div className="p-3">
                       <h3 className="font-semibold text-base truncate group-hover:text-primary">{product.name}</h3>
                       {/* <p className="text-sm text-muted-foreground truncate mt-1">{product.description}</p> */}
                       <p className="font-bold text-lg mt-1">${product.price.toFixed(2)}</p>
                     </div>
                   </CardContent>
                 </Card>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination - Make sure this JSX is present and correct, and logic is implemented if needed */}
        {/* Example Pagination Structure (needs state/logic) */}
        {/*
        <div className="mt-8">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
        */}
      </main>

      {/* Footer - Make sure this JSX is present and correct */}
       <footer className="py-4 border-t mt-8">
         <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
           © {new Date().getFullYear()} Deco Shop Admin
         </div>
       </footer>
    </div>
  );
}