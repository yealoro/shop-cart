"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function ProductsRedirect() {
  const router = useRouter()

  useEffect(() => {
    router.push("/admin/products")
  }, [router])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p>Redirecting to admin products page...</p>
    </div>
  )
}

