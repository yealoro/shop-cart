"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Autoplay from "embla-carousel-autoplay";

// Define the banner images and their content
const bannerItems = [
  {
    id: 1,
    imageUrl: "https://img.freepik.com/free-photo/anime-moon-landscape_23-2151645914.jpg?t=st=1745973448~exp=1745977048~hmac=7682cbdf663762bc3722b27a7ce19fa62feef702011aca8289331bee154b88c0&w=1380", // Replace with your actual image paths
    title: "New Collection",
    description: "Discover our latest arrivals",
    buttonText: "Shop Now",
    buttonLink: "/shop",
  },
  {
    id: 2,
    imageUrl: "https://img.freepik.com/free-photo/japan-background-digital-art_23-2151546198.jpg?t=st=1745973251~exp=1745976851~hmac=72466079599666b82b9131b6c01d3c3398eb90d13cf7c8df7dbc270fd9064429&w=996",
    title: "Summer Sale",
    description: "Up to 50% off on selected items",
    buttonText: "View Offers",
    buttonLink: "/categories/sale",
  },
  {
    id: 3,
    imageUrl: "https://img.freepik.com/free-photo/anime-moon-landscape_23-2151645908.jpg?t=st=1745973310~exp=1745976910~hmac=d407a4a582e30f33d739ab76fac339e0da28ed76da378145757d8487fda59bae&w=1380",
    title: "Exclusive Designs",
    description: "Handcrafted with love",
    buttonText: "Explore",
    buttonLink: "/categories/exclusive",
  },
];

export default function HeroBanner() {
  const [api, setApi] = React.useState<any>();
  const autoplayPlugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: false })
  );

  return (
    <Carousel 
      className="w-full h-80 md:h-[400px] relative overflow-hidden"
      plugins={[autoplayPlugin.current]}
      setApi={setApi}
      opts={{
        loop: true,
      }}
    >
      <CarouselContent>
        {bannerItems.map((item) => (
          <CarouselItem key={item.id}>
            <div className="relative w-full h-80 md:h-[400px] overflow-hidden">
              {/* Background Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ 
                  backgroundImage: `url(${item.imageUrl})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                {/* Overlay for better text visibility */}
                <div className="absolute inset-0 bg-black/30"></div>
              </div>
              
              {/* Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-6">
                <h2 className="text-3xl md:text-4xl font-bold mb-2">{item.title}</h2>
                <p className="text-lg md:text-xl mb-6">{item.description}</p>
                <Link href={item.buttonLink}>
                  <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-black transition-colors">
                    {item.buttonText}
                  </Button>
                </Link>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}