"use client";

import { useState, useEffect } from "react";

interface AnnouncementBannerProps {
  messages: string[];
  interval?: number; // Tiempo en milisegundos entre cambios
}

export default function AnnouncementBanner({ 
  messages, 
  interval = 5000 // 5 segundos por defecto
}: AnnouncementBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (messages.length <= 1) return;

    const timer = setInterval(() => {
      setIsTransitioning(true);
      
      // Esperar a que termine la transición para cambiar el mensaje
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % messages.length);
        setIsTransitioning(false);
      }, 500); // Duración de la transición
    }, interval);

    return () => clearInterval(timer);
  }, [messages, interval]);

  if (messages.length === 0) return null;

  return (
    <div className="w-full bg-gray-300 text-black font-extrabold  overflow-hidden">
      <div className="relative h-full">
        <div 
          className={`text-center py-2 text-xs font-medium tracking-wider px-4 transition-all duration-500 ease-in-out ${
            isTransitioning ? 'opacity-0 transform -translate-y-2' : 'opacity-100 transform translate-y-0'
          }`}
        >
          {messages[currentIndex]}
        </div>
      </div>
    </div>
  );
}