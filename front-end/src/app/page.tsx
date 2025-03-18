import Image from "next/image";
import Link from "next/link";
import Navigation from "@/components/Navigation";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Announcement Banner */}
      <div className="bg-black text-white text-center py-3 text-sm font-medium">
        PLEASE READ THE TERMS & CONDITIONS! SHIPPING DELAYS DUE TO SUPPLIER DELAYS, WE ARE WORKING ON ORDERS EVERY DAY!
      </div>

      {/* Navigation - Ahora usando el componente separado */}
      <Navigation />

      {/* Spacer para evitar saltos cuando la navegación se vuelve fixed */}
      <div className="h-[76px] md:h-[84px] hidden" id="nav-spacer"></div>

      {/* Hero Banner */}
      <div className="w-full h-80 md:h-[400px] bg-gradient-to-r from-blue-400 to-purple-500 relative overflow-hidden">
        {/* You can place an image here for the banner */}
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Optional: Hero content here */}
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-4 md:px-8 py-8">
        {/* Category 1 */}
        <Link href="/categories/aruna-reaver" className="relative overflow-hidden group">
          <div className="aspect-square bg-gray-200 relative">
            <Image 
              src="/category-aruna.jpg" 
              alt="Aruna Reaver Category" 
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black/30 flex items-end p-6">
              <h2 className="text-white text-3xl font-bold">Aruna Reaver</h2>
            </div>
          </div>
        </Link>

        {/* Category 2 */}
        <Link href="/categories/prints" className="relative overflow-hidden group">
          <div className="aspect-square bg-gray-200 relative">
            <Image 
              src="/category-prints.jpg" 
              alt="Prints Category" 
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black/30 flex items-end p-6">
              <h2 className="text-white text-3xl font-bold">Prints</h2>
            </div>
          </div>
        </Link>

        {/* Category 3 */}
        <Link href="/categories/stickers" className="relative overflow-hidden group">
          <div className="aspect-square bg-gray-200 relative">
            <Image 
              src="/category-stickers.jpg" 
              alt="Stickers Category" 
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black/30 flex items-end p-6">
              <h2 className="text-white text-3xl font-bold">Stickers</h2>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
