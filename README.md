# 🚴 VéloTaf

Application web progressive (PWA) pour suivre vos trajets domicile-travail à vélo.

## Fonctionnalités

- **Saisie rapide** — Indiquez en 2 clics si vous avez pris le vélo
- **Raisons d'absence** — Télétravail, congés, météo, agenda, fatigue, autre
- **Jours fériés français** — Les week-ends et jours fériés sont exclus automatiquement
- **Statistiques avancées** —
  - Sélection de période (année en cours / mois en cours)
  - Jours à vélo
  - % trajets à vélo (exclut congés et télétravail)
  - Kilométrage cumulé pour la période
  - CO2 économisé (kg, calcul à partir du carburant économisé)
  - Carburant économisé
  - Indemnité vélo cumulée
  - Économies totales (carburant + indemnité)
- **Indemnités flexibles** — 3 modes : forfait journalier, au kilomètre avec plafond par trajet, ou aucune indemnité
- **Historique** — Vue calendrier et vue liste, avec possibilité de modifier les trajets passés
- **Réglages** — Distance, consommation, prix du carburant et indemnité paramétrables
- **PWA** — Installable sur Android comme une application native
- **Synchronisation** — Sauvegarde automatique sur Google Drive *(à venir)*

## Stack technique

| Outil | Rôle |
|---|---|
| React + Vite | Framework frontend |
| Tailwind CSS | Styles mobile-first |
| Zustand | Gestion de l'état |
| Vitest + Testing Library | Tests automatisés |
| GitHub Actions | CI/CD |
| Vercel | Hébergement |
| vite-plugin-pwa | PWA et service worker |

## Installation et développement

### Prérequis
- Node.js v22+ (via nvm) — moteur requis pour faire tourner Vite et les outils de développement
- Git

### Démarrage
```bash
# Cloner le projet
git clone git@github.com:Denis-lab-911/velotaf.git
cd velotaf

# Installer les dépendances
npm install --legacy-peer-deps

# Lancer le serveur de développement
npm run dev
```

### Tests
```bash
npm run test
```

### Build de production
```bash
npm run build
```

### Régénérer les icônes PWA
```bash
node scripts/generate-icons.mjs
```

## Variables d'environnement

Créez un fichier `.env.local` à la racine du projet :
```
VITE_GOOGLE_CLIENT_ID=votre_client_id_google
```

## CI/CD

Chaque `git push` sur la branche `main` déclenche automatiquement :
1. L'installation des dépendances
2. Les tests automatisés (45 tests)
3. Le build de production
4. Le déploiement sur Vercel (si les tests passent)

## Licence

Projet personnel — tous droits réservés.