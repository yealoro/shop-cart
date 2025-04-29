"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
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
        className={`w-full py-4 px-4 sm:px-6 md:px-8 md:m-10 lg:px-52 flex items-center justify-between transition-all duration-300 ease-in-out z-50
          ${isScrolled 
            ? 'fixed top-0 bg-white/95 dark:bg-black/95 ' 
            : 'bg-transparent relative'
          }`}
      >
      
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
          <nav className="hidden md:flex gap-6 text-lg">
            <Link href="/" className="hover:opacity-70 font-medium">Home</Link>
            <Link href="/vtuber-collabs" className="hover:opacity-70 font-medium">Vtuber Collabs</Link>
            <Link href="/ara-artists" className="hover:opacity-70 font-medium">Ara Artists</Link>
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
          <nav className="hidden md:flex gap-6 text-lg">
            <Link href="/policies" className="hover:opacity-70 font-medium">Policies</Link>
            <Link href="/about-us" className="hover:opacity-70 font-medium">About Us</Link>
            <Link href="/ara-vtuber" className="hover:opacity-70 font-medium">Ara Vtuber</Link>
          </nav>
          
          {/* Account and Cart Icons - Visible on all screens */}
          <div className="flex gap-4 items-center">
            <button aria-label="Account" className="text-xl">
              <AccountIcon />
            </button>
            <button aria-label="Cart" className="text-xl">
              <CartIcon />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 bg-white z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex justify-center items-center p-4 border-b">
          <div></div> {/* Espacio vacío para alinear el botón de cierre a la derecha */}
          <button 
            onClick={toggleMenu}
            aria-label="Close menu"
            className="text-2xl"
          >
            <CloseIcon />
          </button>
        </div>
        <nav className="flex flex-col p-4">
          <Link 
            href="/" 
            className="py-4 border-b text-base font-normal"
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          <Link 
            href="/vtuber-collabs" 
            className="py-4 border-b text-base font-normal"
            onClick={() => setIsMenuOpen(false)}
          >
            Vtuber Collabs
          </Link>
          <Link 
            href="/ara-artists" 
            className="py-4 border-b text-base font-normal"
            onClick={() => setIsMenuOpen(false)}
          >
            Ara Artists
          </Link>
          <Link 
            href="/policies" 
            className="py-4 border-b text-base font-normal"
            onClick={() => setIsMenuOpen(false)}
          >
            Policies
          </Link>
          <Link 
            href="/about-us" 
            className="py-4 border-b text-base font-normal"
            onClick={() => setIsMenuOpen(false)}
          >
            About Us
          </Link>
          <Link 
            href="/ara-vtuber" 
            className="py-4 border-b text-base font-normal"
            onClick={() => setIsMenuOpen(false)}
          >
            Ara Vtuber
          </Link>
          <Link 
            href="/login" 
            className="py-4 border-b text-base font-normal"
            onClick={() => setIsMenuOpen(false)}
          >
            Log in
          </Link>
          
          {/* Social Media Icons */}
          <div className="flex justify-center gap-8 mt-8">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-4 border">
              <InstagramIcon />
            </a>
            <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="p-4 border">
              <TiktokIcon />
            </a>
          </div>
        </nav>
      </div>
    </>
  );
}