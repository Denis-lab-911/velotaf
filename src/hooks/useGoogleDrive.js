import { useState, useCallback } from 'react'
import useVelotafStore from '../stores/velotafStore'

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID
const SCOPES = 'https://www.googleapis.com/auth/drive.appdata'
const FILE_NAME = 'velotaf-data.json'

export default function useGoogleDrive() {
  const [connecte, setConnecte] = useState(false)
  const [chargement, setChargement] = useState(false)
  const [erreur, setErreur] = useState(null)
  const [tokenAcces, setTokenAcces] = useState(null)

  const { trajets, settings, updateSettings, enregistrerTrajet } = useVelotafStore()

  // Initialiser le client Google
  const seConnecter = useCallback(() => {
    setChargement(true)
    setErreur(null)

    const client = window.google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: SCOPES,
      callback: async (reponse) => {
        if (reponse.error) {
          setErreur('Erreur de connexion Google')
          setChargement(false)
          return
        }
        setTokenAcces(reponse.access_token)
        setConnecte(true)
        setChargement(false)
      },
    })

    client.requestAccessToken()
  }, [])

  // Rechercher le fichier velotaf-data.json dans Drive
  const trouverFichier = useCallback(async (token) => {
    const reponse = await fetch(
      `https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&q=name='${FILE_NAME}'`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
    const data = await reponse.json()
    return data.files?.[0]?.id || null
  }, [])

  // Lire les données depuis Drive
  const lireDepuisDrive = useCallback(async (token) => {
    setChargement(true)
    setErreur(null)
    try {
      const fileId = await trouverFichier(token)
      if (!fileId) {
        setChargement(false)
        return null
      }

      const reponse = await fetch(
        `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      const data = await reponse.json()
      setChargement(false)
      return data
    } catch (e) {
      setErreur('Erreur lors de la lecture des données')
      setChargement(false)
      return null
    }
  }, [trouverFichier])

  // Sauvegarder les données sur Drive
  const sauvegarderSurDrive = useCallback(async (token) => {
    if (!token) return
    try {
      const fileId = await trouverFichier(token)
      const contenu = JSON.stringify({ trajets, settings })

      if (fileId) {
        // Mettre à jour le fichier existant
        await fetch(
          `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=media`,
          {
            method: 'PATCH',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: contenu,
          }
        )
      } else {
        // Créer le fichier
        const metadata = {
          name: FILE_NAME,
          parents: ['appDataFolder'],
        }
        const form = new FormData()
        form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }))
        form.append('file', new Blob([contenu], { type: 'application/json' }))

        await fetch(
          'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
          {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
            body: form,
          }
        )
      }
    } catch (e) {
      setErreur('Erreur lors de la sauvegarde')
    }
  }, [trajets, settings, trouverFichier])

  // Synchroniser : lire depuis Drive et fusionner avec les données locales
  const synchroniser = useCallback(async () => {
    if (!tokenAcces) return
    setChargement(true)
    setErreur(null)

    try {
      const donneesDrive = await lireDepuisDrive(tokenAcces)

      if (donneesDrive) {
        // Fusionner les trajets (Drive + local, le plus récent gagne)
        const tousTrajets = { ...donneesDrive.trajets, ...trajets }
        Object.entries(tousTrajets).forEach(([date, statut]) => {
          enregistrerTrajet(date, statut)
        })
        if (donneesDrive.settings) {
          updateSettings(donneesDrive.settings)
        }
      }

      // Sauvegarder l'état fusionné sur Drive
      await sauvegarderSurDrive(tokenAcces)
      setChargement(false)
    } catch (e) {
      setErreur('Erreur de synchronisation')
      setChargement(false)
    }
  }, [tokenAcces, lireDepuisDrive, sauvegarderSurDrive, trajets, enregistrerTrajet, updateSettings])

  return {
    connecte,
    chargement,
    erreur,
    seConnecter,
    synchroniser,
    sauvegarderSurDrive: () => sauvegarderSurDrive(tokenAcces),
  }
}