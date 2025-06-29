'use client';

import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner"; // Assuming you use sonner for toasts

// Interfaz para categorías
interface Category {
  id: number;
  name: string;
}

export default function EditProductPage() { // Removed { params }: any
  const router = useRouter();
  const routeParams = useParams(); // Use standard hook
  const id = routeParams?.id;

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    sku: '',
    discount: '0',
    stock: '1',
    brand: '',
    manufacturer: '',
    supplier: '',
    categoryId: '',
    imageUrl: '', // Added imageUrl
    status: 'Active', // Added status
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [imagePreview, setImagePreview] = useState('');

  // Fetch categories when component mounts
  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch("http://localhost:3300/categories");
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to load categories.");
      } finally {
        setLoadingCategories(false);
      }
    }
    fetchCategories();
  }, []);

  // Fetch product data when ID is available
  useEffect(() => {
    async function fetchProduct() {
      if (!id) {
        setError('Product ID is missing.');
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:3300/products/${id}`);
        if (!response.ok) {
          if (response.status === 404) {
            setError('Product not found.');
          } else {
             throw new Error('Failed to fetch product');
          }
          return; // Stop execution if product not found or error occurred
        }
        const product = await response.json();
        setFormData({
          name: product.name || '',
          description: product.description || '',
          price: product.price?.toString() || '',
          sku: product.sku || '',
          discount: product.discount?.toString() || '0',
          stock: product.stock?.toString() || '1',
          brand: product.brand || '',
          manufacturer: product.manufacturer || '',
          supplier: product.supplier || '',
          categoryId: product.category?.id?.toString() || '', // Use category.id if available
          imageUrl: product.imageUrl || '', // Assuming imageUrl is a field
          status: product.status || 'Active', // Assuming status is a field
        });
        if (product.imageUrl) {
            setImagePreview(product.imageUrl);
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setError(err instanceof Error ? err.message : 'An error occurred while fetching product data.');
        toast.error("Failed to load product data.");
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [id]); // Re-fetch if ID changes

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === 'imageUrl') {
      setImagePreview(value);
    }
  };

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, categoryId: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    if (!formData.categoryId) {
      setError('Please select a category for this product');
      setSaving(false);
      toast.error('Category is required.');
      return;
    }

    const productData = {
      ...formData,
      price: parseFloat(formData.price) || 0,
      stock: parseInt(formData.stock, 10) || 0,
      discount: parseFloat(formData.discount) || 0,
      categoryId: parseInt(formData.categoryId, 10),
    };

    console.log(`Attempting to update product with ID: ${id}`, productData); // Log before fetch

    try {
      const response = await fetch(`http://localhost:3300/products/${id}`, {
        method: 'PATCH', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const errorBody = await response.text(); // Read body regardless of type for logging
        console.error(`Error response status: ${response.status}, body:`, errorBody);
        // Specific check for 404 during PATCH
        if (response.status === 404) {
             throw new Error(`Failed to update: Product with ID ${id} not found by the API.`);
        } else {
             // General error for other non-ok statuses
             throw new Error(`Failed to update product. API responded with status ${response.status}. Response: ${errorBody}`);
        }
      }

      const updatedProduct = await response.json();
      console.log('Updated product:', updatedProduct); 
      toast.success("Product updated successfully!");
      router.push('/admin/products'); 
    } catch (err) {
      // Log the caught error object itself for more details if available
      console.error('Caught error during product update:', err); 
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred during update.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="container mx-auto p-4">Loading product details...</div>;
  }

  // Render form only if not loading and no initial fetch error occurred that prevents rendering
  if (error && !formData.name) { // Show error prominently if fetch failed completely
      return <div className="container mx-auto p-4 max-w-6xl bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="mb-6 flex items-center">
        {/* Updated Link */}
        <Link href="/admin/products" className="text-sm text-gray-500 hover:text-gray-700 flex items-center">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Products
        </Link>
        <h1 className="text-xl font-semibold ml-4">Edit Product: {formData.name || `ID: ${id}`}</h1>
      </div>

      {/* Display non-blocking errors (like validation errors) */}
      {error && formData.name && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column - Product Information */}
          <Card className="p-6 shadow-sm">
            <h2 className="text-lg font-medium mb-4">Product Information</h2>
            <div className="space-y-4">
              {/* Name */}
              <div>
                <Label htmlFor="name">Product Name</Label>
                <Input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className="mt-1" />
              </div>
              {/* Description */}
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={4} className="mt-1" />
              </div>
              {/* Category */}
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={formData.categoryId} onValueChange={handleCategoryChange} disabled={loadingCategories}>
                  <SelectTrigger id="category" className="mt-1">
                    <SelectValue placeholder={loadingCategories ? "Loading..." : "Select a category"} />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {/* Price */}
              <div>
                <Label htmlFor="price">Price ($)</Label>
                <Input type="number" id="price" name="price" value={formData.price} onChange={handleChange} step="0.01" min="0" required className="mt-1" />
              </div>
              {/* Stock */}
              <div>
                <Label htmlFor="stock">Stock Quantity</Label>
                <Input type="number" id="stock" name="stock" value={formData.stock} onChange={handleChange} min="0" className="mt-1" />
              </div>
              {/* Status */}
              <div>
                <Label htmlFor="status">Status</Label>
                <select id="status" name="status" value={formData.status} onChange={handleChange} className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Draft">Draft</option>
                </select>
              </div>
              {/* Discount */}
              <div>
                <Label htmlFor="discount">Discount</Label>
                <Input type="number" id="discount" name="discount" value={formData.discount} onChange={handleChange} step="0.01" min="0" className="mt-1" />
              </div>
              {/* SKU */}
              <div className="grid grid-cols-1 gap-4"> {/* Changed grid-cols-2 to 1 as only SKU is here now */}
                <div>
                  <Label htmlFor="sku">SKU</Label>
                  <Input type="text" id="sku" name="sku" value={formData.sku} onChange={handleChange} className="mt-1" />
                </div>
              </div>
            </div>
          </Card>

          {/* Right Column - Additional Information */}
          <Card className="p-6 shadow-sm">
            <h2 className="text-lg font-medium mb-4">Additional Information</h2>
            <div className="space-y-4">
              {/* Image URL */}
              <div>
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input type="text" id="imageUrl" name="imageUrl" value={formData.imageUrl} onChange={handleChange} className="mt-1" />
              </div>
              {/* Image Preview */}
              {imagePreview && (
                <div className="mt-2">
                  <Label>Image Preview</Label>
                  <div className="mt-1 border rounded-md overflow-hidden h-48 flex items-center justify-center bg-gray-50">
                    <img src={imagePreview} alt="Product preview" className="max-h-full max-w-full object-contain" onError={(e) => { e.currentTarget.src = "https://via.placeholder.com/300x300?text=No+Image"; }} />
                  </div>
                </div>
              )}
              {/* Brand */}
              <div>
                <Label htmlFor="brand">Brand</Label>
                <Input type="text" id="brand" name="brand" value={formData.brand} onChange={handleChange} className="mt-1" />
              </div>
              {/* Manufacturer */}
              <div>
                <Label htmlFor="manufacturer">Manufacturer</Label>
                <Input type="text" id="manufacturer" name="manufacturer" value={formData.manufacturer} onChange={handleChange} className="mt-1" />
              </div>
              {/* Supplier */}
              <div>
                <Label htmlFor="supplier">Supplier</Label>
                <Input type="text" id="supplier" name="supplier" value={formData.supplier} onChange={handleChange} className="mt-1" />
              </div>
            </div>
          </Card>
        </div>

        <div className="mt-6 flex justify-end space-x-4">
          {/* Updated Link */}
          <Link href="/admin/products">
            <Button type="button" variant="outline" disabled={saving}>
              Cancel
            </Button>
          </Link>
          <Button type="submit" disabled={saving || loading}>
            {saving ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}