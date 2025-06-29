"use client"
import type React from "react"
import Link from "next/link"
import { useState } from "react"
import { Mail, Instagram, Linkedin, ArrowRight, Facebook, MessageCircle  } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function Footer() {
  const [email, setEmail] = useState("")
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      // Aquí normalmente enviarías el email a tu backend
      console.log("Suscribiendo email:", email)
      setIsSubscribed(true)
      setEmail("")
      setTimeout(() => setIsSubscribed(false), 3000)
    }
  }

  return (
    <footer className="bg-gradient-to-b from-gray-50 to-white border-t border-gray-200">
      <div className="container mx-auto px-4 py-12">
        {/* Ajuste de la cuadrícula principal de 4 a 3 columnas para pantallas grandes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Sección de Marca */}
          <div className="space-y-4">
          <Link href="/">
          <div className="relative">
            <img 
              src="/logo.webp" 
              alt="Deco House Logo" 
              width={100} 
              height={40}
              className="w-[60px] h-[60px] md:w-[85px] md:h-[85px] mb-5" // Eliminado m-5
            />
          </div>
        </Link>
            <p className="text-sm text-gray-600 leading-relaxed">
              Descubre productos únicos que fusionan cultura y diseño moderno. Experimenta la combinación perfecta de
              tradición e innovación.
            </p>
            <div className="flex space-x-4 pt-2">
              <Link
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Síguenos en Instagram"
                className="text-gray-400 hover:text-pink-500 transition-colors duration-200"
              >
                <Instagram className="h-5 w-5" />
              </Link>
              <Link
                href="https://www.tiktok.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Síguenos en TikTok"
                className="text-gray-400 hover:text-gray-900 transition-colors duration-200"
              >
                
              
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                </svg>
              </Link>
              <Link
                href="https://www.facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on Facebook"
                className="text-gray-400 hover:text-blue-600 transition-colors duration-200"
              >
                <Facebook className="h-5 w-5" />
              </Link>
              <Link
                href="https://wa.me/1234567890"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Contact us on WhatsApp"
                className="text-gray-400 hover:text-green-500 transition-colors duration-200"
              >
                <MessageCircle className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Enlaces Rápidos */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Enlaces Rápidos</h3>
            <nav className="flex flex-col space-y-3">
              <Link href="/products" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Todos los Productos
              </Link>
              <Link href="/collections" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Colecciones
              </Link>
              <Link href="/about" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Sobre Nosotros
              </Link>
              <Link href="/contact" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Contacto
              </Link>
              <Link href="/faq" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Preguntas Frecuentes
              </Link>
            </nav>
          </div>

          {/* Soporte y Pagos */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Soporte</h3>
              <div className="space-y-2">
                <a
                  href="mailto:contacto@decohousecali.com"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-2"
                >
                  <Mail className="h-4 w-4" />
                  contacto@decohousecali.com
                </a>
                <Link href="/shipping" className="text-sm text-gray-600 hover:text-gray-900 transition-colors block">
                  Información de Envío
                </Link>
                <Link href="/returns" className="text-sm text-gray-600 hover:text-gray-900 transition-colors block">
                  Devoluciones y Cambios
                </Link>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Aceptamos</h3>
              <div className="grid grid-cols-4 gap-1">
                <div className="flex items-center justify-center">
                  <img src="/payments/pse-logo.png" alt="PSE" className="object-contain w-10 h-10" />
                </div>
                <div className="flex items-center justify-center">
                  <img src="/payments/nequi-logo.png" alt="Nequi" className="object-contain w-10 h-10" />
                </div>
                <div className="flex items-center justify-center">
                  <img src="/payments/daviplata-logo.png" alt="DaviPlata" className="object-contain w-10 h-10" />
                </div>
                <div className="flex items-center justify-center">
                  <img src="/payments/visa-logo.png" alt="Visa" className="object-contain w-10 h-10" />
                </div>
                <div className="flex items-center justify-center">
                  <img src="/payments/mastercard-logo.png" alt="MasterCard" className="object-contain w-12 h-10" />
                </div>
                <div className="flex items-center justify-center">
                  <img src="/payments/maestro-logo.png" alt="Maestro" className="object-fill w-12 h-12" />
                </div>
                <div className="flex items-center justify-center">
                  <img src="/payments/bancolombia-logo.png" alt="Bancolombia" className="object-contain w-10 h-10" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sección Inferior */}
        <div className="border-t border-gray-200 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
              <p className="text-sm text-gray-600">© {new Date().getFullYear()} Deco House Cali. Todos los derechos reservados.</p>
              <div className="flex space-x-4">
                <Link href="/privacy" className="text-xs text-gray-500 hover:text-gray-700 transition-colors">
                  Política de Privacidad
                </Link>
                <Link href="/terms" className="text-xs text-gray-500 hover:text-gray-700 transition-colors">
                  Términos de Servicio
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
