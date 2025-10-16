"use client";

import Link from "next/link";
import { useEffect } from "react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";

export default function CheckoutSuccessPage() {
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      <main className="flex-1 container mx-auto px-4 py-16 text-center">
        <div className="mx-auto max-w-md">
          <div className="mb-6 h-16 w-16 mx-auto rounded-full border-4 border-green-500 flex items-center justify-center">
            <div className="h-8 w-8 rounded-full bg-green-500"></div>
          </div>
          <h1 className="text-2xl font-bold mb-2">¡Pedido realizado con éxito!</h1>
          <p className="text-muted-foreground mb-6">Gracias por tu compra. Te enviaremos la confirmación y detalles del envío a tu correo.</p>
          <div className="flex gap-3 justify-center">
            <Link href="/">
              <Button>Volver a la Tienda</Button>
            </Link>
            <Link href="/orders">
              <Button variant="outline">Ver pedidos</Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}