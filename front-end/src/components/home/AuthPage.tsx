"use client"
import { useState, useTransition } from "react" // Import React hooks
import Link from "next/link" // Import Link from Next.js

// Icons from Lucide React
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

// UI Components (assuming they come from a library like Shadcn UI)
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"

// Local imports
import { loginAction, registerAction, forgotPasswordAction, socialLoginAction } from "@/lib/auth-actions"
import { getPasswordStrength } from "@/lib/validation"
import type { AuthResponse } from "@/types/auth"

type AuthMode = "login" | "register" | "forgot-password"

export default function AuthPage() {
  const [mode, setMode] = useState<AuthMode>("login")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [password, setPassword] = useState("")
  const [response, setResponse] = useState<AuthResponse | null>(null)
  const [isPending, startTransition] = useTransition()

  const passwordStrength = getPasswordStrength(password)

  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      let result: AuthResponse

      switch (mode) {
        case "login":
          result = await loginAction(formData)
          break
        case "register":
          result = await registerAction(formData)
          break
        case "forgot-password":
          result = await forgotPasswordAction(formData)
          break
        default:
          return
      }

      setResponse(result)

      if (result.success && result.redirectTo) {
        // In production, you would use router.push(result.redirectTo)
        console.log(`Redirecting to: ${result.redirectTo}`)
      }
    })
  }

  const handleSocialLogin = (provider: "google" | "facebook") => {
    startTransition(async () => {
      const result = await socialLoginAction(provider)
      setResponse(result)

      if (result.success && result.redirectTo) {
        console.log(`Redirecting to: ${result.redirectTo}`)
      }
    })
  }

  const getPasswordStrengthColor = () => {
    switch (passwordStrength.strength) {
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

  const getPasswordStrengthText = () => {
    switch (passwordStrength.strength) {
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
        <img src="/logo.webp" alt="Deco House" className="w-30 h-30 mx-auto mb-10" />
        {/* Header */}
        <div className="text-center space-y-2">
          <p className="text-gray-600">
            {mode === "login" && "¡Bienvenido de nuevo! Por favor, inicia sesión en tu cuenta."}
            {mode === "register" && "Crea tu cuenta para empezar."}
            {mode === "forgot-password" && "Restablece tu contraseña."}
          </p>
        </div>

        {/* Response Alert */}
        {response && (
          <Alert className={response.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
            {response.success ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-600" />
            )}
            <AlertDescription className={response.success ? "text-green-800" : "text-red-800"}>
              {response.message}
            </AlertDescription>
          </Alert>
        )}

        <Card className="py-8">
          <CardHeader>
            <CardTitle>
              {mode === "login" && "Iniciar Sesión"}
              {mode === "register" && "Crear Cuenta"}
              {mode === "forgot-password" && "Restablecer Contraseña"}
            </CardTitle>
            <CardDescription>
              {mode === "login" && "Introduce tus credenciales para acceder a tu cuenta"}
              {mode === "register" && "Rellena tu información para crear una nueva cuenta"}
              {mode === "forgot-password" && "Introduce tu correo electrónico para recibir instrucciones de restablecimiento"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Social Login Buttons */}
            {mode !== "forgot-password" && (
              <div className="space-y-3">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={() => handleSocialLogin("google")}
                  disabled={isPending}
                >
                  <Chrome className="mr-2 h-4 w-4" />
                  Continuar con Google
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={() => handleSocialLogin("facebook")}
                  disabled={isPending}
                >
                  <Facebook className="mr-2 h-4 w-4" />
                  Continuar con Facebook
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  {/* Capitalization adjusted to match the image */}
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-muted-foreground">O CONTINUAR CON CORREO ELECTRÓNICO</span>
                  </div>
                </div>
              </div>
            )}

            {/* Authentication Form */}
            <form action={handleSubmit} className="space-y-4">
              {/* Name Field (Register Only) */}
              {mode === "register" && (
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
                      disabled={isPending}
                    />
                  </div>
                </div>
              )}

              {/* Email Field */}
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
                    disabled={isPending}
                  />
                </div>
              </div>

              {/* Password Field */}
              {mode !== "forgot-password" && (
                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Introduce tu contraseña"
                      className="pl-10 pr-10"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={isPending}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>

                  {/* Password Strength Indicator (Register Only) */}
                  {mode === "register" && password && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span>Fuerza de la contraseña</span>
                        <span
                          className={`font-medium ${
                            passwordStrength.strength === "weak"
                              ? "text-red-600"
                              : passwordStrength.strength === "medium"
                                ? "text-yellow-600"
                                : "text-green-600"
                          }`}
                        >
                          {getPasswordStrengthText()}
                        </span>
                      </div>
                      <Progress value={(passwordStrength.score / 6) * 100} className="h-2" />
                    </div>
                  )}
                </div>
              )}

              {/* Confirm Password Field (Register Only) */}
              {mode === "register" && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirma tu contraseña"
                      className="pl-10 pr-10"
                      required
                      disabled={isPending}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              )}

              {/* Remember Me (Login Only) */}
              {mode === "login" && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="rememberMe" name="rememberMe" disabled={isPending} />
                    <Label htmlFor="rememberMe" className="text-sm">
                      Recordarme
                    </Label>
                  </div>
                  <button
                    type="button"
                    className="text-sm text-blue-600 hover:text-blue-500"
                    onClick={() => setMode("forgot-password")}
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>
              )}

              {/* Accept Terms (Register Only) */}
              {mode === "register" && (
                <div className="space-x-2">
                  <Checkbox id="acceptTerms" name="acceptTerms" required disabled={isPending} />
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

              {/* Submit Button */}
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Procesando...
                  </div>
                ) : (
                  <div className="flex items-center">
                    {mode === "login" && "Iniciar Sesión"}
                    {mode === "register" && "Crear Cuenta"}
                    {mode === "forgot-password" && "Enviar Enlace de Restablecimiento"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                )}
              </Button>
            </form>

            {/* Links to Change Mode */}
            <div className="text-center space-y-2">
              {mode === "login" && (
                <p className="text-sm text-gray-600">
                  {"¿No tienes una cuenta? "}
                  <button
                    type="button"
                    className="text-blue-600 hover:text-blue-500 font-medium"
                    onClick={() => setMode("register")}
                  >
                    Regístrate
                  </button>
                </p>
              )}

              {mode === "register" && (
                <p className="text-sm text-gray-600">
                  ¿Ya tienes una cuenta?{" "}
                  <button
                    type="button"
                    className="text-blue-600 hover:text-blue-500 font-medium"
                    onClick={() => setMode("login")}
                  >
                    Inicia sesión
                  </button>
                </p>
              )}

              {mode === "forgot-password" && (
                <p className="text-sm text-gray-600">
                  ¿Recuerdas tu contraseña?{" "}
                  <button
                    type="button"
                    className="text-blue-600 hover:text-blue-500 font-medium"
                    onClick={() => setMode("login")}
                  >
                    Inicia sesión
                  </button>
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Deco House Cali. Todos los derechos reservados.</p>
          <p className="mt-1">Autenticación segura impulsada por estándares de la industria</p>
        </div>
      </div>
    </div>
  )
}