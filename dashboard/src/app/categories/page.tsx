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

interface Category {
  id: number
  name: string
  description?: string
  imageUrl?: string
  parentCategoryId?: number
  featured: boolean
  products?: any[]
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null)
  const [deleteMessage, setDeleteMessage] = useState("")
  const [deleteStatus, setDeleteStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [searchQuery, setSearchQuery] = useState("")
  
  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`)
        if (!response.ok) {
          throw new Error("Failed to fetch categories")
        }
        const data = await response.json()
        setCategories(data)
      } catch (error) {
        console.error("Error fetching categories:", error)
        toast.error("Failed to load categories. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  const handleDeleteClick = (categoryId: number) => {
    // Find the category to check if it has products
    const category = categories.find((c) => c.id === categoryId)
    if (category?.products && category.products.length > 0) {
      setDeleteMessage("This category has associated products and cannot be deleted.")
    } else {
      setDeleteMessage("Are you sure you want to delete this category? This action cannot be undone.")
    }
    setConfirmDelete(categoryId)
  }

  const handleConfirmDelete = async () => {
    if (!confirmDelete) return

    setDeleteStatus("loading")
    const category = categories.find((c) => c.id === confirmDelete)

    try {
      if (category?.products && category.products.length > 0) {
        // Cannot delete category with products
        toast.error("Cannot delete a category with associated products.")
        setDeleteStatus("error")
        setDeleteMessage("This category has associated products and cannot be deleted.")
      } else {
        // Delete category
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/${confirmDelete}`, {
          method: "DELETE",
        })

        if (!response.ok) throw new Error("Failed to delete category")

        // Remove from local state
        setCategories(categories.filter((c) => c.id !== confirmDelete))

        toast.success("Category successfully deleted.")
        setDeleteStatus("success")
        
        // Close the dialog after a short delay
        setTimeout(() => {
          setConfirmDelete(null)
          setDeleteStatus("idle")
          setDeleteMessage("")
        }, 1000)
      }
    } catch (error) {
      console.error("Error deleting category:", error)
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

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (category.description && category.description.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const getStatusBadge = (category: Category) => {
    if (category.featured) {
      return (
        <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
          Featured
        </Badge>
      )
    }
    if (category.parentCategoryId) {
      return (
        <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
          Subcategory
        </Badge>
      )
    }
    return (
      <Badge variant="outline" className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300">
        Main Category
      </Badge>
    )
  }
  // Al inicio del componente CategoriesPage
const categoryToDelete = categories.find((c) => c.id === confirmDelete);
const hasProducts = (categoryToDelete?.products?.length ?? 0) > 0;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="flex h-16 items-center px-6">
          <h1 className="text-2xl font-semibold">Categorías</h1>
          <div className="ml-auto flex items-center gap-4">
            <Link href="/categories/create" passHref>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Agrega una nueva categoría
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
              placeholder="Search categories..."
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
              <p className="text-muted-foreground">Cargando categorías...</p>
            </div>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="flex h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
            <h3 className="mt-4 text-lg font-semibold">No categories found</h3>
            <p className="mb-4 mt-2 text-sm text-muted-foreground">
              {searchQuery ? "Try a different search term or" : "Get started by"} adding a new category.
            </p>
            <Link href="/categories/create" passHref>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add New Category
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {filteredCategories.map((category) => (
              <Card
                key={category.id}
                className="overflow-hidden transition-opacity"
              >
                <div className="aspect-square w-full h-32 bg-gray-100 dark:bg-gray-800">
                  {category.imageUrl ? (
                    <img
                      src={category.imageUrl}
                      alt={category.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gray-100 dark:bg-gray-800">
                      <div className="text-center">
                        <div className="text-3xl text-gray-400">🏷️</div>
                        <p className="mt-1 text-xs text-gray-500">{category.name}</p>
                      </div>
                    </div>
                  )}
                </div>
                <CardContent className="p-3">
                  <div className="flex items-start justify-between">
                    <h2 className="font-semibold text-sm">{category.name}</h2>
                    <div className="scale-90 origin-right">
                      {getStatusBadge(category)}
                    </div>
                  </div>
                  <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">{category.description || "No description available"}</p>
                  {category.products && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      {category.products.length} {category.products.length === 1 ? "product" : "products"}
                    </p>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between border-t p-1">
                  <Link href={`/categories/edit/${category.id}`} passHref>
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
                      <DropdownMenuItem>View Products</DropdownMenuItem>
                      <DropdownMenuItem>Create Subcategory</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => handleDeleteClick(category.id)}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {filteredCategories.length > 0 && (
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={confirmDelete !== null} onOpenChange={(open) => !open && handleCancelDelete()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar Categoría</DialogTitle>
            <DialogDescription>{deleteMessage}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancelDelete} disabled={deleteStatus === "loading"}>
              <X className="mr-2 h-4 w-4" />
              Cancelar
            </Button>
            <Button
            variant="destructive"
            onClick={handleConfirmDelete}
            disabled={deleteStatus === "loading" || hasProducts}
            >
            {deleteStatus === "loading" ? (
                <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                Procesando...
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
                <p>Categoría eliminada exitosamente.</p>
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