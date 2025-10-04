'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, GripVertical } from "lucide-react";
import Link from "next/link";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Interfaz para categorías
interface Category {
  id: number;
  name: string;
}

// NEW: Interface for uploader image items
interface ImageItem {
  id?: number;
  url: string;
  altText?: string;
  order: number;
  file?: File;
  isNew?: boolean;
}

export default function CreateProductPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '0',
    imageUrl: '',
    status: 'Active',
    sku: '',
    discount: '0',
    brand: '',
    manufacturer: '',
    supplier: '',
    categoryId: '', // Añadido campo para la categoría
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  // NEW: multi-images state
  const [images, setImages] = useState<ImageItem[]>([]);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [isDraggingFiles, setIsDraggingFiles] = useState(false);
  const [isAdditionalOpen, setIsAdditionalOpen] = useState(false);

  const toggleAdditionalOpen = () => setIsAdditionalOpen((prev) => !prev);

  // Cargar categorías al montar el componente
  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`);
        if (!response.ok) {
          throw new Error("No se pudo obtener las categorías");
        }
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error al obtener categorías:", error);
      } finally {
        setLoadingCategories(false);
      }
    }

    fetchCategories();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Update image preview when imageUrl changes
    if (name === 'imageUrl' && value) {
      setImagePreview(value);
    }
  };

  // Manejador específico para el cambio de categoría
  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, categoryId: value }));
  };

  // Helper: añadir archivos a la galería manteniendo el orden
  const appendFiles = (files: FileList) => {
    const startOrder = images.length;
    const newItems: ImageItem[] = Array.from(files).map((file, idx) => ({
      url: URL.createObjectURL(file),
      altText: '',
      order: startOrder + idx,
      file,
      isNew: true,
    }));
    setImages(prev => [...prev, ...newItems]);
  };

  // NEW: handle multiple file selection
  const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    appendFiles(files);
    e.target.value = '';
  };

  // NEW: delete image from list
  const handleDeleteImage = (index: number) => {
    setImages(prev => {
      const list = [...prev];
      list.splice(index, 1);
      return list.map((item, i) => ({ ...item, order: i }));
    });
  };

  // NEW: drag & drop reordering
  const onDragStart = (index: number) => setDragIndex(index);
  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); };
  const onDrop = (index: number) => {

  // NEW: drag & drop de archivos en la zona de subida
  const onFilesDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingFiles(true);
  };
  const onFilesDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingFiles(true);
  };
  const onFilesDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingFiles(false);
  };
  const handleFilesDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingFiles(false);
    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;
    appendFiles(files);
  };
    if (dragIndex === null) return;
    setImages(prev => {
      const list = [...prev];
      const [moved] = list.splice(dragIndex, 1);
      list.splice(index, 0, moved);
      return list.map((item, i) => ({ ...item, order: i }));
    });
    setDragIndex(null);
  };

  // Helper: read file to data URL for backend
  const fileToDataUrl = (file: File) => new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validar que se haya seleccionado una categoría
    if (!formData.categoryId) {
      setError('Por favor, selecciona una categoría para este producto');
      setLoading(false);
      return;
    }

    // Crear objeto con los datos a enviar
    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock, 10),
      discount: parseFloat(formData.discount),
      categoryId: parseInt(formData.categoryId, 10), // Convertir a número
    };

    console.log('Sending product data:', productData); // Log para depuración

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Respuesta de error:', errorText);
        throw new Error(`No se pudo crear el producto: ${errorText}`);
      }

      const createdProduct = await response.json();
      console.log('Created product:', createdProduct); // Log para verificar la respuesta

      // NEW: Upload selected images linked to the created product
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL as string;
        for (const item of images) {
          if (item.isNew && item.file) {
            const dataUrl = await fileToDataUrl(item.file);
            await fetch(`${API_URL}/images`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ url: dataUrl, altText: item.altText || '', order: item.order, product: { id: createdProduct.id } }),
            });
          }
        }
      } catch (imgErr) {
        console.warn('Algunas imágenes no se pudieron subir:', imgErr);
      }

      router.push('/admin/products');
    } catch (err) {
      console.error('Detalles del error:', err);
      setError(err instanceof Error ? err.message : 'Ocurrió un error');
    } finally {
      setLoading(false);
    }
  };

  // Resto del componente con el formulario...
  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="mb-6 flex items-center">
        <Link href="/admin/products" className="text-sm text-gray-500 hover:text-gray-700 flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver a Productos
        </Link>
        <h1 className="text-xl font-semibold ml-4">Crear Nuevo Producto</h1>
      </div>

      {error && (
  <div
    className="mb-4 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-red-800"
    role="alert"
    aria-live="polite"
  >
    {error}
  </div>
)}

      <form onSubmit={handleSubmit}>
        <fieldset disabled={loading} className="contents">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Left Column - Product Information */}
          <Card className="p-6 bg-white/80 backdrop-blur-sm border rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-lg font-semibold mb-4">Información del Producto</h2>
            
            <div className="space-y-5">
              <div>
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">Nombre del producto</Label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="mt-1 h-10 rounded-lg border-gray-300 focus-visible:ring-2 focus-visible:ring-blue-500"
                />
              </div>

              <div>
                <Label htmlFor="description" className="text-sm font-medium text-gray-700">Descripción</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="mt-1 rounded-lg border-gray-300 focus-visible:ring-2 focus-visible:ring-blue-500"
                />
              </div>

              {/* Selector de categoría */}
              <div>
                <Label htmlFor="category">Categoría</Label>
                <Select 
                  value={formData.categoryId} 
                  onValueChange={handleCategoryChange}
                  disabled={loadingCategories}
                >
                  <SelectTrigger id="category" className="mt-1">
                    <SelectValue placeholder={loadingCategories ? "Cargando categorías..." : "Selecciona una categoría"} />
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

              <div>
                <Label htmlFor="price">Precio ($)</Label>
                <Input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="stock">Cantidad en stock</Label>
                <Input
                  type="number"
                  id="stock"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  min="0"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="status">Estado</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
                  <SelectTrigger id="status" className="mt-1">
                    <SelectValue placeholder="Selecciona estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Activo</SelectItem>
                    <SelectItem value="Inactive">Inactivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="discount">Descuento</Label>
                <Input
                  type="number"
                  id="discount"
                  name="discount"
                  value={formData.discount}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sku">SKU</Label>
                  <Input
                    type="text"
                    id="sku"
                    name="sku"
                    value={formData.sku}
                    onChange={handleChange}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Right Column - Additional Information */}
          <div>
            <Button
              type="button"
              onClick={toggleAdditionalOpen}
              aria-expanded={isAdditionalOpen}
              aria-controls="additional-info"
              className="w-full mb-4 justify-between"
              variant="outline"
            >
              <span>Información adicional</span>
              <svg
                className={`w-4 h-4 transition-transform ${isAdditionalOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </Button>
            <div
              id="additional-info"
              className={`transition-all duration-300 ease-in-out overflow-hidden ${isAdditionalOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}
            >
              <Card className="p-6 shadow-sm">
                <h2 className="text-lg font-medium mb-4">Información adicional</h2>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="imageUrl">URL de la imagen</Label>
                <Input
                  type="text"
                  id="imageUrl"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>

              {imagePreview && (
                <div className="mt-2">
                  <Label>Vista previa de la imagen</Label>
                  <div className="mt-1 border rounded-md overflow-hidden h-48 flex items-center justify-center bg-gray-50">
                    <img
                      src={imagePreview}
                      alt="Vista previa del producto"
                      className="h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "https://via.placeholder.com/300x300?text=Error+de+imagen";
                      }}
                    />
                  </div>
                </div>
              )}

              <div>
                <Label htmlFor="brand">Marca</Label>
                <Input
                  type="text"
                  id="brand"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="manufacturer">Fabricante</Label>
                <Input
                  type="text"
                  id="manufacturer"
                  name="manufacturer"
                  value={formData.manufacturer}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="supplier">Proveedor</Label>
                <Input
                  type="text"
                  id="supplier"
                  name="supplier"
                  value={formData.supplier}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>
            </div>
          </Card>
        </div>

        {/* NEW: Product Images section with multiple file input and reordering */}
        <div className="mt-8">
          <Card className="p-6 bg-white/80 backdrop-blur-sm border rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-lg font-medium mb-4">Imágenes del producto</h2>
            <div className="space-y-5">
              <div
                onDragEnter={(e) => { e.preventDefault(); setIsDraggingFiles(true); }}
                onDragOver={onDragOver}
                onDragLeave={() => setIsDraggingFiles(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDraggingFiles(false);
                  const files = e.dataTransfer.files;
                  if (!files || files.length === 0) return;
                  appendFiles(files);
                }}
                className={`rounded-xl border-2 border-dashed p-6 transition-colors ring-1 ring-black/5 ${isDraggingFiles ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:bg-gray-50'}`}
              >
                <Label htmlFor="productImages">Subir Imágenes</Label>
                <Input id="productImages" type="file" multiple accept="image/*" onChange={handleFilesSelected} className="mt-1" />
                <p className="text-xs text-gray-500 mt-1">Arrastra las imágenes aquí o haz clic para seleccionarlas. Puedes arrastrarlas abajo para reordenarlas.</p>
              </div>

              {images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {images.map((item, index) => (
                    <Card key={index} className="relative p-3">
                      <div className="absolute top-2 left-2 cursor-grab text-gray-500" title="Arrastra para reordenar">
                        <GripVertical className="h-4 w-4" />
                      </div>
                      <img src={item.url} alt={item.altText || `Imagen ${index + 1}`} className="w-full h-40 object-cover" />
                      <Label className="sr-only" htmlFor={`alt-${index}`}>Texto alternativo</Label>
                      <Input
                        id={`alt-${index}`}
                        value={item.altText || ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          setImages((prev) => {
                            const next = [...prev];
                            next[index] = { ...next[index], altText: value };
                            return next;
                          });
                        }}
                        placeholder="Texto alternativo"
                        className="mt-2"
                      />
                      <div className="mt-2 flex justify-end">
                        <Button type="button" size="sm" variant="outline" onClick={() => handleDeleteImage(index)}>
                          Eliminar
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </div>
        </div>
        </div>
      </fieldset>
        <div className="mt-6 flex justify-end space-x-4">
          <Link href="/admin/products">
            <Button type="button" variant="outline">
              Cancelar
            </Button>
          </Link>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                Creando...
              </>
            ) : (
              "Crear Producto"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}