"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { cartItems, removeItem, updateQuantity, clearCart, getCartTotal } = useCart();
  const router = useRouter();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [failedThumb, setFailedThumb] = useState<Record<string, boolean>>({});

  // Helper para mostrar precios como enteros (sin decimales)
  const formatCurrencyInt = (value: number | string) => Math.round(Number(value)).toLocaleString("es-CO");

  const handleCheckout = () => {
    setIsCheckingOut(true);
    // Simulate checkout process
    setTimeout(() => {
      toast.success("¡Pedido realizado con éxito!"); // Translated toast message
      clearCart();
      router.push("/checkout/success");
      setIsCheckingOut(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />

      <main className="flex-1 container mx-auto px-3 sm:px-4 py-8">
        <div className="mb-6">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground flex items-center">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Continuar Comprando
          </Link>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold mb-8">Carrito de Compras</h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
              <ShoppingBag className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Tu carrito está vacío</h2>
            <p className="text-muted-foreground mb-6">Parece que aún no has añadido nada a tu carrito.</p>
            <Link href="/">
              <Button>Explorar Productos</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {/* Cart Header - Desktop */}
              <div className="hidden md:grid grid-cols-12 gap-4 pb-2 border-b text-sm font-medium text-muted-foreground">
                <div className="col-span-6">Producto</div>
                <div className="col-span-2 text-center">Precio</div>
                <div className="col-span-2 text-center">Cantidad</div>
                <div className="col-span-2 text-right">Total</div>
              </div>

              {/* Cart Items */}
              {cartItems.map((item) => (
                <div key={`${item.id}-${item.color}-${item.size}`} className="grid grid-cols-12 gap-3 md:gap-4 py-4 border-b">
                  {/* Product Info */}
                  <div className="col-span-12 md:col-span-6 flex gap-4">
                    <div className="relative w-16 h-16 md:w-20 md:h-20 bg-gray-100 dark:bg-gray-800 rounded-md overflow-hidden flex-shrink-0">
                      {item.imageUrl && !failedThumb[item.id] ? (
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          fill
                          sizes="(max-width: 768px) 64px, 80px"
                          className="object-cover"
                          unoptimized
                          onError={() => setFailedThumb((prev) => ({ ...prev, [item.id]: true }))}
                        />
                      ) : (
                        <Image
                          src="/file.svg"
                          alt="Sin imagen"
                          fill
                          sizes="(max-width: 768px) 64px, 80px"
                          className="object-contain p-2"
                        />
                      )}
                    </div>
                    <div className="flex flex-col">
                      <Link href={`/products/${item.slug || item.id}`} className="font-medium hover:underline">
                        {item.name}
                      </Link>
                      {(item.color || item.size) && (
                        <div className="text-sm text-muted-foreground mt-1">
                          {item.color && <span className="mr-2">Color: {item.color}</span>}
                          {item.size && <span>Talla: {item.size}</span>}
                        </div>
                      )}
                      <button 
                        onClick={() => removeItem(item.id)} 
                        className="text-red-500 hover:text-red-700 text-sm flex items-center mt-2 md:hidden"
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Eliminar
                      </button>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="col-span-4 md:col-span-2 flex items-center md:justify-center">
                    <div className="md:hidden text-sm text-muted-foreground mr-2">Precio:</div>
                    <div>${formatCurrencyInt(item.price)}</div>
                  </div>

                  {/* Quantity */}
                  <div className="col-span-4 md:col-span-2 flex items-center md:justify-center">
                    <div className="md:hidden text-sm text-muted-foreground mr-2">Cant.:</div>
                    <div className="flex items-center border rounded-md">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-2 py-1 text-muted-foreground hover:text-foreground"
                        aria-label="Disminuir cantidad"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="px-2 py-1 text-center min-w-[2rem]">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-2 py-1 text-muted-foreground hover:text-foreground"
                        aria-label="Aumentar cantidad"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="col-span-4 md:col-span-2 flex items-center justify-end">
                    <div className="md:hidden text-sm text-muted-foreground mr-2">Total:</div>
                    <div className="font-medium">${formatCurrencyInt((+item.price) * item.quantity)}</div>
                    <button 
                      onClick={() => removeItem(item.id)} 
                      className="text-muted-foreground hover:text-red-500 ml-4 hidden md:block"
                      aria-label="Eliminar artículo"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}

              {/* Cart Actions */}
              <div className="flex justify-between items-center pt-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={clearCart}
                  className="text-sm"
                >
                  Vaciar Carrito
                </Button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 md:p-6 sticky top-24 shadow-sm">
                <h2 className="text-lg font-semibold mb-4">Resumen del Pedido</h2>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${formatCurrencyInt(getCartTotal())}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Envío</span>
                    <span>Calculado al finalizar la compra</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Impuestos</span>
                    <span>Calculado al finalizar la compra</span>
                  </div>
                </div>
                
                <div className="border-t pt-4 mb-6">
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>${formatCurrencyInt(getCartTotal())}</span>
                  </div>
                </div>
                
                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                >
                  {isCheckingOut ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                      Procesando...
                    </>
                  ) : (
                    "Proceder al Pago"
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="border-t py-6 bg-gray-100 dark:bg-gray-900 mt-12">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Deco House Cali. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}