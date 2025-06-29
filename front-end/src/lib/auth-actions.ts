"use server" // Indica que este archivo contiene Server Actions

import type { AuthResponse } from "@/types/auth"

// Simulación de una base de datos o servicio de autenticación
const users = new Map<string, { password: string; name: string }>()

export async function loginAction(formData: FormData): Promise<AuthResponse> {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const rememberMe = formData.get("rememberMe") === "on"

  // Simulación de retardo de red
  await new Promise((resolve) => setTimeout(resolve, 1000))

  if (!email || !password) {
    return { success: false, message: "Email and password are required." }
  }

  const user = users.get(email)

  if (!user || user.password !== password) {
    return { success: false, message: "Invalid email or password." }
  }

  // En un caso real, aquí establecerías una sesión o token de autenticación
  console.log(`User ${email} logged in. Remember me: ${rememberMe}`)

  return { success: true, message: "Login successful!", redirectTo: "/dashboard" }
}

export async function registerAction(formData: FormData): Promise<AuthResponse> {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const confirmPassword = formData.get("confirmPassword") as string
  const acceptTerms = formData.get("acceptTerms") === "on"

  // Simulación de retardo de red
  await new Promise((resolve) => setTimeout(resolve, 1000))

  if (!name || !email || !password || !confirmPassword) {
    return { success: false, message: "All fields are required." }
  }

  if (password !== confirmPassword) {
    return { success: false, message: "Passwords do not match." }
  }

  if (!acceptTerms) {
    return { success: false, message: "You must accept the terms and conditions." }
  }

  if (users.has(email)) {
    return { success: false, message: "User with this email already exists." }
  }

  // En un caso real, aquí hashearías la contraseña antes de guardarla
  users.set(email, { name, password })
  console.log(`User ${email} registered.`)

  return { success: true, message: "Registration successful! Please log in.", redirectTo: "/auth" }
}

export async function forgotPasswordAction(formData: FormData): Promise<AuthResponse> {
  const email = formData.get("email") as string

  // Simulación de retardo de red
  await new Promise((resolve) => setTimeout(resolve, 1000))

  if (!email) {
    return { success: false, message: "Email is required." }
  }

  if (!users.has(email)) {
    // Por seguridad, no revelamos si el email existe o no
    return { success: true, message: "If an account with that email exists, a password reset link has been sent." }
  }

  // En un caso real, aquí enviarías un email con un enlace de restablecimiento
  console.log(`Password reset requested for ${email}.`)

  return { success: true, message: "If an account with that email exists, a password reset link has been sent." }
}

export async function socialLoginAction(provider: "google" | "facebook"): Promise<AuthResponse> {
  // Simulación de retardo de red
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // En un caso real, aquí iniciarías el flujo de OAuth con el proveedor
  console.log(`Attempting social login with ${provider}.`)

  // Para esta simulación, siempre será exitoso
  return { success: true, message: `Logged in with ${provider}!`, redirectTo: "/dashboard" }
}