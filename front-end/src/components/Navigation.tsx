"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

import { useCart } from "@/context/CartContext";
import AccountIcon from "./icon/AccountIcon";
import CartIcon from "./icon/CartIcon";
import MenuIcon from "./icon/MenuIcon";
import CloseIcon from "./icon/CloseIcon";
import InstagramIcon from "./icon/InstagramIcon";
import TiktokIcon from "./icon/TiktokIcon";
import AnnouncementBanner from "./AnnouncementBanner";
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuContent, NavigationMenuTrigger, NavigationMenuLink } from "@/components/ui/navigation-menu";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
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
  


  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      {/* Announcement Banner Slider */}
      <AnnouncementBanner messages={announcementMessages} interval={6000} />
      
      <header 
        className="bg-white text-black h-20 md:h-[100px] flex items-center justify-between shadow-sm border-b lg:text-2xl">
        {/* Center - Logo */}
        <Link href="/" className="flex items-center justify-start md:justify-center pl-4 md:pl-0">
          <img 
            src="/logo.webp" 
            alt="Deco House Logo" 
            className="block size-[55px] md:w-[85px] lg:size-20  md:h-[80px] md:my-5 md:ml-10"
          />
        </Link>
        {/* Left - NavigationMenu (desktop) */}
        <div className="hidden md:flex items-center gap-6 pl-6">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink asChild className="font-medium">
                  <Link href="/">Inicio</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Categorías</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid gap-2 p-4 md:w-[400px] lg:w-[500px]">
                    <NavigationMenuLink asChild className="font-medium">
                      <Link href="/categories/stickers">Stickers</Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild className="font-medium">
                      <Link href="/categories/camisetas">Camisetas</Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild className="font-medium">
                      <Link href="/categories/mousepads">Mouse Pads</Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild className="font-medium">
                      <Link href="/about-us">Cuadros</Link>
                    </NavigationMenuLink>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild className="font-medium">
                  <Link href="/ara-vtuber">Sobre Nosotros</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        {/* Mobile Menu Overlay */}
      <div 
        role="dialog" aria-modal="true"
        className={`fixed inset-0 bg-white z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b h-[64px]">
          {/* Logo inside mobile menu */}
          <Link href="/" className="flex-shrink-0" onClick={() => setIsMenuOpen(false)}>
            <img 
              src="/logo.webp" 
              alt="Deco House Logo" 
              width={60} 
              height={60}
              className="w-[48px] h-[48px]"
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
        <nav className="flex flex-col p-4 overflow-y-auto h-[calc(100%-64px)]" aria-label="Mobile Navigation">
          <Link href="/" className="py-3 border-b text-base font-medium text-gray-800 hover:bg-gray-50 transition-colors" onClick={() => setIsMenuOpen(false)}>
            Inicio
          </Link>
          <Link href="/categories/stickers" className="py-3 border-b text-base font-medium text-gray-800 hover:bg-gray-50 transition-colors" onClick={() => setIsMenuOpen(false)}>
            Stickers
          </Link>
          <Link href="/categories/camisetas" className="py-3 border-b text-base font-medium text-gray-800 hover:bg-gray-50 transition-colors" onClick={() => setIsMenuOpen(false)}>
            Camisetas
          </Link>
          <Link href="/categories/mousepads" className="py-3 border-b text-base font-medium text-gray-800 hover:bg-gray-50 transition-colors" onClick={() => setIsMenuOpen(false)}>
            Mouse Pads
          </Link>
          <Link href="/about-us" className="py-3 border-b text-base font-medium text-gray-800 hover:bg-gray-50 transition-colors" onClick={() => setIsMenuOpen(false)}>
            Sobre Nosotros
          </Link>
          <Link href="/ara-vtuber" className="py-3 border-b text-base font-medium text-gray-800 hover:bg-gray-50 transition-colors" onClick={() => setIsMenuOpen(false)}>
            Ara Vtuber
          </Link>
          <Link href="/login" className="py-3 border-b text-base font-medium text-gray-800 hover:bg-gray-50 transition-colors" onClick={() => setIsMenuOpen(false)}>
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
        {/* Right - icons */}
        <div className="flex items-center gap-4 pr-6 md:mr-10">
          <button 
            className="md:hidden flex items-center" 
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <MenuIcon />
          </button>
          <Link href="/login" aria-label="Account" className="text-xl">
            <AccountIcon />
          </Link>
          <Link href="/cart" className="text-xl relative">
            <CartIcon />
            {isMounted && getItemCount() > 0 && (
              <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                {getItemCount()}
              </span>
            )}
          </Link>
        </div>
      </header>
      
    </>
  );
}