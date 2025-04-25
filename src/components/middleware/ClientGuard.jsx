import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import useAuthStore from "@/store/auth-store"

const PUBLIC_ROUTES = ["/login", "/register"]

export default function ClientGuard({ children }) {
  const { isAuthenticated, hasHydrated, checkAuth } = useAuthStore()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (hasHydrated) {
      checkAuth()
      const isPublic = PUBLIC_ROUTES.includes(pathname)

      if (!isPublic && !isAuthenticated) {
        router.replace("/login")
      }
    }
  }, [hasHydrated, isAuthenticated, pathname])

  if (!hasHydrated) {
    return <div className="text-center mt-20">Chargement...</div>
  }

  return children
}
