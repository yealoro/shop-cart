"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { toast } from "sonner"
import { ShoppingBag, HeartIcon, Search } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"; // Import pagination components

// Define the Product interface based on your API's product structure
interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  slug?: string; // Optional, if you use slugs for product URLs
  originalPrice?: number; // Added for discount display
  discountPercentage?: number; // Added for discount display
  categoryId?: string; // Added for category filtering - assuming products have a categoryId
}

// Define Category interface
interface Category {
  id: string;
  name: string;
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("none");
  const [currentPage, setCurrentPage] = useState(1); // New state for current page

  const ITEMS_PER_PAGE = 20; // Define how many items per page

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`); 
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch products');
        }
        
        const rawData = await response.json();
        const processedData: Product[] = rawData.map((item: any) => ({
          ...item,
          price: parseFloat(item.price),
          originalPrice: item.originalPrice ? parseFloat(item.originalPrice) : undefined,
          discountPercentage: item.discountPercentage ? parseFloat(item.discountPercentage) : undefined,
          categoryId: item.categoryId,
        }));
        setProducts(processedData);
        setCurrentPage(1); // Reset to first page when products are fetched

      } catch (err: any) {
        console.error("Error fetching products:", err);
        setError(err.message || "No se pudieron cargar los productos. Por favor, inténtalo de nuevo más tarde.");
        toast.error("Error al cargar productos.");
      } finally {
        setLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch categories');
        }
        const data: Category[] = await response.json();
        setCategories(data);
      } catch (err: any) {
        console.error("Error fetching categories:", err);
      }
    };

    fetchProducts();
    fetchCategories();
  }, []);

  // Filter and sort products based on search query, selected category, price range, and sort option
  const filteredAndSortedProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.categoryId === selectedCategory;

    const productPrice = product.price;
    const minPriceValue = parseFloat(minPrice);
    const maxPriceValue = parseFloat(maxPrice);

    const matchesMinPrice = isNaN(minPriceValue) || productPrice >= minPriceValue;
    const matchesMaxPrice = isNaN(maxPriceValue) || productPrice <= maxPriceValue;

    return matchesSearch && matchesCategory && matchesMinPrice && matchesMaxPrice;
  }).sort((a, b) => {
    if (sortBy === "price-asc") {
      return a.price - b.price;
    } else if (sortBy === "price-desc") {
      return b.price - a.price;
    } else if (sortBy === "name-asc") {
      return a.name.localeCompare(b.name);
    } else if (sortBy === "name-desc") {
      return b.name.localeCompare(a.name);
    }
    return 0; // No sorting
  });

  // Calculate total pages
  const totalPages = Math.ceil(filteredAndSortedProducts.length / ITEMS_PER_PAGE);

  // Get products for the current page
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const productsToDisplay = filteredAndSortedProducts.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top on page change
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header with general product info */}
      <header className="relative py-8 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4">
          <div className="relative z-10">
            <h1 className="text-3xl font-bold mb-2">Nuestros Productos</h1>
            <p className="text-muted-foreground max-w-2xl">
              Explora nuestra amplia selección de productos de alta calidad.
            </p>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 container mx-auto px-4 py-6">
        {/* Search input and Category filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1 max-w-sm sm:max-w-xs">
            <Input
              type="search"
              placeholder="Buscar productos..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1); // Reset to first page on search
              }}
              className="pl-8"
            />
            <Search
              className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"
            />
          </div>
          {/* Category Filter */}
          <div className="flex-1 max-w-sm sm:max-w-xs">
            <Select onValueChange={(value) => {
              setSelectedCategory(value);
              setCurrentPage(1); // Reset to first page on category change
            }} defaultValue="all">
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filtrar por categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Price Range Filter and Sort By Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          {/* Price Range Filter */}
          <div className="flex-1 max-w-sm sm:max-w-xs flex gap-2">
            <Input
              type="number"
              placeholder="Precio Mín."
              value={minPrice}
              onChange={(e) => {
                setMinPrice(e.target.value);
                setCurrentPage(1); // Reset to first page on price change
              }}
              className="w-1/2"
            />
            <Input
              type="number"
              placeholder="Precio Máx."
              value={maxPrice}
              onChange={(e) => {
                setMaxPrice(e.target.value);
                setCurrentPage(1); // Reset to first page on price change
              }}
              className="w-1/2"
            />
          </div>
          {/* Sort By Filter */}
          <div className="flex-1 max-w-sm sm:max-w-xs">
            <Select onValueChange={(value) => {
              setSortBy(value);
              setCurrentPage(1); // Reset to first page on sort change
            }} defaultValue="none">
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

        {loading ? (
          <div className="flex h-[400px] items-center justify-center">
            <div className="text-center">
              <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              <p className="text-muted-foreground">Cargando productos...</p>
            </div>
          </div>
        ) : filteredAndSortedProducts.length === 0 ? (
          <div className="flex h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
            <h3 className="mt-4 text-lg font-semibold">No se encontraron productos</h3>
            <p className="mb-4 mt-2 text-sm text-muted-foreground">
              {searchQuery || selectedCategory !== "all" || minPrice || maxPrice ? "Intenta con un término de búsqueda diferente o ajusta los filtros" : "No hay productos disponibles en este momento."}
            </p>
            <Link href="/" passHref>
              <Button>
                Volver a la Tienda
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {productsToDisplay.map((product) => { // Use productsToDisplay here
              const hasDiscount = product.originalPrice && product.originalPrice > product.price;
              const discountValue = product.discountPercentage ?? (hasDiscount ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100) : 0);

              return (
                <Link 
                  href={`/products/${product.slug || product.id}`} 
                  key={product.id} 
                  className="group"
                >
                  <Card className="overflow-hidden h-full transition-shadow duration-200 hover:shadow-lg border rounded-lg flex flex-col">
                    <div className="relative">
                      {/* Discount Badge */}
                      {hasDiscount && discountValue > 0 && (
                        <Badge 
                          variant="destructive" 
                          className="absolute top-2 left-2 z-10 rounded-full px-2 py-0.5 text-xs"
                        >
                          -{discountValue}%
                        </Badge>
                      )}
                      
                      {/* Wishlist Button */}
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="absolute top-1 right-1 z-10 h-8 w-8 rounded-full bg-white/70 hover:bg-white dark:bg-black/50 dark:hover:bg-black"
                        onClick={(e) => { e.preventDefault(); /* Add wishlist logic */ toast.info("Añadido a la lista de deseos (placeholder)"); }}
                      >
                        <HeartIcon className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                      </Button>
                      
                      {/* Product image */}
                      <div className="aspect-square w-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden">
                        {product.imageUrl ? (
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            onError={(e) => { e.currentTarget.src = "https://via.placeholder.com/300x300?text=No+Image"; }}
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-gray-300 dark:text-gray-600">
                            <ShoppingBag className="h-12 w-12" /> {/* Placeholder Icon */}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="p-4 flex flex-col flex-grow">
                      <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-200 truncate mb-1">
                        {product.name}
                      </h3>
                      <div className="flex items-baseline mt-auto">
                        {hasDiscount && product.originalPrice ? (
                          <>
                            <p className="text-gray-900 font-bold text-lg">${product.price.toFixed(2)}</p>
                            <p className="text-sm text-muted-foreground line-through ml-2">${product.originalPrice.toFixed(2)}</p>
                          </>
                        ) : (
                          <p className="text-gray-900 font-bold text-lg">${product.price.toFixed(2)}</p>
                        )}
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && ( // Only show pagination if there's more than one page
          <div className="mt-8">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage > 1) handlePageChange(currentPage - 1);
                    }}
                    aria-disabled={currentPage === 1}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink 
                      href="#" 
                      isActive={page === currentPage}
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(page);
                      }}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage < totalPages) handlePageChange(currentPage + 1);
                    }}
                    aria-disabled={currentPage === totalPages}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </main>
    </div>
  );
}