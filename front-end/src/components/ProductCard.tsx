"use client"

import type React from "react"
import Link from "next/link"
import { toast } from "sonner"
import { ShoppingBag, HeartIcon } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

// Tipado del producto de acuerdo al uso en Home
type Product = {
  id: string
  name: string
  price: number
  imageUrl?: string
  slug?: string
  originalPrice?: number
  discountPercentage?: number
  images?: { url: string }[]
}

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const hasDiscount = !!product.originalPrice && product.originalPrice > product.price
  const discountValue = product.discountPercentage ?? (hasDiscount && product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0)

  return (
    <Link 
      href={`/products/${product.slug || product.id}`} 
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
            onClick={(e) => { e.preventDefault(); toast.info("Añadido a la lista de deseos (placeholder)"); }}
          >
            <HeartIcon className="h-4 w-4 text-gray-600 dark:text-gray-300" />
          </Button>
          
          {/* Product image */}
          <div className="aspect-square w-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden">
            {(() => {
              const candidate = product.imageUrl ?? product.images?.[0]?.url
              const resolved = (() => {
                if (!candidate) return undefined
                if (/^https?:\/\//i.test(candidate)) return candidate
                const base = process.env.NEXT_PUBLIC_API_URL
                if (!base) return candidate
                const sanitizedBase = base.replace(/\/+$/, '')
                const sanitizedPath = candidate.replace(/^\/+/, '')
                return `${sanitizedBase}/${sanitizedPath}`
              })()
              return resolved ? (
                <img
                  src={resolved}
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).src = "https://via.placeholder.com/300x300?text=No+Image"; }}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-gray-300 dark:text-gray-600">
                  <ShoppingBag className="h-12 w-12" /> {/* Placeholder Icon */}
                </div>
              )
            })()}
          </div>
        </div>
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-200 truncate mb-1">
            {product.name}
          </h3>
          <div className="flex items-baseline mt-auto">
            {hasDiscount && product.originalPrice ? (
              <>
                <p className="text-gray-900 font-bold text-lg">${Math.round(Number(product.price)).toLocaleString('es-CO')}</p>
                <p className="text-sm text-muted-foreground line-through ml-2">${Math.round(Number(product.originalPrice)).toLocaleString('es-CO')}</p>
              </>
            ) : (
              <p className="text-gray-900 font-bold text-lg">${Math.round(Number(product.price)).toLocaleString('es-CO')}</p>
            )}
          </div>
        </div>
      </Card>
    </Link>
  )
}
