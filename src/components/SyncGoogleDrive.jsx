import { useEffect } from 'react'
import useGoogleDrive from '../hooks/useGoogleDrive'

export default function SyncGoogleDrive() {
  const { connecte, chargement, erreur, seConnecter, synchroniser } = useGoogleDrive()

  // Charger le script Google Identity Services
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    document.body.appendChild(script)
    return () => document.body.removeChild(script)
  }, [])

  return (
    <div className="border-t border-gray-100 p-4">
      {!connecte ? (
        <button
          onClick={seConnecter}
          disabled={chargement}
          className="w-full flex items-center justify-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 font-medium py-3 rounded-xl shadow-sm transition-colors"
        >
          {chargement ? (
            <span className="animate-spin">⏳</span>
          ) : (
            <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="Google" />
          )}
          {chargement ? 'Connexion...' : 'Connecter Google Drive'}
        </button>
      ) : (
        <div className="flex items-center justify-between">
          <span className="text-sm text-green-600 font-medium">✅ Google Drive connecté</span>
          <button
            onClick={synchroniser}
            disabled={chargement}
            className="text-sm bg-green-50 hover:bg-green-100 text-green-700 font-medium px-4 py-2 rounded-lg transition-colors"
          >
            {chargement ? '⏳' : '🔄 Synchroniser'}
          </button>
        </div>
      )}
      {erreur && (
        <p className="text-red-500 text-xs mt-2 text-center">{erreur}</p>
      )}
    </div>
  )
}