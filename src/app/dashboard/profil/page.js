'use client'

import useAuthStore from '@/store/auth-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useEffect, useState } from 'react'
import { authApi } from '@/lib/api'

export default function ProfilPage() {
  const { user } = useAuthStore()
  const [documents, setDocuments] = useState([])

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const res = await authApi.get('/auth/me/documents')
        setDocuments(res.data)
      } catch (err) {
        console.error("Erreur récupération documents", err)
      }
    }

    fetchDocuments()
  }, [])

  if (!user) return <div>Chargement...</div>

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Mon profil</h1>

      <div className="space-y-4 mb-8">
        <div>
          <Label>Nom complet</Label>
          <Input value={`${user.first_name || ''} ${user.last_name || ''}`} disabled />
        </div>

        <div>
          <Label>Email</Label>
          <Input value={user.email} disabled />
        </div>

        <div>
          <Label>Téléphone</Label>
          <Input value={user.telephone || 'Non renseigné'} disabled />
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-2">Mes documents</h2>
        {documents.length > 0 ? (
          <ul className="space-y-2">
            {documents.map((doc) => (
              <li
                key={doc.id}
                className="bg-gray-100 p-3 rounded flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold">{doc.label}</p>
                  {doc.numero && <p className="text-sm text-gray-600">Numéro : {doc.numero}</p>}
                </div>
                {doc.fichier && (
                  <a
                    href={doc.fichier}
                    target="_blank"
                    className="text-blue-600 text-sm hover:underline"
                  >
                    Voir fichier
                  </a>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">Aucun document enregistré</p>
        )}
      </div>

      <Button disabled>Mettre à jour mon profil (bientôt)</Button>
    </div>
  )
}
