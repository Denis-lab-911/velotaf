import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import BoutonTrajet from '../components/BoutonTrajet'
import Statistiques from '../components/Statistiques'
import Reglages from '../components/Reglages'
import useVelotafStore from '../stores/velotafStore'

// On simule la date d'aujourd'hui pour que ce soit toujours un jour ouvré
vi.mock('../utils/joursFeries', async (importOriginal) => {
  const original = await importOriginal()
  return {
    ...original,
    aujourdhui: () => '2026-03-30',
    estJourOuvre: (dateStr) => {
      const date = new Date(dateStr)
      const jour = date.getDay()
      return jour !== 0 && jour !== 6
    },
  }
})

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

  it('devrait sauvegarder distance en nombre normalisé et sans 0 initiaux', () => {
    render(<Reglages />)
    fireEvent.click(screen.getByText(/Réglages/))

    const distanceInput = screen.getByRole('spinbutton', { name: /Distance domicile-travail/i })
    fireEvent.change(distanceInput, { target: { value: '015' } })

    fireEvent.click(screen.getByText(/Sauvegarder/))

    expect(useVelotafStore.getState().settings.distanceKm).toBe(15)
    expect(distanceInput.value).toBe('15')
  })

  it('devrait cacher la tuile indemnité si l’utilisateur choisit sans indemnité', () => {
    render(<Reglages />)
    fireEvent.click(screen.getByText(/Réglages/))
    fireEvent.change(screen.getByLabelText(/Type d'indemnité vélo/i), { target: { value: 'aucune' } })
    fireEvent.click(screen.getByText(/Sauvegarder/))

    render(<Statistiques />)
    expect(screen.queryByText(/Indemnité vélo/)).not.toBeInTheDocument()
  })
})
import Historique from '../components/Historique'

describe('Historique', () => {
  it('devrait afficher le bouton Historique replié par défaut', () => {
    render(<Historique />)
    expect(screen.getByText(/Historique/)).toBeInTheDocument()
    expect(screen.queryByText(/Calendrier/)).not.toBeInTheDocument()
  })

  it('devrait afficher les boutons Calendrier et Liste après ouverture', () => {
    render(<Historique />)
    fireEvent.click(screen.getByText(/Historique/))
    expect(screen.getByText(/Calendrier/)).toBeInTheDocument()
    expect(screen.getByText(/Liste/)).toBeInTheDocument()
  })

  it('devrait afficher la vue liste au clic', () => {
    render(<Historique />)
    fireEvent.click(screen.getByText(/Historique/))
    fireEvent.click(screen.getByText(/Liste/))
    expect(screen.getByText(/Liste/)).toBeInTheDocument()
  })

  it('devrait naviguer au mois précédent', () => {
    render(<Historique />)
    fireEvent.click(screen.getByText(/Historique/))
    expect(screen.getByText(/avril 2026/i)).toBeInTheDocument()
    fireEvent.click(screen.getByText('‹'))
    expect(screen.getByText(/mars 2026/i)).toBeInTheDocument()
  })

  it('devrait naviguer au mois suivant', () => {
    render(<Historique />)
    fireEvent.click(screen.getByText(/Historique/))
    fireEvent.click(screen.getByText('›'))
    expect(screen.getByText(/mai 2026/i)).toBeInTheDocument()
  })

  it('devrait ouvrir la modal d\'édition au clic sur un jour passé', () => {
    render(<Historique />)
    fireEvent.click(screen.getByText(/Historique/))
    fireEvent.click(screen.getByText('‹'))
    fireEvent.click(screen.getByText('2'))
    expect(screen.getByText(/Annuler/)).toBeInTheDocument()
    expect(screen.getByText('🚴 Vélo')).toBeInTheDocument()
  })
})