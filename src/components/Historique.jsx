import { useState } from 'react'
import useVelotafStore from '../stores/velotafStore'
import {
  aujourdhui,
  estJourOuvre,
  getJoursOuvresDuMois,
  getTousLesJoursDuMois,
  getNomMois,
  getJoursFeries,
} from '../utils/joursFeries'

const RAISONS = [
  { id: 'velo', label: '🚴 Vélo' },
  { id: 'teletravail', label: '🏠 Télétravail' },
  { id: 'conges', label: '🌴 Congés' },
  { id: 'meteo', label: '🌧️ Météo' },
  { id: 'agenda', label: '📅 Agenda' },
  { id: 'fatigue', label: '😴 Fatigue' },
  { id: 'autre', label: '🤷 Autre' },
]

const JOURS_SEMAINE = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']

function statutLabel(statut) {
  return RAISONS.find((r) => r.id === statut)?.label || '—'
}

function statutCouleur(statut) {
  if (!statut) return 'bg-gray-100 text-gray-400'
  if (statut === 'velo') return 'bg-green-100 text-green-700'
  return 'bg-orange-100 text-orange-700'
}

export default function Historique() {
  const { trajets, enregistrerTrajet, supprimerTrajet } = useVelotafStore()
  const today = aujourdhui()
  const now = new Date()

  const [ouvert, setOuvert] = useState(false)
  const [annee, setAnnee] = useState(now.getFullYear())
  const [mois, setMois] = useState(now.getMonth())
  const [vue, setVue] = useState('calendrier') // calendrier | liste
  const [editionDate, setEditionDate] = useState(null)

  const joursOuvres = getJoursOuvresDuMois(annee, mois)
  const tousLesJours = getTousLesJoursDuMois(annee, mois)
  const feries = getJoursFeries(annee)

  const moisPrecedent = () => {
    if (mois === 0) { setMois(11); setAnnee(annee - 1) }
    else setMois(mois - 1)
  }

  const moisSuivant = () => {
    if (mois === 11) { setMois(0); setAnnee(annee + 1) }
    else setMois(mois + 1)
  }

  const handleEdition = (date, statut) => {
    if (statut) {
      enregistrerTrajet(date, statut)
    } else {
      supprimerTrajet(date)
    }
    setEditionDate(null)
  }

  // Calcul du premier jour du mois (0=dim, 1=lun...)
  const premierJour = new Date(annee, mois, 1).getDay()
  // Décalage pour commencer la semaine le lundi
  const decalage = premierJour === 0 ? 6 : premierJour - 1

  return (
    <div className="border-t border-gray-100">
      {/* Bouton repli/dépli */}
      <button
        onClick={() => setOuvert(!ouvert)}
        className="w-full p-4 text-left text-gray-500 text-sm flex justify-between items-center hover:bg-gray-50 transition-colors"
      >
        <span>📅 Historique</span>
        <span>{ouvert ? '▲' : '▼'}</span>
      </button>

      {ouvert && (
        <>
          {/* En-tête navigation */}
          <div className="p-4 flex items-center justify-between">
            <button onClick={moisPrecedent} className="text-gray-400 hover:text-gray-600 text-xl px-2">‹</button>
            <span className="font-semibold text-gray-700 capitalize">{getNomMois(annee, mois)}</span>
            <button onClick={moisSuivant} className="text-gray-400 hover:text-gray-600 text-xl px-2">›</button>
          </div>

          {/* Sélecteur de vue */}
          <div className="px-4 pb-3 flex gap-2">
            <button
              onClick={() => setVue('calendrier')}
              className={`flex-1 py-1.5 rounded-lg text-sm font-medium transition-colors ${vue === 'calendrier' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-500'}`}
            >
              📅 Calendrier
            </button>
            <button
              onClick={() => setVue('liste')}
              className={`flex-1 py-1.5 rounded-lg text-sm font-medium transition-colors ${vue === 'liste' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-500'}`}
            >
              📋 Liste
            </button>
          </div>

          {/* Vue calendrier */}
          {vue === 'calendrier' && (
            <div className="px-4 pb-4">
              <div className="grid grid-cols-7 mb-1">
                {JOURS_SEMAINE.map((j) => (
                  <div key={j} className="text-center text-xs text-gray-400 font-medium py-1">{j}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: decalage }).map((_, i) => (
                  <div key={`vide-${i}`} />
                ))}
                {tousLesJours.map((dateStr) => {
                  const jour = parseInt(dateStr.split('-')[2])
                  const estOuvre = estJourOuvre(dateStr)
                  const estFerie = feries.includes(dateStr)
                  const statut = trajets[dateStr]
                  const estAujourdhui = dateStr === today
                  const estFutur = dateStr > today

                  return (
                    <button
                      key={dateStr}
                      onClick={() => estOuvre && !estFutur && setEditionDate(dateStr)}
                      disabled={!estOuvre || estFutur}
                      className={`
                        aspect-square rounded-lg text-xs font-medium flex items-center justify-center transition-colors
                        ${estAujourdhui ? 'ring-2 ring-green-400' : ''}
                        ${!estOuvre ? 'text-gray-300' : ''}
                        ${estFutur && estOuvre ? 'text-gray-300' : ''}
                        ${estOuvre && !estFutur ? statutCouleur(statut) : ''}
                        ${estOuvre && !estFutur ? 'cursor-pointer hover:opacity-80' : 'cursor-default'}
                      `}
                    >
                      {jour}
                    </button>
                  )
                })}
              </div>
              <div className="flex gap-3 mt-3 justify-center text-xs text-gray-400">
                <span><span className="inline-block w-3 h-3 rounded bg-green-100 mr-1" />Vélo</span>
                <span><span className="inline-block w-3 h-3 rounded bg-orange-100 mr-1" />Absent</span>
                <span><span className="inline-block w-3 h-3 rounded bg-gray-100 mr-1" />Non renseigné</span>
              </div>
            </div>
          )}

          {/* Vue liste */}
          {vue === 'liste' && (
            <div className="px-4 pb-4 space-y-2">
              {joursOuvres.length === 0 && (
                <p className="text-center text-gray-400 text-sm py-4">Aucun jour ouvré ce mois-ci</p>
              )}
              {[...joursOuvres].reverse().map((dateStr) => {
                const statut = trajets[dateStr]
                const estFutur = dateStr > today
                const date = new Date(dateStr)
                const libelle = date.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })

                return (
                  <div key={dateStr} className="flex items-center justify-between py-2 border-b border-gray-50">
                    <span className={`text-sm ${estFutur ? 'text-gray-300' : 'text-gray-600'}`}>
                      {libelle}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${estFutur ? 'bg-gray-50 text-gray-300' : statutCouleur(statut)}`}>
                        {estFutur ? '—' : (statut ? statutLabel(statut) : 'Non renseigné')}
                      </span>
                      {!estFutur && (
                        <button
                          onClick={() => setEditionDate(dateStr)}
                          className="text-gray-300 hover:text-gray-500 text-xs"
                        >
                          ✏️
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Modal d'édition */}
          {editionDate && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-end justify-center z-50">
              <div className="bg-white rounded-t-2xl w-full max-w-sm p-6">
                <p className="text-center font-semibold text-gray-700 mb-4">
                  {new Date(editionDate).toLocaleDateString('fr-FR', {
                    weekday: 'long', day: 'numeric', month: 'long'
                  })}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {RAISONS.map((raison) => (
                    <button
                      key={raison.id}
                      onClick={() => handleEdition(editionDate, raison.id)}
                      className={`py-3 rounded-xl text-sm font-medium transition-colors
                        ${trajets[editionDate] === raison.id
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                      {raison.label}
                    </button>
                  ))}
                </div>
                {trajets[editionDate] && (
                  <button
                    onClick={() => handleEdition(editionDate, null)}
                    className="w-full mt-3 py-2 text-sm text-red-400 hover:text-red-600"
                  >
                    🗑️ Supprimer ce trajet
                  </button>
                )}
                <button
                  onClick={() => setEditionDate(null)}
                  className="w-full mt-2 py-2 text-sm text-gray-400 hover:text-gray-600"
                >
                  Annuler
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}