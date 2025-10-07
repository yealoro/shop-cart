"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { Plus, Edit, Trash2, AlertTriangle, Check, X, ShoppingBag } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"


interface Product {
  id: number
  name: string
  description: string
  price: number
  imageUrl?: string
  images?: { url: string }[]
  hasSales?: boolean
  active?: boolean
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null)
  const [deleteMessage, setDeleteMessage] = useState("")
  const [deleteStatus, setDeleteStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [searchQuery, setSearchQuery] = useState("")
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([])
  const [selectedCategory, setSelectedCategory] = useState<number | "all">("all")
  const [onlyActive, setOnlyActive] = useState<boolean>(false)
  const [onlyWithSales, setOnlyWithSales] = useState<boolean>(false)
  // front-end like filters
  const [minPrice, setMinPrice] = useState<string>("")
  const [maxPrice, setMaxPrice] = useState<string>("")
  const [sortBy, setSortBy] = useState<"none" | "price-asc" | "price-desc" | "name-asc" | "name-desc">("none")
  const [currentPage, setCurrentPage] = useState<number>(1)
  const itemsPerPage = 12
  
  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`)
        if (!response.ok) {
          throw new Error("Failed to fetch products")
        }
        const data = await response.json()
        setProducts(data)
      } catch (error) {
        console.error("Error fetching products:", error)
        toast.error("Failed to load products. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const handleDeleteClick = (productId: number) => {
    // Find the product to check if it has sales
    const product = products.find((p) => p.id === productId)
    if (product?.hasSales) {
      setDeleteMessage("This product has sales and can only be deactivated, not deleted.")
    } else {
      setDeleteMessage("Are you sure you want to delete this product? This action cannot be undone.")
    }
    setConfirmDelete(productId)
  }

  const handleConfirmDelete = async () => {
    if (!confirmDelete) return

    setDeleteStatus("loading")
    const product = products.find((p) => p.id === confirmDelete)

    try {
      if (product?.hasSales) {
        // Deactivate product
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${confirmDelete}/deactivate`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ active: false }),
        })

        if (!response.ok) throw new Error("Failed to deactivate product")

        // Update local state
        setProducts(products.map((p) => (p.id === confirmDelete ? { ...p, active: false } : p)))

        toast.success("Product successfully deactivated.")
      } else {
        // Delete product
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${confirmDelete}`, {
          method: "DELETE",
        })

        if (!response.ok) throw new Error("Failed to delete product")

        // Remove from local state
        setProducts(products.filter((p) => p.id !== confirmDelete))

        toast.success("Product successfully deleted.")
      }

      setDeleteStatus("success")
      // Close the dialog after a short delay
      setTimeout(() => {
        setConfirmDelete(null)
        setDeleteStatus("idle")
        setDeleteMessage("")
      }, 1000)
    } catch (error) {
      console.error("Error deleting/deactivating product:", error)
      setDeleteStatus("error")
      setDeleteMessage("An error occurred. Please try again.")
      toast.error("Failed to process your request. Please try again.")
    }
  }

  const handleCancelDelete = () => {
    setConfirmDelete(null)
    setDeleteMessage("")
    setDeleteStatus("idle")
  }

  const processedProducts = useMemo(() => {
    let list = products.filter(
      (product) =>
        (product.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.description || "").toLowerCase().includes(searchQuery.toLowerCase()),
    )

    const min = minPrice !== "" ? Number(minPrice) : undefined
    const max = maxPrice !== "" ? Number(maxPrice) : undefined
    if (!Number.isNaN(min) && min !== undefined) {
      list = list.filter((p) => Number(p.price ?? 0) >= min)
    }
    if (!Number.isNaN(max) && max !== undefined) {
      list = list.filter((p) => Number(p.price ?? 0) <= max)
    }

    switch (sortBy) {
      case "price-asc":
        list = list.slice().sort((a, b) => Number(a.price ?? 0) - Number(b.price ?? 0))
        break
      case "price-desc":
        list = list.slice().sort((a, b) => Number(b.price ?? 0) - Number(a.price ?? 0))
        break
      case "name-asc":
        list = list.slice().sort((a, b) => (a.name || "").localeCompare(b.name || "", undefined, { sensitivity: "base" }))
        break
      case "name-desc":
        list = list.slice().sort((a, b) => (b.name || "").localeCompare(a.name || "", undefined, { sensitivity: "base" }))
        break
      case "none":
      default:
        break
    }

    return list
  }, [products, searchQuery, minPrice, maxPrice, sortBy])

  const totalPages = Math.max(1, Math.ceil(processedProducts.length / itemsPerPage))
  const pagedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return processedProducts.slice(start, start + itemsPerPage)
  }, [processedProducts, currentPage])

  const getStatusBadge = (product: Product) => {
    if (product.active === false) {
      return (
        <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
          Inactive
        </Badge>
      )
    }
    if (product.hasSales) {
      return (
        <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
          Has Sales
        </Badge>
      )
    }
    return (
      <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
        Active
      </Badge>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="flex h-16 items-center px-6">
          <h1 className="text-2xl font-semibold">Productos</h1>
          <div className="ml-auto flex items-center gap-4">
            <Link href="/products/create" passHref>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Agrega un nuevo producto
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 p-6">
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
              setSortBy(value as "none" | "price-asc" | "price-desc" | "name-asc" | "name-desc");
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
        ) : processedProducts.length === 0 ? (          <div className="flex h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
            <h3 className="mt-4 text-lg font-semibold">No products found</h3>
            <p className="mb-4 mt-2 text-sm text-muted-foreground">
              {searchQuery ? "Try a different search term or" : "Get started by"} adding a new product.
            </p>
            <Link href="/products/create" passHref>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Agrega un nuevo producto
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {pagedProducts.map((product) => (              <Card
                key={product.id}
                className={`group overflow-hidden transition-opacity ${product.active === false ? "opacity-60" : ""}`}
              >
                <div className="relative aspect-square w-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden">
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
                        <ShoppingBag className="h-12 w-12" />
                      </div>
                    )
                  })()}
                
                </div>
                <CardContent className="p-3">
                  <div className="flex items-start justify-between">
                    <p className="font-semibold text-sm">{product.name}</p>
                    <div className="scale-90 origin-right">
                      {getStatusBadge(product)}
                    </div>
                  </div>
                  <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">{product.description}</p>
                  <p className="mt-1 text-sm font-bold">
                    ${(() => {
                      try {
                        const intPrice = Math.round(typeof product.price === 'number' ? product.price : Number(product.price))
                        return intPrice.toLocaleString('es-CO')
                      } catch (e) {
                        console.error(`Error formatting price for product ${product.id}:`, e);
                        const fallback = Math.round(Number(product.price) || 0)
                        return fallback.toLocaleString('es-CO')
                      }
                    })()}
                  </p>
                </CardContent>
                <CardFooter className="flex justify-between border-t p-1">
                  <Link href={`/products/edit/${product.id}`} passHref>
                    <Button variant="outline" size="sm" className="h-7 text-xs px-2">
                      <Edit className="mr-1 h-3 w-3" />
                      Edit
                    </Button>
                  </Link>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-3 w-3"
                        >
                          <circle cx="12" cy="12" r="1" />
                          <circle cx="12" cy="5" r="1" />
                          <circle cx="12" cy="19" r="1" />
                        </svg>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Duplicate</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => handleDeleteClick(product.id)}
                      >
                        {product.hasSales ? "Deactivate" : "Delete"}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {processedProducts.length > 0 && (
          <div className="mt-6">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); setCurrentPage((p) => Math.max(1, p - 1)) }} />
                </PaginationItem>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink href="#" isActive={currentPage === i + 1} onClick={(e) => { e.preventDefault(); setCurrentPage(i + 1) }}>
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext href="#" onClick={(e) => { e.preventDefault(); setCurrentPage((p) => Math.min(totalPages, p + 1)) }} />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </main>

      {/* Delete/Deactivate Confirmation Dialog */}
      <Dialog open={confirmDelete !== null} onOpenChange={(open) => !open && handleCancelDelete()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {products.find((p) => p.id === confirmDelete)?.hasSales ? "Deactivate Product" : "Delete Product"}
            </DialogTitle>
            <DialogDescription>{deleteMessage}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancelDelete} disabled={deleteStatus === "loading"}>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button
              variant={products.find((p) => p.id === confirmDelete)?.hasSales ? "default" : "destructive"}
              onClick={handleConfirmDelete}
              disabled={deleteStatus === "loading"}
            >
              {deleteStatus === "loading" ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                  Procesando...
                </>
              ) : products.find((p) => p.id === confirmDelete)?.hasSales ? (
                <>
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Desactivar
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Eliminar
                </>
              )}
            </Button>
          </DialogFooter>
          {deleteStatus === "success" && (
            <div className="mt-2 rounded-md bg-green-50 p-3 text-green-800 dark:bg-green-900/50 dark:text-green-300">
              <div className="flex items-center">
                <Check className="mr-2 h-4 w-4" />
                <p>
                  {products.find((p) => p.id === confirmDelete)?.hasSales
                    ? "Producto desactivado exitosamente."
                    : "Producto eliminado exitosamente."}
                </p>
              </div>
            </div>
          )}
          {deleteStatus === "error" && (
            <div className="mt-2 rounded-md bg-red-50 p-3 text-red-800 dark:bg-red-900/50 dark:text-red-300">
              <div className="flex items-center">
                <AlertTriangle className="mr-2 h-4 w-4" />
                <p>Ocurrió un error. Por favor, inténtalo de nuevo.</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}