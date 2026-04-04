import { describe, it, expect, beforeEach } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import useVelotafStore from '../stores/velotafStore'

describe('velo_bouloStore', () => {
  beforeEach(() => {
  useVelotafStore.setState({
    trajets: {},
    settings: {
      distanceKm: 10,
      consommationL100: 6,
      prixCarburantEuro: 1.75,
      indemniteType: 'jour',
      indemniteJourEuro: 3.00,
      indemniteKmEuro: 0.25,
      indemnitePlafondEuro: 20,
      statsPeriod: 'annee',
    },
  })
})

  it('devrait enregistrer un trajet vélo', () => {
    const { result } = renderHook(() => useVelotafStore())
    act(() => {
      result.current.enregistrerTrajet('2026-03-30', 'velo')
    })
    expect(result.current.trajets['2026-03-30']).toBe('velo')
  })

  it('devrait enregistrer une raison absence', () => {
    const { result } = renderHook(() => useVelotafStore())
    act(() => {
      result.current.enregistrerTrajet('2026-03-30', 'meteo')
    })
    expect(result.current.trajets['2026-03-30']).toBe('meteo')
  })

  it('devrait supprimer un trajet', () => {
    const { result } = renderHook(() => useVelotafStore())
    act(() => {
      result.current.enregistrerTrajet('2026-03-30', 'velo')
      result.current.supprimerTrajet('2026-03-30')
    })
    expect(result.current.trajets['2026-03-30']).toBeUndefined()
  })

  it('devrait calculer le bon pourcentage vélo', () => {
    const { result } = renderHook(() => useVelotafStore())
    act(() => {
      result.current.enregistrerTrajet('2026-03-30', 'velo')
      result.current.enregistrerTrajet('2026-03-31', 'velo')
      result.current.enregistrerTrajet('2026-04-01', 'meteo')
      result.current.enregistrerTrajet('2026-04-02', 'fatigue')
    })
    const stats = result.current.getStats()
    expect(stats.pourcentageVelo).toBe(50)
    expect(stats.joursVelo).toBe(2)
    expect(stats.joursTotal).toBe(4)
  })

  it('devrait calculer le carburant économisé', () => {
    const { result } = renderHook(() => useVelotafStore())
    act(() => {
      // 1 jour vélo, 10km aller+retour = 20km
      // 20km * 6L/100 = 1.2L * 1.75€ = 2.10€
      result.current.enregistrerTrajet('2026-03-30', 'velo')
    })
    const stats = result.current.getStats()
    expect(stats.carburantEconomiseEuro).toBe(2.10)
  })

it("devrait calculer l'indemnité journalière", () => {
  const { result } = renderHook(() => useVelotafStore())
  act(() => {
    // 1 jour vélo * 3€/jour = 3€
    result.current.enregistrerTrajet('2026-03-30', 'velo')
  })
  const stats = result.current.getStats()
  expect(stats.indemniteTotaleEuro).toBe(3)
})

  it('devrait mettre à jour les paramètres', () => {
    const { result } = renderHook(() => useVelotafStore())
    act(() => {
      result.current.updateSettings({ distanceKm: 15 })
    })
    expect(result.current.settings.distanceKm).toBe(15)
    expect(result.current.settings.consommationL100).toBe(6) // inchangé
  })

  it('devrait normaliser les paramètres mal formatés (015 -> 15)', () => {
    const { result } = renderHook(() => useVelotafStore())
    act(() => {
      result.current.updateSettings({ distanceKm: '015', consommationL100: '06.0' })
    })
    expect(result.current.settings.distanceKm).toBe(15)
    expect(result.current.settings.consommationL100).toBe(6)
  })

  it('devrait conserver statsPeriod en chaîne de caractères', () => {
    const { result } = renderHook(() => useVelotafStore())
    act(() => {
      result.current.updateSettings({ statsPeriod: 'mois' })
    })
    expect(result.current.settings.statsPeriod).toBe('mois')
  })

  it('devrait permettre de configurer indemnité km avec plafond', () => {
    const { result } = renderHook(() => useVelotafStore())
    act(() => {
      result.current.updateSettings({ indemniteType: 'km', indemniteKmEuro: 0.5, indemnitePlafondEuro: 10 })
      result.current.enregistrerTrajet('2026-03-30', 'velo')
      result.current.enregistrerTrajet('2026-03-31', 'velo')
    })
    const stats = result.current.getStats('annee')
    expect(result.current.settings.indemniteType).toBe('km')
    expect(result.current.settings.indemniteKmEuro).toBe(0.5)
    expect(result.current.settings.indemnitePlafondEuro).toBe(10)
    // 2 jours, 10km aller simple => 40km total par jour -> 20€ par jour -> plafonnée à 10€ par jour -> total 20€
    expect(stats.indemniteTotaleEuro).toBe(20)
  })

  it('devrait laisser aucun indemnité quand selectionné aucune', () => {
    const { result } = renderHook(() => useVelotafStore())
    act(() => {
      result.current.updateSettings({ indemniteType: 'aucune' })
      result.current.enregistrerTrajet('2026-03-30', 'velo')
      result.current.enregistrerTrajet('2026-03-31', 'velo')
    })
    const stats = result.current.getStats('annee')
    expect(stats.indemniteTotaleEuro).toBe(0)
  })

  it('devrait exclure congés/télétravail du % vélo', () => {
    const { result } = renderHook(() => useVelotafStore())
    const year = new Date().getFullYear()
    act(() => {
      result.current.enregistrerTrajet(`${year}-03-30`, 'velo')
      result.current.enregistrerTrajet(`${year}-03-31`, 'teletravail')
      result.current.enregistrerTrajet(`${year}-04-01`, 'conges')
      result.current.enregistrerTrajet(`${year}-04-02`, 'meteo')
    })
    const stats = result.current.getStats('annee')
    expect(stats.joursTotal).toBe(4)
    expect(stats.joursNonDeplacement).toBe(2)
    expect(stats.joursComptes).toBe(2)
    expect(stats.pourcentageVelo).toBe(50)
  })

  it('devrait gérer la période mois', () => {
    const { result } = renderHook(() => useVelotafStore())
    const date = new Date()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    act(() => {
      result.current.enregistrerTrajet(`${year}-${month}-01`, 'velo')
      result.current.enregistrerTrajet(`${year}-${month}-02`, 'meteo')
      result.current.enregistrerTrajet(`${year}-${month}-03`, 'teletravail')
    })
    const statsMois = result.current.getStats('mois')
    expect(statsMois.joursTotal).toBe(3)
    expect(statsMois.joursNonDeplacement).toBe(1)
    expect(statsMois.pourcentageVelo).toBe(50)
    expect(statsMois.distanceTotaleKm).toBe(20)
  })

  it('devrait calculer les économies totales (carburant + indemnité) et le CO2 économisé', () => {
    const { result } = renderHook(() => useVelotafStore())
    act(() => {
      // 1 jour vélo, 10km aller+retour = 20km
      // 20km * 6L/100 = 1.2L * 1.75€ = 2.10€ carburant
      // 1 jour * 3€/jour = 3€ indemnité
      // Total = 2.10€ + 3€ = 5.10€
      // CO2 = 1.2L * 2.37 = 2.844kg ~ 2.8
      result.current.enregistrerTrajet('2026-03-30', 'velo')
    })
    const stats = result.current.getStats()
    expect(stats.carburantEconomiseEuro).toBe(2.10)
    expect(stats.indemniteTotaleEuro).toBe(3)
    expect(stats.economiesTotal).toBe(5.10)
    expect(stats.co2EconomiseKg).toBe(2.8)
  })
})