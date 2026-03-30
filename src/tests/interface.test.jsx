import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import BoutonTrajet from '../components/BoutonTrajet'
import Statistiques from '../components/Statistiques'
import Reglages from '../components/Reglages'
import useVelotafStore from '../stores/velotafStore'

// On simule la date d'aujourd'hui pour que ce soit toujours un jour ouvré
vi.mock('../utils/joursFeries', () => ({
  aujourdhui: () => '2026-03-30',
  estJourOuvre: () => true,
}))

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

describe('BoutonTrajet', () => {
  it('devrait afficher les deux boutons principaux', () => {
    render(<BoutonTrajet />)
    expect(screen.getByText(/Oui/)).toBeInTheDocument()
    expect(screen.getByText(/Non/)).toBeInTheDocument()
  })

  it('devrait afficher le message de succès après clic sur Oui', () => {
    render(<BoutonTrajet />)
    fireEvent.click(screen.getByText(/Oui/))
    expect(screen.getByText(/Bravo/)).toBeInTheDocument()
  })

  it('devrait afficher les raisons après clic sur Non', () => {
    render(<BoutonTrajet />)
    fireEvent.click(screen.getByText(/Non/))
    expect(screen.getByText(/Télétravail/)).toBeInTheDocument()
    expect(screen.getByText(/Météo/)).toBeInTheDocument()
    expect(screen.getByText(/Congés/)).toBeInTheDocument()
  })

  it('devrait enregistrer une raison et afficher la confirmation', () => {
    render(<BoutonTrajet />)
    fireEvent.click(screen.getByText(/Non/))
    fireEvent.click(screen.getByText(/Météo/))
    expect(screen.getByText(/Météo/)).toBeInTheDocument()
    expect(screen.queryByText(/Oui/)).not.toBeInTheDocument()
  })

  it('devrait permettre de corriger un trajet', () => {
    render(<BoutonTrajet />)
    fireEvent.click(screen.getByText(/Oui/))
    fireEvent.click(screen.getByText(/Corriger/))
    expect(screen.getByText(/Oui/)).toBeInTheDocument()
  })

  it('devrait revenir à l\'accueil avec le bouton Retour', () => {
    render(<BoutonTrajet />)
    fireEvent.click(screen.getByText(/Non/))
    fireEvent.click(screen.getByText(/Retour/))
    expect(screen.getByText(/Oui/)).toBeInTheDocument()
  })
})

describe('Statistiques', () => {
  it('devrait afficher 0% quand aucun trajet enregistré', () => {
    render(<Statistiques />)
    expect(screen.getByText('0%')).toBeInTheDocument()
  })

  it('devrait afficher le bon pourcentage après un trajet vélo', () => {
    useVelotafStore.setState({
      trajets: { '2026-03-30': 'velo' },
      settings: {
        distanceKm: 10,
        consommationL100: 6,
        prixCarburantEuro: 1.75,
        indemniteJourEuro: 3.00,
      },
    })
    render(<Statistiques />)
    expect(screen.getByText('100%')).toBeInTheDocument()
  })
})

describe('Reglages', () => {
  it('devrait afficher le bouton réglages', () => {
    render(<Reglages />)
    expect(screen.getByText(/Réglages/)).toBeInTheDocument()
  })

  it('devrait ouvrir le panneau au clic', () => {
    render(<Reglages />)
    fireEvent.click(screen.getByText(/Réglages/))
    expect(screen.getByText(/Distance domicile-travail/)).toBeInTheDocument()
  })

  it('devrait afficher le bouton Sauvegarder quand ouvert', () => {
    render(<Reglages />)
    fireEvent.click(screen.getByText(/Réglages/))
    expect(screen.getByText(/Sauvegarder/)).toBeInTheDocument()
  })
})