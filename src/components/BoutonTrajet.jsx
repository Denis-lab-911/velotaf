import useVelotafStore from '../stores/velotafStore'
import { aujourdhui, estJourOuvre } from '../utils/joursFeries'
import { useState } from 'react'

const RAISONS = [
  { id: 'teletravail', label: '🏠 Télétravail' },
  { id: 'conges', label: '🌴 Congés' },
  { id: 'meteo', label: '🌧️ Météo' },
  { id: 'agenda', label: '📅 Agenda' },
  { id: 'fatigue', label: '😴 Fatigue' },
  { id: 'autre', label: '🤷 Autre' },
]

const MESSAGES_FELICITATIONS = [
  'Bravo !',
  'C\'est gagné !',
  'Well done !',
  'Amazing !',
  'Super !',
  'Top !',
  'Excellent !',
  'Chapeau !',
  'Youhou !',
  'C\'est parti !',
  'Belle journée en perspective !',
]

const getMessageFelicitation = () => {
  return MESSAGES_FELICITATIONS[Math.floor(Math.random() * MESSAGES_FELICITATIONS.length)]
}

export default function BoutonTrajet() {
  const { trajets, enregistrerTrajet, supprimerTrajet } = useVelotafStore()
  const [etape, setEtape] = useState('accueil') // accueil | raison
  const [messageFelicitation] = useState(getMessageFelicitation)
  const date = aujourdhui()
  const trajetDuJour = trajets[date]

  if (!estJourOuvre(date)) {
    return (
      <div className="text-center p-8">
        <span className="text-5xl">🛋️</span>
        <p className="text-gray-500 mt-4 text-lg">C'est un jour non ouvré,<br />profitez-en !</p>
      </div>
    )
  }

  // Trajet déjà enregistré
  if (trajetDuJour) {
    return (
      <div className="text-center p-8">
        {trajetDuJour === 'velo' ? (
          <>
            <span className="text-6xl">🚴</span>
            <p className="text-green-700 font-bold text-xl mt-4">{messageFelicitation}</p>
          </>
        ) : (
          <>
            <span className="text-5xl">🚗</span>
            <p className="text-gray-600 font-bold text-xl mt-4">
              {RAISONS.find((r) => r.id === trajetDuJour)?.label}
            </p>
          </>
        )}
        <button
          onClick={() => { supprimerTrajet(date); setEtape('accueil') }}
          className="mt-6 text-sm text-gray-400 underline"
        >
          Corriger
        </button>
      </div>
    )
  }

  // Étape 1 : choix principal
  if (etape === 'accueil') {
    return (
      <div className="text-center p-8">
        <p className="text-gray-600 text-lg mb-8">Aujourd'hui, vous avez pris le vélo ?</p>
        <div className="flex flex-col gap-4">
          <button
            onClick={() => enregistrerTrajet(date, 'velo')}
            className="bg-green-500 hover:bg-green-600 text-white text-xl font-bold py-6 rounded-2xl shadow-lg transition-colors"
          >
            🚴 Oui !
          </button>
          <button
            onClick={() => setEtape('raison')}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xl font-bold py-6 rounded-2xl shadow-lg transition-colors"
          >
            🚗 Non
          </button>
        </div>
      </div>
    )
  }

  // Étape 2 : choix de la raison
  return (
    <div className="text-center p-8">
      <p className="text-gray-600 text-lg mb-6">Pourquoi ?</p>
      <div className="grid grid-cols-2 gap-3">
        {RAISONS.map((raison) => (
          <button
            key={raison.id}
            onClick={() => enregistrerTrajet(date, raison.id)}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-4 rounded-xl shadow transition-colors"
          >
            {raison.label}
          </button>
        ))}
      </div>
      <button
        onClick={() => setEtape('accueil')}
        className="mt-6 text-sm text-gray-400 underline"
      >
        ← Retour
      </button>
    </div>
  )
}