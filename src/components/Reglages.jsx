import { useState, useEffect } from 'react'
import useVelotafStore from '../stores/velotafStore'

export default function Reglages() {
  const { settings, updateSettings } = useVelotafStore()
  const [ouvert, setOuvert] = useState(false)
  const [valeurs, setValeurs] = useState({
    distanceKm: String(settings.distanceKm),
    consommationL100: String(settings.consommationL100),
    prixCarburantEuro: String(settings.prixCarburantEuro),
    indemniteJourEuro: String(settings.indemniteJourEuro),
  })
  const [sauvegarde, setSauvegarde] = useState(false)

  useEffect(() => {
    setValeurs({
      distanceKm: String(settings.distanceKm),
      consommationL100: String(settings.consommationL100),
      prixCarburantEuro: String(settings.prixCarburantEuro),
      indemniteJourEuro: String(settings.indemniteJourEuro),
    })
  }, [settings])

  const handleChange = (champ, valeur) => {
    setValeurs((v) => ({ ...v, [champ]: valeur }))
  }

  const handleSauvegarder = () => {
    updateSettings({
      distanceKm: Number(valeurs.distanceKm) || 0,
      consommationL100: Number(valeurs.consommationL100) || 0,
      prixCarburantEuro: Number(valeurs.prixCarburantEuro) || 0,
      indemniteJourEuro: Number(valeurs.indemniteJourEuro) || 0,
    })
    setSauvegarde(true)
    setTimeout(() => setSauvegarde(false), 2000)
  }

  return (
    <div className="border-t border-gray-100">
      <button
        onClick={() => setOuvert(!ouvert)}
        className="w-full p-4 text-left text-gray-500 text-sm flex justify-between items-center hover:bg-gray-50 transition-colors"
      >
        <span>⚙️ Réglages</span>
        <span>{ouvert ? '▲' : '▼'}</span>
      </button>

      {ouvert && (
        <div className="p-6 pt-0 space-y-4">
          <div>
            <label htmlFor="distanceKm" className="block text-sm font-medium text-gray-600 mb-1">
              Distance domicile-travail (km aller simple)
            </label>
            <input
              id="distanceKm"
              type="number"
              value={valeurs.distanceKm}
              onChange={(e) => handleChange('distanceKm', e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400"
              min="0"
              step="0.5"
            />
          </div>

          <div>
            <label htmlFor="consommationL100" className="block text-sm font-medium text-gray-600 mb-1">
              Consommation du véhicule (L/100km)
            </label>
            <input
              id="consommationL100"
              type="number"
              value={valeurs.consommationL100}
              onChange={(e) => handleChange('consommationL100', e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400"
              min="0"
              step="0.1"
            />
          </div>

          <div>
            <label htmlFor="prixCarburantEuro" className="block text-sm font-medium text-gray-600 mb-1">
              Prix du carburant (€/litre)
            </label>
            <input
              id="prixCarburantEuro"
              type="number"
              value={valeurs.prixCarburantEuro}
              onChange={(e) => handleChange('prixCarburantEuro', e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400"
              min="0"
              step="0.01"
            />
          </div>

<div>
  <label htmlFor="indemniteJourEuro" className="block text-sm font-medium text-gray-600 mb-1">
    Indemnité vélo versée par l'employeur (€/jour)
  </label>
  <input
    id="indemniteJourEuro"
    type="number"
    value={valeurs.indemniteJourEuro}
    onChange={(e) => handleChange('indemniteJourEuro', e.target.value)}
    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400"
    min="0"
    step="0.50"
  />
</div>

          <button
            onClick={handleSauvegarder}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl transition-colors"
          >
            {sauvegarde ? '✅ Sauvegardé !' : 'Sauvegarder'}
          </button>
        </div>
      )}
    </div>
  )
}