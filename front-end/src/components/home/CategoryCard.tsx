import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface CategoryCardProps {
  id: number;
  name: string;
  imageUrl?: string;
}

export default function CategoryCard({ id, name, imageUrl }: CategoryCardProps) {
  const [imageError, setImageError] = useState(false);
  
  // Función para manejar errores de carga de imagen
  const handleImageError = () => {
    console.error(`Error loading image for category: ${name}`);
    setImageError(true);
  };

  // Crear un slug a partir del nombre de la categoría
  const categorySlug = name.toLowerCase().replace(/\s+/g, '-');

  return (
    <Link href={`/categories/${categorySlug}`} className="relative overflow-hidden group">
      <div className="aspect-square bg-gray-200 relative">
        {imageUrl && !imageError ? (
          <Image 
            src={imageUrl} 
            alt={`${name} Category`} 
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            onError={handleImageError}
            unoptimized={!imageUrl.startsWith('/')} // Para URLs externas
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-400 to-gray-600">
            <span className="text-4xl">🏷️</span>
          </div>
        )}
        <div className="absolute inset-0 bg-black/30 flex items-end p-3">
          <h2 className="text-white text-lg sm:text-xl font-bold">{name}</h2>
        </div>
      </div>
    </Link>
  );
}