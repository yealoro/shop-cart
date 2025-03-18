"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      // Detectar cuando el scroll ha superado cierta altura (por ejemplo, 50px)
      if (window.scrollY > 150) {
        setIsScrolled(true);
        // Mostrar el spacer cuando la navegación se vuelve fija
        const spacer = document.getElementById('nav-spacer');
        if (spacer) spacer.classList.remove('hidden');
      } else {
        setIsScrolled(false);
        // Ocultar el spacer cuando la navegación vuelve a su posición normal
        const spacer = document.getElementById('nav-spacer');
        if (spacer) spacer.classList.add('hidden');
      }
    };
    
    // Añadir el event listener para el scroll
    window.addEventListener('scroll', handleScroll);
    
    // Cleanup del event listener cuando el componente se desmonta
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header 
      className={`w-full py-4 px-6 flex items-center justify-between transition-all duration-300 ease-in-out z-50
        ${isScrolled 
          ? 'fixed top-0 bg-white/95 dark:bg-black/95 shadow-md' 
          : 'bg-transparent relative'
        }`}
    >
      {/* Left Nav - Search */}
      <div className="flex items-center gap-8">
        <button aria-label="Search" className="text-xl">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
          </svg>
        </button>

        {/* Main Navigation */}
        <nav className="hidden md:flex gap-6">
          <Link href="/" className="hover:opacity-70">Home</Link>
          <Link href="/vtuber-collabs" className="hover:opacity-70">Vtuber Collabs</Link>
          <Link href="/ara-artists" className="hover:opacity-70">Ara Artists</Link>
        </nav>
      </div>

      {/* Logo Center */}
      <Link href="/" className="absolute left-1/2 transform -translate-x-1/2">
        <Image 
          src="/ara-culture-logo.png" 
          alt="ARA CULTURE" 
          width={200} 
          height={70}
          className={`transition-all duration-300 ${isScrolled ? 'h-10' : 'h-12'} w-auto`}
          priority
        />
      </Link>

      {/* Right Nav */}
      <div className="flex items-center gap-6">
        <nav className="hidden md:flex gap-6">
          <Link href="/policies" className="hover:opacity-70">Policies</Link>
          <Link href="/about-us" className="hover:opacity-70">About Us</Link>
          <Link href="/ara-vtuber" className="hover:opacity-70">Ara Vtuber</Link>
        </nav>
        
        {/* Social Icons */}
        <div className="flex gap-4 items-center">
          <button aria-label="Account" className="text-xl">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/>
            </svg>
          </button>
          <button aria-label="Cart" className="text-xl">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
              <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
} 