import { describe, it, expect } from 'vitest'
import { getJoursFeries, estJourOuvre } from '../utils/joursFeries'

describe('Jours fériés français', () => {
  it('devrait contenir 11 jours fériés en 2026', () => {
    expect(getJoursFeries(2026)).toHaveLength(11)
  })

  it('le 1er janvier 2026 devrait être férié', () => {
    expect(getJoursFeries(2026)).toContain('2026-01-01')
  })

  it('le 25 décembre 2026 devrait être férié', () => {
    expect(getJoursFeries(2026)).toContain('2026-12-25')
  })

  it('le samedi ne devrait pas être un jour ouvré', () => {
    expect(estJourOuvre('2026-03-28')).toBe(false)
  })

  it('le dimanche ne devrait pas être un jour ouvré', () => {
    expect(estJourOuvre('2026-03-29')).toBe(false)
  })

  it('le lundi 30 mars 2026 devrait être un jour ouvré', () => {
    expect(estJourOuvre('2026-03-30')).toBe(true)
  })

  it('le 1er mai 2026 ne devrait pas être un jour ouvré', () => {
    expect(estJourOuvre('2026-05-01')).toBe(false)
  })
})