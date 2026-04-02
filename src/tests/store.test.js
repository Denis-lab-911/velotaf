import { describe, it, expect, beforeEach } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import useVelotafStore from '../stores/velotafStore'

describe('VelotafStore', () => {
  beforeEach(() => {
  useVelotafStore.setState({
    trajets: {},
    settings: {
      distanceKm: 10,
      consommationL100: 6,
      prixCarburantEuro: 1.75,
      indemniteJourEuro: 3.00,
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
})