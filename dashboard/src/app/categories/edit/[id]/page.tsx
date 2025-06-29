"use client"

import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox"; // Assuming you might want a 'featured' checkbox
import { toast } from "sonner";

// Define the structure for category data
interface CategoryFormData {
  name: string;
  description: string;
  imageUrl: string;
  featured: boolean;
  // Add other fields like parentCategoryId if needed
}

export default function EditCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string; // Get category ID from URL

  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    description: '',
    imageUrl: '',
    featured: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Fetch category data when ID is available
  useEffect(() => {
    async function fetchCategory() {
      if (!id) {
        setError('Category ID is missing.');
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError('');
        const response = await fetch(`http://localhost:3300/categories/${id}`);
        if (!response.ok) {
          if (response.status === 404) {
            setError('Category not found.');
            toast.error('Category not found.');
          } else {
            throw new Error('Failed to fetch category data');
          }
          return; // Stop if category not found or other error
        }
        const category = await response.json();
        setFormData({
          name: category.name || '',
          description: category.description || '',
          imageUrl: category.imageUrl || '',
          featured: category.featured || false,
          // Set other fields from 'category' object if needed
        });
        if (category.imageUrl) {
          setImagePreview(category.imageUrl);
        }
      } catch (err) {
        console.error("Error fetching category:", err);
        const message = err instanceof Error ? err.message : 'An error occurred.';
        setError(`Failed to load category data: ${message}`);
        toast.error(`Failed to load category data: ${message}`);
      } finally {
        setLoading(false);
      }
    }

    fetchCategory();
  }, [id]); // Re-fetch if ID changes

  // Handle changes in form inputs
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // Update image preview if imageUrl changes
    if (name === 'imageUrl') {
      setImagePreview(value);
    }
  };

  // Handle form submission to update the category
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    console.log(`Attempting to update category with ID: ${id}`, formData);

    try {
      const response = await fetch(`http://localhost:3300/categories/${id}`, {
        method: 'PUT', // Changed from 'PATCH' to 'PUT' to match backend controller
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData), // Send the updated form data
      });

      if (!response.ok) {
        const errorBody = await response.text();
        console.error(`Error response status: ${response.status}, body:`, errorBody);
        if (response.status === 404) {
          // Specific error if backend returns 404 during update
          throw new Error(`Failed to update: Category with ID ${id} not found by the API.`);
        } else {
          // General error for other non-ok statuses
          throw new Error(`Failed to update category. API responded with status ${response.status}. Response: ${errorBody}`);
        }
      }

      const updatedCategory = await response.json();
      console.log('Updated category:', updatedCategory);
      toast.success("Category updated successfully!");
      router.push('/admin/categories'); // Navigate back to the categories list
    } catch (err) {
      console.error('Caught error during category update:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred during update.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  // --- Render Logic ---

  if (loading) {
    return <div className="container mx-auto p-4">Loading category details...</div>;
  }

  // Show error prominently if fetch failed completely (e.g., category not found initially)
  if (error && !formData.name && !loading) {
      return (
          <div className="container mx-auto p-4 max-w-4xl">
              <div className="mb-4">
                  <Link href="/admin/categories" className="text-sm text-gray-500 hover:text-gray-700 flex items-center">
                      <ArrowLeft className="h-4 w-4 mr-1" />
                      Back to Categories
                  </Link>
              </div>
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>
          </div>
      );
  }

  // Render the edit form
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="mb-6 flex items-center">
        <Link href="/admin/categories" className="text-sm text-gray-500 hover:text-gray-700 flex items-center">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Categories
        </Link>
        <h1 className="text-xl font-semibold ml-4">Edit Category: {formData.name || `ID: ${id}`}</h1>
      </div>

      {/* Display non-blocking errors (like validation errors during save) */}
      {error && formData.name && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      <form onSubmit={handleSubmit}>
        <Card className="p-6 shadow-sm">
          <div className="space-y-4">
            {/* Name */}
            <div>
              <Label htmlFor="name">Category Name</Label>
              <Input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className="mt-1" />
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={4} className="mt-1" />
            </div>

            {/* Image URL */}
            <div>
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input type="url" id="imageUrl" name="imageUrl" value={formData.imageUrl} onChange={handleChange} className="mt-1" />
              {imagePreview && (
                <div className="mt-2">
                  <img src={imagePreview} alt="Preview" className="h-20 w-20 object-cover rounded border" />
                </div>
              )}
            </div>

            {/* Featured Checkbox */}
            <div className="flex items-center space-x-2">
              <Checkbox id="featured" name="featured" checked={formData.featured} onCheckedChange={(checked) => setFormData(prev => ({...prev, featured: Boolean(checked)}))} />
              <Label htmlFor="featured" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Featured Category
              </Label>
            </div>
            {/* Add other fields like Parent Category dropdown if needed */}
          </div>
          {/* Form Actions */}
          <div className="mt-6 flex justify-end gap-3">
            <Link href="/admin/categories" passHref>
               <Button type="button" variant="outline" disabled={saving}>Cancel</Button>
            </Link>
            <Button type="submit" disabled={saving}>
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
        </Card>
      </form>
    </div>
  );
}