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
import { getJoursOuvresDuMois, getTousLesJoursDuMois, getNomMois } from '../utils/joursFeries'

describe('Utilitaires du mois', () => {
  it('devrait retourner le bon nombre de jours ouvrés en mars 2026', () => {
    // Mars 2026 : 31 jours, 4 week-ends complets = 22 jours ouvrés (pas de férié)
    expect(getJoursOuvresDuMois(2026, 2)).toHaveLength(22)
  })

it('devrait retourner le bon nombre de jours ouvrés en mai 2026', () => {
  // Mai 2026 : 1er mai + 8 mai + Ascension 14 mai + Pentecôte 25 mai = 4 fériés
  expect(getJoursOuvresDuMois(2026, 4)).toHaveLength(17)
})

  it('devrait retourner 31 jours pour mars 2026', () => {
    expect(getTousLesJoursDuMois(2026, 2)).toHaveLength(31)
  })

  it('devrait retourner 28 jours pour février 2026', () => {
    expect(getTousLesJoursDuMois(2026, 1)).toHaveLength(28)
  })

  it('devrait retourner le nom du mois en français', () => {
    expect(getNomMois(2026, 2)).toContain('mars')
    expect(getNomMois(2026, 0)).toContain('janvier')
  })
})