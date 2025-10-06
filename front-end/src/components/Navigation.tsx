"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ShoppingCart, User } from "lucide-react";
import { useCart } from "@/context/CartContext";
import AccountIcon from "./icon/AccountIcon";
import CartIcon from "./icon/CartIcon";
import MenuIcon from "./icon/MenuIcon";
import CloseIcon from "./icon/CloseIcon";
import InstagramIcon from "./icon/InstagramIcon";
import TiktokIcon from "./icon/TiktokIcon";
import AnnouncementBanner from "./AnnouncementBanner";

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();
  const { getItemCount } = useCart();
  
  // Add this useEffect to handle client-side mounting
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Mensajes para el banner de anuncios
  const announcementMessages = [
    "PLEASE READ THE TERMS & CONDITIONS! SHIPPING DELAYS DUE TO SUPPLIER DELAYS.",
    "FREE SHIPPING ON ORDERS OVER $50 IN THE US ONLY",
    "WE ARE WORKING ON ORDERS EVERY DAY! THANK YOU FOR YOUR PATIENCE.",
    "NEW COLLECTIONS COMING SOON! STAY TUNED!"
  ];
  
  useEffect(() => {
    // Prevenir scroll cuando el menú está abierto
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);
  
  useEffect(() => {
    const handleScroll = () => {
      // Detectar cuando el scroll ha superado cierta altura
      if (window.scrollY > 150) {
        setIsScrolled(true);
        const spacer = document.getElementById('nav-spacer');
        if (spacer) spacer.classList.remove('hidden');
      } else {
        setIsScrolled(false);
        const spacer = document.getElementById('nav-spacer');
        if (spacer) spacer.classList.add('hidden');
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      {/* Announcement Banner Slider */}
      <AnnouncementBanner messages={announcementMessages} interval={6000} />
      
      <header 
        className="bg-black text-white md:h-[130px] flex items-center justify-between shadow-xl">
      
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden flex items-center" 
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <MenuIcon />
        </button>

        {/* Left Nav - Search */}
        <div className="hidden md:flex items-center gap-8">
          {/* Main Navigation */}
          <nav className="hidden md:flex gap-6 text-lg ml-25">
            <Link href="/" className="hover:opacity-70 font-medium">Inicio</Link>
            <Link href="/categories/stickers" className="hover:opacity-70 font-medium">Stickers</Link>
            <Link href="/categories/camisetas" className="hover:opacity-70 font-medium">Camisetas</Link>
          </nav>
        </div>

        {/* Logo Center */}
        <Link href="/" className="mx-auto md:absolute md:left-1/2 md:transform md:-translate-x-1/2">
          <div className="relative">
            <img 
              src="/logo.webp" 
              alt="Deco House Logo" 
              width={100} 
              height={40}
              className="w-[60px] h-[60px] md:w-[85px] md:h-[85px]"
            />
          </div>
        </Link>

        {/* Right Nav */}
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex gap-6 text-lg ">
            <Link href="/categories/mousepads" className="hover:opacity-70 font-medium">Mouse Pads</Link>
            <Link href="/about-us" className="hover:opacity-70 font-medium">Cuadros</Link>
            <Link href="/ara-vtuber" className="hover:opacity-70 font-medium">Sobre Nosotros</Link>
          </nav>
          
          {/* Account and Cart Icons - Visible on all screens */}
          <div className="flex gap-4 items-center mr-25">
            <Link href="/login" aria-label="Account" className="text-xl">
              <AccountIcon />
            </Link>
            <Link href="/cart" className="text-xl relative">
              <CartIcon />
              {/* Only render the badge on the client after component has mounted */}
              {isMounted && getItemCount() > 0 && (
                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                  {getItemCount()}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay - REWRITTEN */}
      <div 
        className={`fixed inset-0 bg-white z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          {/* Logo inside mobile menu */}
          <Link href="/" className="flex-shrink-0" onClick={() => setIsMenuOpen(false)}>
            <img 
              src="/logo.webp" 
              alt="Deco House Logo" 
              width={80} 
              height={32}
              className="w-[60px] h-[60px]" // Smaller logo for mobile menu
            />
          </Link>
          {/* Close Button */}
          <button 
            onClick={toggleMenu}
            aria-label="Cerrar menú"
            className="text-2xl p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <CloseIcon />
          </button>
        </div>
        <nav className="flex flex-col p-4 overflow-y-auto h-[calc(100%-64px)]"> {/* Adjust height based on header height */}
          <Link 
            href="/" 
            className="py-3 border-b text-base font-medium text-gray-800 hover:bg-gray-50 transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            Inicio
          </Link>
          <Link 
            href="/categories/stickers" 
            className="py-3 border-b text-base font-medium text-gray-800 hover:bg-gray-50 transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            Stickers
          </Link>
          <Link 
            href="/categories/camisetas" 
            className="py-3 border-b text-base font-medium text-gray-800 hover:bg-gray-50 transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            Camisetas
          </Link>
          <Link 
            href="/categories/mousepads" 
            className="py-3 border-b text-base font-medium text-gray-800 hover:bg-gray-50 transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            Mouse Pads
          </Link>
          <Link 
            href="/about-us" 
            className="py-3 border-b text-base font-medium text-gray-800 hover:bg-gray-50 transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            Sobre Nosotros
          </Link>
          <Link 
            href="/ara-vtuber" 
            className="py-3 border-b text-base font-medium text-gray-800 hover:bg-gray-50 transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            Ara Vtuber
          </Link>
          <Link 
            href="/login" 
            className="py-3 border-b text-base font-medium text-gray-800 hover:bg-gray-50 transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            Iniciar Sesión
          </Link>
          
          {/* Social Media Icons */}
          <div className="flex justify-center gap-6 mt-8 p-4">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-pink-500 transition-colors">
              <InstagramIcon />
            </a>
            <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900 transition-colors">
              <TiktokIcon />
            </a>
          </div>
        </nav>
      </div>
    </>
  );
}