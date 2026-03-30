import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useVelotafStore = create(
  persist(
    (set, get) => ({
      settings: {
        distanceKm: 10,
        consommationL100: 6,
        prixCarburantEuro: 1.75,
        indemniteJourEuro: 3.00,
      },

      trajets: {},

      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),

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

      getStats: () => {
        const { trajets, settings } = get()
        const { distanceKm, consommationL100, prixCarburantEuro, indemniteJourEuro } = settings

        const tousLesTrajets = Object.values(trajets)
        const joursVelo = tousLesTrajets.filter((s) => s === 'velo').length
        const joursTotal = tousLesTrajets.length

        const pourcentageVelo = joursTotal > 0
          ? Math.round((joursVelo / joursTotal) * 100)
          : 0

        const distanceTotaleKm = joursVelo * distanceKm * 2
        const carburantEconomiseL = (distanceTotaleKm * consommationL100) / 100
        const carburantEconomiseEuro = carburantEconomiseL * prixCarburantEuro
        const indemniteTotaleEuro = joursVelo * indemniteJourEuro

        return {
          joursVelo,
          joursTotal,
          pourcentageVelo,
          carburantEconomiseL: Math.round(carburantEconomiseL * 10) / 10,
          carburantEconomiseEuro: Math.round(carburantEconomiseEuro * 100) / 100,
          indemniteTotaleEuro: Math.round(indemniteTotaleEuro * 100) / 100,
        }
      },
    }),
    {
      name: 'velotaf-storage',
    }
  )
)

export default useVelotafStore