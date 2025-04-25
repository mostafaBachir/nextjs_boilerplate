'use client'
import { Toaster } from 'sonner'
import ClientGuard from "@/components/middleware/ClientGuard"
import './globals.css'

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>
        <ClientGuard>{children}</ClientGuard>
        <Toaster richColors position="top-right" />

      </body>
    </html>
  )
}