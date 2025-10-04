'use client';

import { useState, useEffect, FormEvent, ChangeEvent, DragEvent, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import { ArrowLeft, GripVertical } from "lucide-react";
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

// NEW: Image item interface for multi-image management
interface ImageItem {
  id?: number;
  url: string;
  altText?: string;
  order: number;
  file?: File;
  isNew?: boolean;
  toDelete?: boolean;
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
  // NEW: multi-image state
  const [images, setImages] = useState<ImageItem[]>([]);
  const [dragItemIndex, setDragItemIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  // NUEVO: estado para resaltar zona de drop y panel colapsable
  const [isDraggingFiles, setIsDraggingFiles] = useState(false);
  const [isAdditionalOpen, setIsAdditionalOpen] = useState(false);
  const toggleAdditionalOpen = () => setIsAdditionalOpen(prev => !prev);

  // Helper: construir src absoluto cuando la URL es relativa al backend (/uploads)
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3300";
  const resolveImageSrc = (url: string) => {
    if (!url) return '';
    if (/^https?:\/\//.test(url)) return url; // URL absoluta
    if (url.startsWith('/uploads')) return `${API_BASE_URL}${url}`; // relativa al backend
    return url; // fallback (blob/objectURL)
  };

  // Fetch categories when component mounts
  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch(`/api/categories`);
        if (!response.ok) {
          throw new Error("No se pudo obtener las categorías");
        }
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error al obtener categorías:", error);
        toast.error("No se pudieron cargar las categorías.");
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
        setError('Falta el ID del producto.');
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const response = await fetch(`/api/products/${id}`);
        if (!response.ok) {
          if (response.status === 404) {
            setError('Producto no encontrado.');
          } else {
             throw new Error('No se pudo obtener el producto');
          }
          return;
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
          categoryId: product.category?.id?.toString() || '',
          imageUrl: product.imageUrl || '',
          status: product.status || 'Active',
        });
        if (product.imageUrl) {
            setImagePreview(resolveImageSrc(product.imageUrl));
        }
      } catch (err) {
        console.error("Error al obtener producto:", err);
        setError(err instanceof Error ? err.message : 'Ocurrió un error al obtener los datos del producto.');
        toast.error("No se pudieron cargar los datos del producto.");
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [id]);

  // NEW: Fetch product images
  useEffect(() => {
    async function fetchImages() {
      if (!id) return;
      try {
        const res = await fetch(`${API_BASE_URL}/images/product/${id}`);
        if (res.ok) {
          const data = await res.json();
          const mapped: ImageItem[] = (data || []).map((img: any) => ({
            id: img.id,
            url: img.url,
            altText: img.altText || '',
            order: typeof img.order === 'number' ? img.order : 0,
          }));
          mapped.sort((a, b) => a.order - b.order);
          setImages(mapped);
        }
      } catch (err) {
        console.error('Error fetching images:', err);
      }
    }
    fetchImages();
  }, [id]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === 'imageUrl') {
      setImagePreview(resolveImageSrc(value));
    }
  };

  // Helper: agregar archivos al estado de imágenes con previsualización
  const addFilesToState = (filesList: FileList | null) => {
    if (!filesList || filesList.length === 0) return;
    const files = Array.from(filesList);
    setImages((prev) => {
      const startOrder = prev.length;
      const next = files.map((file, i) => {
        const objectUrl = URL.createObjectURL(file);
        return {
          id: undefined,
          url: objectUrl,      // Previsualización local
          altText: '',
          order: startOrder + i,
          isNew: true,
          toDelete: false,
          file,                // Para sincronización posterior (convertir a base64 en submit)
        };
      });
      return [...prev, ...next];
    });
  };

  // Drag & drop área de archivos
  const onFilesDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingFiles(true);
  };
  const onFilesDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingFiles(true);
  };
  const onFilesDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingFiles(false);
  };
  const handleFilesDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingFiles(false);
    addFilesToState(e.dataTransfer?.files ?? null);
  };
  const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    addFilesToState(e.target.files);
    // reset input para poder volver a seleccionar los mismos archivos si hace falta
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Reordenación drag & drop visual de tarjetas
  const onDragStart = (index: number) => setDragItemIndex(index);
  const onDragOverCard = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const onDropCard = (index: number) => {
    if (dragItemIndex === null || dragItemIndex === index) return;
    setImages((prev) => {
      const copy = [...prev];
      const [moved] = copy.splice(dragItemIndex, 1);
      copy.splice(index, 0, moved);
      // Recalcular order secuencial
      return copy.map((img, i) => ({ ...img, order: i }));
    });
    setDragItemIndex(null);
  };

  // Eliminar: si es nueva se elimina del estado; si existe, toggle "toDelete"
  const handleDeleteImage = (index: number) => {
    setImages((prev) => {
      const copy = [...prev];
      const current = copy[index];
      if (current.isNew) {
        copy.splice(index, 1);
      } else {
        copy[index] = { ...current, toDelete: !current.toDelete };
      }
      // Recalcular order
      return copy.map((img, i) => ({ ...img, order: i }));
    });
  };

  // NEW: helper to convert file to data URL for backend storage
  const fileToDataUrl = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  };

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, categoryId: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    if (!formData.categoryId) {
      setError('Por favor, selecciona una categoría para este producto');
      setSaving(false);
      toast.error('La categoría es obligatoria.');
      return;
    }

    const productUpdatePayload = {
      name: formData.name.trim(),
      description: formData.description,
      price: parseFloat(formData.price) || 0,
      stock: parseInt(formData.stock, 10) || 0,
      discount: parseFloat(formData.discount) || 0,
      sku: formData.sku,
      brand: formData.brand,
      manufacturer: formData.manufacturer,
      supplier: formData.supplier,
      categoryId: parseInt(formData.categoryId, 10),
    };

    console.log(`Intentando actualizar producto ID: ${id}`, productUpdatePayload);

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(productUpdatePayload),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        console.error(`Error response status: ${response.status}, body:`, errorBody);
        if (response.status === 404) {
          throw new Error(`No se pudo actualizar: el producto con ID ${id} no existe.`);
        } else {
          throw new Error(`Falló la actualización del producto. Estado ${response.status}. Respuesta: ${errorBody}`);
        }
      }

      const updatedProduct = await response.json();
      console.log('Producto actualizado:', updatedProduct);

      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3300";
        for (const item of images) {
          if (item.toDelete && item.id) {
            await fetch(`${API_URL}/images/${item.id}`, { method: 'DELETE' });
            continue;
          }
          if (item.isNew && item.file) {
            const dataUrl = await fileToDataUrl(item.file);
            await fetch(`${API_URL}/images`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ url: dataUrl, altText: item.altText || '', order: item.order, product: { id: updatedProduct.id ?? id } }),
            });
            continue;
          }
          if (item.id && !item.toDelete) {
            await fetch(`${API_URL}/images/${item.id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ altText: item.altText || '', order: item.order }),
            });
          }
        }
      } catch (imgErr) {
        console.warn('Algunas actualizaciones de imágenes fallaron:', imgErr);
      }

      toast.success("¡Producto actualizado correctamente!");
      router.push('/products');
    } catch (err) {
      console.error('Error durante la actualización:', err);
      const errorMessage = err instanceof Error ? err.message : 'Ocurrió un error desconocido durante la actualización.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="container mx-auto p-4">Cargando detalles del producto...</div>;
  }

  if (error && !formData.name) {
    return (
      <div className="container mx-auto p-4 max-w-6xl mb-4 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-red-800" role="alert" aria-live="polite">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="mb-6 flex items-center">
        <Link href="/admin/products" className="text-sm text-gray-500 hover:text-gray-700 flex items-center">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Volver a Productos
        </Link>
        <h1 className="text-xl font-semibold ml-4">Editar Producto: {formData.name || `ID: ${id}`}</h1>
      </div>

      {error && formData.name && (
        <div className="mb-4 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-red-800" role="alert" aria-live="polite">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <fieldset disabled={saving || loading} className="contents">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column - Product Information */}
          <Card className="p-6 shadow-sm">
            <h2 className="text-lg font-medium mb-4">Información del Producto</h2>
            <div className="space-y-4">
              {/* Name */}
              <div>
                <Label htmlFor="name">Nombre del Producto</Label>
                <Input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className="mt-1" />
              </div>
              {/* Description */}
              <div>
                <Label htmlFor="description">Descripción</Label>
                <Textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={4} className="mt-1" />
              </div>
              {/* Category */}
              <div>
                <Label htmlFor="category">Categoría</Label>
                <Select value={formData.categoryId} onValueChange={handleCategoryChange} disabled={loadingCategories}>
                  <SelectTrigger id="category" className="mt-1">
                    <SelectValue placeholder={loadingCategories ? "Cargando..." : "Seleccione una categoría"} />
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
                <Label htmlFor="price">Precio ($)</Label>
                <Input type="number" id="price" name="price" value={formData.price} onChange={handleChange} step="0.01" min="0" required className="mt-1" />
              </div>
              {/* Stock */}
              <div>
                <Label htmlFor="stock">Cantidad en Stock</Label>
                <Input type="number" id="stock" name="stock" value={formData.stock} onChange={handleChange} min="0" className="mt-1" />
              </div>
              {/* Status */}
              <div>
                <Label htmlFor="status">Estado</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
                  <SelectTrigger id="status" className="mt-1">
                    <SelectValue placeholder="Selecciona estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Activo</SelectItem>
                    <SelectItem value="Inactive">Inactivo</SelectItem>
                    <SelectItem value="Draft">Borrador</SelectItem>
                  </SelectContent>
                </Select>
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
                    <Input type="text" id="imageUrl" name="imageUrl" value={formData.imageUrl} onChange={handleChange} className="mt-1" />
                  </div>
                  {imagePreview && (
                    <div className="mt-2">
                      <Label>Vista previa de la imagen</Label>
                      <div className="mt-1 border rounded-md overflow-hidden h-48 flex items-center justify-center bg-gray-50">
                        <img src={resolveImageSrc(imagePreview)} alt="Vista previa del producto" className="max-h-full max-w-full object-contain" onError={(e) => { e.currentTarget.src = "https://via.placeholder.com/300x300?text=Sin+imagen"; }} />
                      </div>
                    </div>
                  )}
                  <div>
                    <Label htmlFor="brand">Marca</Label>
                    <Input type="text" id="brand" name="brand" value={formData.brand} onChange={handleChange} className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="manufacturer">Fabricante</Label>
                    <Input type="text" id="manufacturer" name="manufacturer" value={formData.manufacturer} onChange={handleChange} className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="supplier">Proveedor</Label>
                    <Input type="text" id="supplier" name="supplier" value={formData.supplier} onChange={handleChange} className="mt-1" />
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* Vista previa de imágenes existentes (solo lectura) */}
        <div className="mt-8">
          <Card className="p-6 bg-white/80 backdrop-blur-sm border rounded-xl shadow-sm">
            <h2 className="text-lg font-medium mb-4">Imágenes actuales</h2>
            {images.filter(img => !img.isNew).length === 0 ? (
              <p className="text-sm text-gray-500">Este producto aún no tiene imágenes guardadas.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {images
                  .filter(img => !img.isNew)
                  .sort((a, b) => a.order - b.order)
                  .map((img) => (
                    <div key={(img.id ?? img.url) + '-preview'} className="relative rounded-md overflow-hidden border bg-gray-50">
                      <img
                        src={resolveImageSrc(img.url)}
                        alt={img.altText || 'Imagen del producto'}
                        className="w-full h-36 object-cover"
                        onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/300x300?text=Sin+imagen'; }}
                      />
                      <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded">
                        Orden {img.order}
                      </div>
                    </div>
                  ))}
              </div>
            )}
            <p className="mt-3 text-xs text-gray-500">Vista previa de solo lectura. Para modificar, usa la sección de gestión debajo.</p>
          </Card>
        </div>

        {/* NEW: Product Images Section */}
        <div className="mt-8">
          <Card className="p-6 bg-white/80 backdrop-blur-sm border rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-lg font-medium mb-4">Imágenes del producto</h2>
            <div className="space-y-5">
              <div
                onDragEnter={onFilesDragEnter}
                onDragOver={onFilesDragOver}
                onDragLeave={onFilesDragLeave}
                onDrop={handleFilesDrop}
                role="button"
                tabIndex={0}
                onClick={() => fileInputRef.current?.click()}
                className={`rounded-xl border-2 border-dashed p-6 transition-colors ring-1 ring-black/5 cursor-pointer ${
                  isDraggingFiles ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                <Label htmlFor="editProductImages" className="block font-medium">Subir Imágenes</Label>
                <Input
                  id="editProductImages"
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFilesSelected}
                  className="mt-2 hidden"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Arrastra las imágenes aquí o haz clic para seleccionar. Puedes reordenarlas abajo.
                </p>
              </div>

              {images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {images.map((img, index) => (
                    <Card
                      key={img.id ?? `new-${index}`}
                      className={`relative p-3 ${img.toDelete ? 'opacity-50' : ''}`}
                      draggable
                      onDragStart={() => onDragStart(index)}
                      onDragOver={onDragOverCard}
                      onDrop={() => onDropCard(index)}
                    >
                      <div className="absolute top-2 left-2 cursor-grab text-gray-500" title="Arrastra para reordenar">
                        <GripVertical className="h-4 w-4" />
                      </div>
                      <img
                        src={resolveImageSrc(img.url)}
                        alt={img.altText || `Imagen ${index + 1}`}
                        className="w-full h-40 object-cover rounded"
                      />
                      <Label className="sr-only" htmlFor={`alt-${index}`}>Texto alternativo</Label>
                      <Input
                        id={`alt-${index}`}
                        value={img.altText || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setImages((prev) => {
                            const copy = [...prev];
                            copy[index] = { ...copy[index], altText: val };
                            return copy;
                          });
                        }}
                        placeholder="Texto alternativo"
                        className="mt-2"
                      />
                      <div className="mt-2 flex justify-end">
                        <Button
                          type="button"
                          size="sm"
                          variant={img.isNew ? 'outline' : (img.toDelete ? 'outline' : 'destructive')}
                          onClick={() => handleDeleteImage(index)}
                        >
                          {img.isNew ? 'Eliminar' : img.toDelete ? 'Deshacer' : 'Eliminar'}
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Footer de acciones */}
        <div className="mt-6 flex justify-end space-x-4">
          <Link href="/admin/products">
            <Button type="button" variant="outline" disabled={saving}>
              Cancelar
            </Button>
          </Link>
          <Button type="submit" disabled={saving || loading}>
            {saving ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                Guardando...
              </>
            ) : (
              "Guardar cambios"
            )}
          </Button>
        </div>
        </fieldset>
      </form>
    </div>
  );
}