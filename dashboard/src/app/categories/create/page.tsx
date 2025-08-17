'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateCategoryPage() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    imageUrl: '',
    parentCategoryId: '',
    featured: false,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [parentCategories, setParentCategories] = useState<{id: number, name: string}[]>([]);

  useEffect(() => {
    async function fetchParentCategories() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`);
        if (!response.ok) {
          throw new Error('Failed to fetch parent categories');
        }
        const categories = await response.json();
        setParentCategories(categories);
      } catch (err) {
        console.error('Error fetching parent categories:', err);
      }
    }

    fetchParentCategories();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          parentCategoryId: formData.parentCategoryId ? parseInt(formData.parentCategoryId) : null,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create category');
      }

      router.push('/categories');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-2xl border-2 rounded-xl m-16">
      <h1 className="text-2xl font-bold mb-6">Create New Category</h1>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Category Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
            Image URL
          </label>
          <input
            type="text"
            id="imageUrl"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label htmlFor="parentCategoryId" className="block text-sm font-medium text-gray-700 mb-1">
            Parent Category
          </label>
          <select
            id="parentCategoryId"
            name="parentCategoryId"
            value={formData.parentCategoryId}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">None (Main Category)</option>
            {parentCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="featured"
            name="featured"
            checked={formData.featured}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
          />
          <label htmlFor="featured" className="ml-2 block text-sm text-gray-700">
            Featured Category
          </label>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={saving}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
          >
            {saving ? 'Creating...' : 'Create Category'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/categories')}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}