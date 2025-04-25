"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import useAuthStore from "@/store/auth-store"

export default function LoginPage() {
  const router = useRouter()
  const { login, isAuthenticated } = useAuthStore()

  const [formData, setFormData] = useState({ email: "", password: "" })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [authError, setAuthError] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: "" }))
    setAuthError(null)
  }

  const validate = () => {
    const newErrors = {}
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!formData.email) newErrors.email = "Email requis"
    else if (!emailRegex.test(formData.email)) newErrors.email = "Email invalide"

    if (!formData.password) newErrors.password = "Mot de passe requis"
    else if (formData.password.length < 6) newErrors.password = "Minimum 6 caractères"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)
    try {
      await login({ email: formData.email, password: formData.password })
      router.push("/")
    } catch (err) {
      setAuthError(err?.error || "Erreur lors de la connexion")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Connexion</h1>
          <p className="text-sm text-gray-500 mt-1">
            Entrez vos identifiants pour accéder à votre compte
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {authError && (
            <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">
              {authError}
            </div>
          )}

          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="nom@exemple.com"
              autoComplete="email"
              disabled={isSubmitting}
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Mot de passe</Label>
              <Link href="#" className="text-xs text-blue-600 hover:underline">
                Mot de passe oublié ?
              </Link>
            </div>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              autoComplete="current-password"
              disabled={isSubmitting}
            />
            {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
          </div>

          <Button type="submit" className="w-full mt-4" disabled={isSubmitting}>
            {isSubmitting ? "Connexion..." : "Se connecter"}
          </Button>
        </form>

        <div className="text-center text-sm text-gray-600">
          Vous n’avez pas de compte ?{" "}
          <Link href="/register" className="text-blue-600 hover:underline">
            S’inscrire
          </Link>
        </div>
      </div>
    </div>
  )
}
