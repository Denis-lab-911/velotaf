# CLAUDE.md — Contexte du projet VéloMafia

## Description
Application web progressive (PWA) pour suivre les trajets domicile-travail à vélo.
Installée sur Android, utilisée au quotidien par un seul utilisateur.

## Stack technique
- **Framework** : React 18 + Vite 8
- **UI** : Tailwind CSS v3
- **État** : Zustand avec persistence localStorage
- **Tests** : Vitest + Testing Library
- **CI/CD** : GitHub Actions
- **Hébergement** : Vercel (free tier)
- **PWA** : vite-plugin-pwa + Workbox

## Structure du projet
```
src/
├── components/
│   ├── BoutonTrajet.jsx   # Écran principal, saisie en 2 clics
│   ├── Statistiques.jsx   # Tuiles de stats (% vélo, carburant, indemnité)
│   ├── Historique.jsx     # Calendrier + liste des trajets, repliable
│   └── Reglages.jsx       # Paramètres utilisateur, repliable
├── stores/
│   └── velotafStore.js    # Store Zustand (trajets + settings + calculs)
├── utils/
│   └── joursFeries.js     # Jours fériés français, jours ouvrés, utilitaires dates
└── tests/
    ├── app.test.js
    ├── joursFeries.test.js
    ├── store.test.js
    └── interface.test.jsx
```

## Modèle de données

### Store Zustand (persisté dans localStorage)
```js
{
  settings: {
    distanceKm: 10,          // Distance aller simple domicile-travail
    consommationL100: 6,     // Consommation véhicule en L/100km
    prixCarburantEuro: 1.75, // Prix du carburant au litre
    indemniteJourEuro: 3.00, // Forfait indemnité vélo employeur par jour
  },
  trajets: {
    "2026-03-30": "velo",       // Statuts possibles :
    "2026-03-31": "teletravail",// velo | teletravail | conges |
    "2026-04-01": "meteo",      // meteo | agenda | fatigue | autre
  }
}
```

## Fonctionnalités implémentées
- ✅ Saisie trajet en 2 clics (vélo / pas vélo + raison)
- ✅ Exclusion automatique week-ends et jours fériés français
- ✅ Statistiques : % vélo, carburant économisé, indemnité journalière
- ✅ Historique repliable : vue calendrier + vue liste
- ✅ Édition/suppression/ajout de trajets passés
- ✅ Réglages paramétrables (distance, carburant, indemnité)
- ✅ PWA installable sur Android
- ✅ 36 tests automatisés
- ✅ CI/CD GitHub Actions + déploiement Vercel

## En cours / À faire
- 🔲 Synchronisation Google Drive (sauvegarde automatique)
  - Client ID configuré dans VITE_GOOGLE_CLIENT_ID
  - Écran de consentement OAuth configuré (externe)
  - Fichier cible : velotaf-data.json dans Google Drive

## Conventions importantes
- Toujours utiliser `--legacy-peer-deps` pour npm install (conflit vite-plugin-pwa / Vite 8)
- Les dates sont toujours au format "YYYY-MM-DD"
- Pas d'accent dans les noms de variables JS (ex: indemniteJourEuro, pas indemnitéJourEuro)
- Les tests mockent `aujourdhui()` sur '2026-03-30' (jour ouvré connu)
- `estJourOuvre()` est aussi mocké dans les tests d'interface

## Commandes utiles
```bash
npm run dev          # Lancer le serveur de développement
npm run build        # Build de production
npm run test         # Lancer les tests
git add . && git commit -m "..." && git push  # Pousser sur GitHub
node scripts/generate-icons.mjs  # Régénérer les icônes PWA
```

## Environnement
- OS : Linux Mint
- PC : 2014, 8 Go RAM
- Node : v22 (via nvm)
- Répertoire : ~/Documents/Projets/velotaf
- GitHub : github.com/Denis-lab-911/velotaf
- Vercel : velotaf-xxx.vercel.app