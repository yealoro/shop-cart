"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/context/CartContext";
import { useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

interface Image {
  id: number;
  url: string;
  altText?: string;
}

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
  slug: string;
  colors?: string[]; // Añadido para colores disponibles
  sizes?: string[]; // Añadido para tallas disponibles
}

interface Category {
  id: number;
  name: string;
  slug?: string;
}

export default function ProductDetailPage() {
  const params = useParams();
  const productSlug = params.slug as string;
  const searchParams = useSearchParams();
  const isAdmin = (searchParams.get("admin") === "1" || searchParams.get("admin") === "true");
  
  // Helper para resolver URLs de imágenes (soporta rutas relativas del backend /uploads)
  const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3300").replace(/\/$/, "");
  const resolveImageSrc = (src?: string) => {
    if (!src) return "https://via.placeholder.com/600?text=No+Image";
    if (src.startsWith("/uploads")) return `${API_BASE_URL}${src}`;
    return src;
  };
  
  const [product, setProduct] = useState<Product | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const [newImageUrl, setNewImageUrl] = useState("");
  const [newImageAlt, setNewImageAlt] = useState("");
  const [newImageOrder, setNewImageOrder] = useState<number | "">("");
  // Colores y tallas de ejemplo (reemplazar con datos reales del producto)
  const availableColors = ["white", "black", "blue"];
  const availableSizes = ["S", "M", "L", "XL"];

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
        let productResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/slug/${productSlug}`);
        
        // If not found by slug and it's numeric, try by ID
        if (!productResponse.ok && /^\d+$/.test(productSlug)) {
          productResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${productSlug}`);
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
        console.log("Product data received:", productData);
        setProduct(productData);

        // Establecer la imagen seleccionada por defecto
        if (productData.images && productData.images.length > 0) {
          setSelectedImage(productData.images[0].url);
        }

        // Fetch category details
        if (productData.categoryId) {
          const categoryResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/${productData.categoryId}`);
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

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
  };

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    if (!selectedColor || !selectedSize) {
      toast.error("Please select color and size");
      return;
    }
    
    addItem(product, quantity, selectedColor, selectedSize);
  };

  const handleBuyNow = () => {
    if (!product) return;
    
    if (!selectedColor || !selectedSize) {
      toast.error("Please select color and size");
      return;
    }
    
    addItem(product, quantity, selectedColor, selectedSize);
    // Navigate to cart page
    window.location.href = "/cart";
  };

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

  // Calcular precios
  const originalPrice = Number(product?.price ?? 0);
  const discountAmount = Number(product?.discount ?? 0);
  const finalPrice = Math.max(0, originalPrice - discountAmount);
  const hasDiscount = discountAmount > 0;

  // Obtener todas las imágenes del producto
  const productImages = product?.images || [];

  const handleAddImage = async () => {
    if (!product) {
      toast.error("No product loaded");
      return;
    }
    if (!newImageUrl) {
      toast.error("Por favor ingresa la URL de la imagen");
      return;
    }
    try {
      const orderValue = newImageOrder === "" ? (productImages.length) : Number(newImageOrder);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/images`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: newImageUrl,
          altText: newImageAlt || product.name,
          order: orderValue,
          product: { id: product.id },
        }),
      });
      if (!response.ok) {
        throw new Error(`Error al guardar la imagen: ${response.statusText}`);
      }
      const createdImage: Image = await response.json();
      setProduct((prev) => prev ? { ...prev, images: [...(prev.images || []), createdImage] } : prev);
      setSelectedImage(createdImage.url);
      setNewImageUrl("");
      setNewImageAlt("");
      setNewImageOrder("");
      toast.success("Imagen agregada correctamente");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "No se pudo guardar la imagen");
    }
  };

  const handleDeleteImage = async (imageId: number) => {
    if (!product) return;
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/images/${imageId}`, { method: "DELETE" });
      if (!response.ok) {
        throw new Error("No se pudo eliminar la imagen");
      }
      setProduct((prev) => prev ? { ...prev, images: (prev.images || []).filter(img => img.id !== imageId) } : prev);
      if (selectedImage && !((product.images || []).some(img => img.url === selectedImage))) {
        const first = (product.images || [])[0];
        setSelectedImage(first ? first.url : null);
      }
      toast.success("Imagen eliminada");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Error eliminando imagen");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />

      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <div className="mb-6 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary">Inicio</Link>
          {category && (
            <>
              <span className="mx-2">/</span>
              <Link href={`/categories/${category.slug || category.id}`} className="hover:text-primary">
                {category.name}
              </Link>
            </>
          )}
          <span className="mx-2">/</span>
          <span>{product?.name}</span>
        </div>

        {/* Product Display */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Left Column - Images */}
          <div className="space-y-4">
            {/* Carousel de Imágenes */}
            <Carousel
              opts={{ loop: true }}
              plugins={[Autoplay({ delay: 4000, stopOnMouseEnter: true })]}
              className="w-full"
            >
              <CarouselContent>
                {(productImages.length > 0 ? productImages : [{ url: "https://via.placeholder.com/600?text=No+Image", altText: product?.name }]).map((image, index) => (
                  <CarouselItem key={'id' in image && image.id ? image.id : index}>
                    <div className="relative aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden border">
                      <Image
                        src={resolveImageSrc(image.url)}
                        alt={image.altText || `${product?.name || "Producto"} - imagen ${index + 1}`}
                        fill
                        className="object-contain"
                        sizes="(min-width: 768px) 50vw, 100vw"
                        quality={90}
                        priority={index === 0}
                      />
                      {isAdmin && 'id' in image && image.id && (
                        <div className="absolute top-2 right-2 z-10">
                          <Button size="sm" variant="destructive" onClick={() => handleDeleteImage(image.id!)}>Eliminar</Button>
                        </div>
                      )}
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="flex items-center justify-between mt-2">
                <CarouselPrevious />
                <CarouselNext />
              </div>
            </Carousel>

            {/* Pista de uso */}
            {productImages.length > 0 && (
              <div className="text-xs text-muted-foreground">Arrastra o usa los controles para navegar por las imágenes.</div>
            )}

            {/* Full Gallery */}
            {productImages.length > 0 && (
              <section className="mt-6">
                <h2 className="text-lg font-semibold mb-3">Galería del producto</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {productImages.map((image, index) => (
                    <div key={image.id || index} className="relative aspect-square rounded-lg overflow-hidden border">
                      <Image
                        src={resolveImageSrc(image.url)}
                        alt={image.altText || `${product?.name || "Producto"} - imagen ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="(min-width: 768px) 33vw, 50vw"
                        quality={90}
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {isAdmin && (
              <div className="mt-4 p-4 border rounded-md">
                <h3 className="text-sm font-medium mb-3">Agregar nueva imagen</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Input placeholder="URL de la imagen" value={newImageUrl} onChange={(e) => setNewImageUrl(e.target.value)} />
                  <Input placeholder="Texto alternativo (opcional)" value={newImageAlt} onChange={(e) => setNewImageAlt(e.target.value)} />
                  <Input placeholder="Orden (opcional)" type="number" value={newImageOrder as number | string} onChange={(e) => setNewImageOrder(e.target.value ? Number(e.target.value) : "")} />
                </div>
                <div className="mt-3">
                  <Button onClick={handleAddImage}>Guardar imagen</Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">Consejo: Puedes activar el modo administrador añadiendo <strong>?admin=1</strong> a la URL de esta página.</p>
              </div>
            )}
          </div>

          {/* Right Column - Product Info */}
          <div>
            {/* Brand */}
            {product?.brand && (
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{product.brand}</p>
            )}
            
            {/* Product Name */}
            <h1 className="text-3xl font-bold mb-4">{product?.name}</h1>
            
            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <p className={`text-2xl font-bold ${hasDiscount ? 'text-red-600' : 'text-primary'}`}>
                ${finalPrice.toFixed(2)}
              </p>
              {hasDiscount && (
                <p className="text-lg text-muted-foreground line-through">
                  ${originalPrice.toFixed(2)}
                </p>
              )}
            </div>
            
            {/* Description */}
            <div className="prose prose-sm max-w-none mb-6">
              <p>{product?.description || "No description available."}</p>
            </div>
            
            {/* Color Selection */}
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-3">Color</h3>
              <div className="flex gap-2">
                {availableColors.map(color => (
                  <button
                    key={color}
                    type="button"
                    className={`w-8 h-8 rounded-full ${
                      selectedColor === color ? 'ring-2 ring-offset-2 ring-primary' : ''
                    }`}
                    style={{ backgroundColor: color === 'white' ? '#f9fafb' : color }}
                    onClick={() => handleColorSelect(color)}
                    aria-label={`Color ${color}`}
                  />
                ))}
              </div>
              {!selectedColor && (
                <p className="text-xs text-red-500 mt-1">Please select a color</p>
              )}
            </div>
            
            {/* Size Selection */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-medium">Size</h3>
                <button className="text-xs text-primary hover:underline">Size Guide</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {availableSizes.map(size => (
                  <button
                    key={size}
                    type="button"
                    className={`min-w-[3rem] h-10 px-3 border rounded-md flex items-center justify-center text-sm font-medium ${
                      selectedSize === size 
                        ? 'bg-primary text-primary-foreground border-primary' 
                        : 'bg-background hover:bg-muted'
                    }`}
                    onClick={() => handleSizeSelect(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
              {!selectedSize && (
                <p className="text-xs text-red-500 mt-1">Please select a size</p>
              )}
            </div>
            
            {/* Stock Status */}
            <div className="mb-6">
              {product && product.stock > 0 ? (
                product.stock < 10 ? (
                  <Badge variant="outline" className="text-yellow-600 border-yellow-500">Low Stock ({product.stock} left)</Badge>
                ) : (
                  <Badge variant="outline" className="text-green-600 border-green-500">In Stock</Badge>
                )
              ) : (
                <Badge variant="destructive">Out of Stock</Badge>
              )}
              {product?.active === false && (
                <Badge variant="destructive" className="ml-2">Currently Unavailable</Badge>
              )}
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                size="lg"
                disabled={product?.active === false || (product?.stock ?? 0) <= 0 || !selectedColor || !selectedSize}
                onClick={handleAddToCart}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3z" />
                  <path d="M16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                </svg>
                Add to Cart
              </Button>
              <Button
                className="flex-1"
                size="lg"
                variant="outline"
                disabled={product?.active === false || (product?.stock ?? 0) <= 0 || !selectedColor || !selectedSize}
                onClick={handleBuyNow}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                Buy Now
              </Button>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t py-6 bg-gray-100 dark:bg-gray-900 mt-12">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Your Store Name. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}