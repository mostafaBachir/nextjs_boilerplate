import { create } from "zustand"
import { persist } from "zustand/middleware"
import { jwtDecode } from "jwt-decode"
import { authApi as api } from "@/lib/api"
import { useToastStore } from "@/store/toast-store"

export const useAuthStore = create(
  persist(
    (set, get) => ({
      // State principal
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      permissions: [],
      hasHydrated: false,

      // Hydratation du state persisté
      setHasHydrated: () => set({ hasHydrated: true }),

      // Connexion
      login: async ({ email, password }) => {
        const { showToast } = useToastStore.getState()

        try {
          const res = await api.post("/auth/token/", { email, password })
          const { access, refresh } = res.data

          const decoded = jwtDecode(access)
          const userData = {
            id: decoded.user_id,
            email: decoded.email,
            role: decoded.role || "user",
          }

          const permissions = decoded.permissions || []

          set({
            user: userData,
            accessToken: access,
            refreshToken: refresh,
            permissions,
            isAuthenticated: true,
          })

          showToast("Connexion réussie", "success")
          return { access, refresh }
        } catch (error) {
          showToast("Échec de la connexion", "error")
          throw error.response?.data || { error: "Échec de la connexion" }
        }
      },

      // Inscription
      register: async (name, email, password) => {
        try {
          const res = await api.post("/auth/register", {
            name,
            email,
            password,
          })
          return res.data
        } catch (error) {
          throw error.response?.data || { error: "Erreur lors de l'inscription" }
        }
      },

      // Déconnexion
      logout: () => {
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          permissions: [],
          isAuthenticated: false,
        })
      },

      // Mise à jour des tokens (ex: refresh)
      updateTokens: (accessToken, refreshToken, decoded = null) => {
        const userData = {
          id: decoded?.user_id || null,
          email: decoded?.email || null,
          role: decoded?.role || "user",
        }

        set({
          user: userData,
          accessToken,
          refreshToken,
          isAuthenticated: true,
        })
      },

      // Vérification expiration
      checkAuth: () => {
        const token = get().accessToken
        if (!token) return

        try {
          const decoded = jwtDecode(token)
          const now = Date.now() / 1000
          if (decoded.exp && decoded.exp < now) {
            get().logout()
          }
        } catch (err) {
          console.error("Token invalide", err)
          get().logout()
        }
      },

      // Récupération profil via /me
      me: async () => {
        try {
          const res = await api.get("/auth/me")
          const user = res.data

          const mappedPermissions = user.permissions.map((p) => ({
            service_id: p.service_id,
            service: p.service,
            action: p.permission,
          }))

          set({
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
            },
            permissions: mappedPermissions,
            isAuthenticated: true,
          })
        } catch (error) {
          console.error("Erreur lors du chargement du profil :", error)
        }
      },

      // Vérifie si un utilisateur a une permission
      hasPermission: (service, action) => {
        const permissions = get().permissions
        return permissions.some(
          (perm) => perm.service_id === service && perm.action === action
        )
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
        permissions: state.permissions,
      }),
      onRehydrateStorage: () => (state) => {
        state.setHasHydrated()
      },
    }
  )
)

export default useAuthStore
