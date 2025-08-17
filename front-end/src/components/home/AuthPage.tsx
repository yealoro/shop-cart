"use client"
import { useState, useTransition } from "react" // Importar hooks de React
import Link from "next/link" // Importar Link de Next.js

// Iconos de Lucide React
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Chrome,
  Facebook,
  ArrowRight,
  AlertCircle,
  CheckCircle,
} from "lucide-react"

// Componentes de UI (asumiendo que provienen de una librería como Shadcn UI)
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"

// Importaciones locales
import { loginAction, registerAction, forgotPasswordAction, socialLoginAction } from "@/lib/auth-actions"
import { getPasswordStrength } from "@/lib/validation"
import type { AuthResponse } from "@/types/auth"

type ModoAutenticacion = "login" | "register" | "forgot-password"

export default function AuthPage() {
  const [modo, establecerModo] = useState<ModoAutenticacion>("login")
  const [mostrarContrasena, establecerMostrarContrasena] = useState(false)
  const [mostrarConfirmarContrasena, establecerMostrarConfirmarContrasena] = useState(false)
  const [contrasena, establecerContrasena] = useState("")
  const [respuesta, establecerRespuesta] = useState<AuthResponse | null>(null)
  const [estaPendiente, iniciarTransicion] = useTransition()

  const fuerzaContrasena = getPasswordStrength(contrasena)

  const manejarEnvio = async (formData: FormData) => {
    iniciarTransicion(async () => {
      let resultado: AuthResponse

      switch (modo) {
        case "login":
          resultado = await loginAction(formData)
          break
        case "register":
          resultado = await registerAction(formData)
          break
        case "forgot-password":
          resultado = await forgotPasswordAction(formData)
          break
        default:
          return
      }

      establecerRespuesta(resultado)

      if (resultado.success && resultado.redirectTo) {
        // En producción, usarías router.push(resultado.redirectTo)
        console.log(`Redirigiendo a: ${resultado.redirectTo}`)
      }
    })
  }

  const manejarInicioSesionSocial = (proveedor: "google" | "facebook") => {
    iniciarTransicion(async () => {
      const resultado = await socialLoginAction(proveedor)
      establecerRespuesta(resultado)

      if (resultado.success && resultado.redirectTo) {
        console.log(`Redirigiendo a: ${resultado.redirectTo}`)
      }
    })
  }

  const obtenerColorFuerzaContrasena = () => {
    switch (fuerzaContrasena.strength) {
      case "weak":
        return "bg-red-500"
      case "medium":
        return "bg-yellow-500"
      case "strong":
        return "bg-green-500"
      default:
        return "bg-gray-200"
    }
  }

  const obtenerTextoFuerzaContrasena = () => {
    switch (fuerzaContrasena.strength) {
      case "weak":
        return "Débil"
      case "medium":
        return "Media"
      case "strong":
        return "Fuerte"
      default:
        return ""
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Encabezado */}
        <div className="text-center space-y-2">
          <p className="text-gray-600">
            {modo === "login" && "¡Bienvenido de nuevo! Por favor, inicia sesión en tu cuenta."}
            {modo === "register" && "Crea tu cuenta para empezar."}
            {modo === "forgot-password" && "Restablece tu contraseña."}
          </p>
        </div>

        {/* Alerta de Respuesta */}
        {respuesta && (
          <Alert className={respuesta.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
            {respuesta.success ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-600" />
            )}
            <AlertDescription className={respuesta.success ? "text-green-800" : "text-red-800"}>
              {respuesta.message}
            </AlertDescription>
          </Alert>
        )}

        <Card className="py-8">
          <CardHeader>
            <CardTitle>
              {modo === "login" && "Iniciar Sesión"}
              {modo === "register" && "Crear Cuenta"}
              {modo === "forgot-password" && "Restablecer Contraseña"}
            </CardTitle>
            <CardDescription>
              {modo === "login" && "Introduce tus credenciales para acceder a tu cuenta"}
              {modo === "register" && "Rellena tu información para crear una nueva cuenta"}
              {modo === "forgot-password" && "Introduce tu correo electrónico para recibir instrucciones de restablecimiento"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Botones de Inicio de Sesión Social */}
            {modo !== "forgot-password" && (
              <div className="space-y-3">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={() => manejarInicioSesionSocial("google")}
                  disabled={estaPendiente}
                >
                  <Chrome className="mr-2 h-4 w-4" />
                  Continuar con Google
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={() => manejarInicioSesionSocial("facebook")}
                  disabled={estaPendiente}
                >
                  <Facebook className="mr-2 h-4 w-4" />
                  Continuar con Facebook
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  {/* Capitalización ajustada para coincidir con la imagen */}
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-muted-foreground">O CONTINUAR CON CORREO ELECTRÓNICO</span>
                  </div>
                </div>
              </div>
            )}

            {/* Formulario de Autenticación */}
            <form action={manejarEnvio} className="space-y-4">
              {/* Campo de Nombre (Solo Registro) */}
              {modo === "register" && (
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre Completo</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Introduce tu nombre completo"
                      className="pl-10"
                      required
                      disabled={estaPendiente}
                    />
                  </div>
                </div>
              )}

              {/* Campo de Correo Electrónico */}
              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Introduce tu correo electrónico"
                    className="pl-10"
                    required
                    disabled={estaPendiente}
                  />
                </div>
              </div>

              {/* Campo de Contraseña */}
              {modo !== "forgot-password" && (
                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="password"
                      name="password"
                      type={mostrarContrasena ? "text" : "password"}
                      placeholder="Introduce tu contraseña"
                      className="pl-10 pr-10"
                      value={contrasena}
                      onChange={(e) => establecerContrasena(e.target.value)}
                      required
                      disabled={estaPendiente}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      onClick={() => establecerMostrarContrasena(!mostrarContrasena)}
                    >
                      {mostrarContrasena ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>

                  {/* Indicador de Fuerza de Contraseña (Solo Registro) */}
                  {modo === "register" && contrasena && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span>Fuerza de la contraseña</span>
                        <span
                          className={`font-medium ${
                            fuerzaContrasena.strength === "weak"
                              ? "text-red-600"
                              : fuerzaContrasena.strength === "medium"
                                ? "text-yellow-600"
                                : "text-green-600"
                          }`}
                        >
                          {obtenerTextoFuerzaContrasena()}
                        </span>
                      </div>
                      <Progress value={(fuerzaContrasena.score / 6) * 100} className="h-2" />
                    </div>
                  )}
                </div>
              )}

              {/* Campo de Confirmar Contraseña (Solo Registro) */}
              {modo === "register" && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={mostrarConfirmarContrasena ? "text" : "password"}
                      placeholder="Confirma tu contraseña"
                      className="pl-10 pr-10"
                      required
                      disabled={estaPendiente}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      onClick={() => establecerMostrarConfirmarContrasena(!mostrarConfirmarContrasena)}
                    >
                      {mostrarConfirmarContrasena ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              )}

              {/* Recordarme (Solo Inicio de Sesión) */}
              {modo === "login" && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="rememberMe" name="rememberMe" disabled={estaPendiente} />
                    <Label htmlFor="rememberMe" className="text-sm">
                      Recordarme
                    </Label>
                  </div>
                  <button
                    type="button"
                    className="text-sm text-blue-600 hover:text-blue-500"
                    onClick={() => establecerModo("forgot-password")}
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>
              )}

              {/* Aceptar Términos (Solo Registro) */}
              {modo === "register" && (
                <div className="space-x-2">
                  <Checkbox id="acceptTerms" name="acceptTerms" required disabled={estaPendiente} />
                  <Label htmlFor="acceptTerms" className="text-sm">
                    Acepto los{" "}
                    <Link href="/terms" className="text-blue-600 hover:text-blue-500">
                      Términos de Servicio
                    </Link>{" "}
                    y la{" "}
                    <Link href="/privacy" className="text-blue-600 hover:text-blue-500">
                      Política de Privacidad
                    </Link>
                  </Label>
                </div>
              )}

              {/* Botón de Enviar */}
              <Button type="submit" className="w-full" disabled={estaPendiente}>
                {estaPendiente ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Procesando...
                  </div>
                ) : (
                  <div className="flex items-center">
                    {modo === "login" && "Iniciar Sesión"}
                    {modo === "register" && "Crear Cuenta"}
                    {modo === "forgot-password" && "Enviar Enlace de Restablecimiento"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                )}
              </Button>
            </form>

            {/* Enlaces para Cambiar de Modo */}
            <div className="text-center space-y-2">
              {modo === "login" && (
                <p className="text-sm text-gray-600">
                  {"¿No tienes una cuenta? "}
                  <button
                    type="button"
                    className="text-blue-600 hover:text-blue-500 font-medium"
                    onClick={() => establecerModo("register")}
                  >
                    Regístrate
                  </button>
                </p>
              )}

              {modo === "register" && (
                <p className="text-sm text-gray-600">
                  ¿Ya tienes una cuenta?{" "}
                  <button
                    type="button"
                    className="text-blue-600 hover:text-blue-500 font-medium"
                    onClick={() => establecerModo("login")}
                  >
                    Inicia sesión
                  </button>
                </p>
              )}

              {modo === "forgot-password" && (
                <p className="text-sm text-gray-600">
                  ¿Recuerdas tu contraseña?{" "}
                  <button
                    type="button"
                    className="text-blue-600 hover:text-blue-500 font-medium"
                    onClick={() => establecerModo("login")}
                  >
                    Inicia sesión
                  </button>
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Pie de página */}
        <div className="text-center text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Deco House Cali. Todos los derechos reservados.</p>
          <p className="mt-1">Autenticación segura impulsada por estándares de la industria</p>
        </div>
      </div>
    </div>
  )
}