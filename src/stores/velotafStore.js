import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useVelotafStore = create(
  persist(
    (set, get) => ({
      settings: {
        distanceKm: 10,
        consommationL100: 6,
        prixCarburantEuro: 1.75,
        indemniteType: 'jour', // 'jour' | 'km' | 'aucune'
        indemniteJourEuro: 3.00,
        indemniteKmEuro: 0.25,
        indemnitePlafondEuro: 20,
        statsPeriod: 'annee',
      },

      trajets: {},

      updateSettings: (newSettings) => {
        const numericKeys = ['distanceKm', 'consommationL100', 'prixCarburantEuro', 'indemniteJourEuro', 'indemniteKmEuro', 'indemnitePlafondEuro']
        const normalizedSettings = Object.entries(newSettings).reduce((acc, [key, value]) => {
          if (numericKeys.includes(key)) {
            if (typeof value === 'string') {
              const parsed = Number(value)
              acc[key] = Number.isNaN(parsed) ? 0 : parsed
            } else if (typeof value === 'number') {
              acc[key] = value
            } else {
              acc[key] = value
            }
          } else {
            // Keep raw value for non-numeric fields (e.g., statsPeriod)
            acc[key] = value
          }
          return acc
        }, {})

        set((state) => ({
          settings: { ...state.settings, ...normalizedSettings },
        }))
      },

      enregistrerTrajet: (date, statut) =>
        set((state) => ({
          trajets: { ...state.trajets, [date]: statut },
        })),

      supprimerTrajet: (date) =>
        set((state) => {
          const newTrajets = { ...state.trajets }
          delete newTrajets[date]
          return { trajets: newTrajets }
        }),

      getStats: (periode = null) => {
        const { trajets, settings } = get()
        const {
          distanceKm,
          consommationL100,
          prixCarburantEuro,
          indemniteType,
          indemniteJourEuro,
          indemniteKmEuro,
          indemnitePlafondEuro,
          statsPeriod,
        } = settings

        const period = periode || statsPeriod || 'annee'
        const now = new Date()
        const yearNow = now.getFullYear()
        const monthNow = now.getMonth()

        const trajetsFiltres = Object.entries(trajets).filter(([dateStr]) => {
          const d = new Date(dateStr)
          if (Number.isNaN(d.getTime())) return false
          if (period === 'mois') {
            return d.getFullYear() === yearNow && d.getMonth() === monthNow
          }
          return d.getFullYear() === yearNow
        })

        const joursVelo = trajetsFiltres.filter(([_, statut]) => statut === 'velo').length
        const joursNonDeplacement = trajetsFiltres.filter(
          ([_, statut]) => statut === 'conges' || statut === 'teletravail'
        ).length
        const joursComptes = Math.max(0, trajetsFiltres.length - joursNonDeplacement)

        const pourcentageVelo = joursComptes > 0
          ? Math.round((joursVelo / joursComptes) * 100)
          : 0

        const distanceTotaleKm = joursVelo * distanceKm * 2
        const carburantEconomiseL = (distanceTotaleKm * consommationL100) / 100
        const carburantEconomiseEuro = carburantEconomiseL * prixCarburantEuro

        let indemniteTotaleEuro = 0
        if (indemniteType === 'jour') {
          indemniteTotaleEuro = joursVelo * indemniteJourEuro
        } else if (indemniteType === 'km') {
          const distanceParTrajet = distanceKm * 2
          const indemniteParTrajet = Math.min(distanceParTrajet * indemniteKmEuro, indemnitePlafondEuro > 0 ? indemnitePlafondEuro : Infinity)
          indemniteTotaleEuro = joursVelo * indemniteParTrajet
        }

        const co2EconomiseKg = carburantEconomiseL * 2.37
        const economiesTotal = carburantEconomiseEuro + indemniteTotaleEuro

        return {
          joursVelo,
          joursTotal: trajetsFiltres.length,
          joursNonDeplacement,
          joursComptes,
          pourcentageVelo,
          distanceTotaleKm: Math.round(distanceTotaleKm * 10) / 10,
          carburantEconomiseL: Math.round(carburantEconomiseL * 10) / 10,
          carburantEconomiseEuro: Math.round(carburantEconomiseEuro * 100) / 100,
          indemniteTotaleEuro: Math.round(indemniteTotaleEuro * 100) / 100,
          co2EconomiseKg: Math.round(co2EconomiseKg * 10) / 10,
          economiesTotal: Math.round(economiesTotal * 100) / 100,
        }
      },
    }),
    {
      name: 'velotaf-storage',
    }
  )
)

export default useVelotafStore