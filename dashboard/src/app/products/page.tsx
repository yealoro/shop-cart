"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Plus, Edit, Trash2, AlertTriangle, Check, X } from "lucide-react"
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

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

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
          <h1 className="text-xl font-semibold">Products</h1>
          <div className="ml-auto flex items-center gap-4">
            <Link href="/products/create" passHref>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add New Product
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
              {searchQuery ? "Try a different search term or" : "Get started by"} adding a new product.
            </p>
            <Link href="/products/create" passHref>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add New Product
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {filteredProducts.map((product) => (
              <Card
                key={product.id}
                className={`overflow-hidden transition-opacity ${product.active === false ? "opacity-60" : ""}`}
              >
                <div className="aspect-square w-full h-32 bg-gray-100 dark:bg-gray-800">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gray-100 dark:bg-gray-800">
                      <div className="text-center">
                        <div className="text-3xl text-gray-400">📷</div>
                        <p className="mt-1 text-xs text-gray-500">{product.name}</p>
                      </div>
                    </div>
                  )}
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
        {filteredProducts.length > 0 && (
          <div className="mt-6">
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
                  Processing...
                </>
              ) : products.find((p) => p.id === confirmDelete)?.hasSales ? (
                <>
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Deactivate
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
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
                    ? "Product deactivated successfully."
                    : "Product deleted successfully."}
                </p>
              </div>
            </div>
          )}
          {deleteStatus === "error" && (
            <div className="mt-2 rounded-md bg-red-50 p-3 text-red-800 dark:bg-red-900/50 dark:text-red-300">
              <div className="flex items-center">
                <AlertTriangle className="mr-2 h-4 w-4" />
                <p>An error occurred. Please try again.</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}