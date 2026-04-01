/**
 * Calcule la date de Pâques pour une année donnée
 * Algorithme de Meeus/Jones/Butcher
 */
function getPaques(annee) {
  const a = annee % 19
  const b = Math.floor(annee / 100)
  const c = annee % 100
  const d = Math.floor(b / 4)
  const e = b % 4
  const f = Math.floor((b + 8) / 25)
  const g = Math.floor((b - f + 1) / 3)
  const h = (19 * a + b - d - g + 15) % 30
  const i = Math.floor(c / 4)
  const k = c % 4
  const l = (32 + 2 * e + 2 * i - h - k) % 7
  const m = Math.floor((a + 11 * h + 22 * l) / 451)
  const mois = Math.floor((h + l - 7 * m + 114) / 31)
  const jour = ((h + l - 7 * m + 114) % 31) + 1
  return new Date(annee, mois - 1, jour)
}

/**
 * Retourne la liste des jours fériés français pour une année donnée
 */
export function getJoursFeries(annee) {
  const paques = getPaques(annee)

  const addDays = (date, days) => {
    const d = new Date(date)
    d.setDate(d.getDate() + days)
    return d
  }

  const feries = [
    new Date(annee, 0, 1),   // 1er janvier
    new Date(annee, 4, 1),   // Fête du travail
    new Date(annee, 4, 8),   // Victoire 1945
    new Date(annee, 6, 14),  // Fête nationale
    new Date(annee, 7, 15),  // Assomption
    new Date(annee, 10, 1),  // Toussaint
    new Date(annee, 10, 11), // Armistice
    new Date(annee, 11, 25), // Noël
    addDays(paques, 1),      // Lundi de Pâques
    addDays(paques, 39),     // Ascension
    addDays(paques, 50),     // Lundi de Pentecôte
  ]

// Retourne les dates au format "YYYY-MM-DD" (sans décalage UTC)
return feries.map((d) => {
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
})
}

/**
 * Vérifie si une date est un jour ouvré (pas week-end, pas férié)
 */
export function estJourOuvre(dateStr) {
  const date = new Date(dateStr)
  const jour = date.getDay() // 0=dimanche, 6=samedi

  if (jour === 0 || jour === 6) return false

  const annee = date.getFullYear()
  const feries = getJoursFeries(annee)
  if (feries.includes(dateStr)) return false

  return true
}

/**
 * Retourne la date d'aujourd'hui au format "YYYY-MM-DD"
 */
export function aujourdhui() {
  const d = new Date()
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

/**
 * Retourne tous les jours ouvrés d'un mois donné
 */
export function getJoursOuvresDuMois(annee, mois) {
  const jours = []
  const nbJours = new Date(annee, mois + 1, 0).getDate()

  for (let j = 1; j <= nbJours; j++) {
    const date = new Date(annee, mois, j)
    const yyyy = date.getFullYear()
    const mm = String(date.getMonth() + 1).padStart(2, '0')
    const dd = String(date.getDate()).padStart(2, '0')
    const dateStr = `${yyyy}-${mm}-${dd}`

    if (estJourOuvre(dateStr)) {
      jours.push(dateStr)
    }
  }

  return jours
}

/**
 * Retourne tous les jours d'un mois (y compris week-ends et fériés)
 * pour la vue calendrier
 */
export function getTousLesJoursDuMois(annee, mois) {
  const jours = []
  const nbJours = new Date(annee, mois + 1, 0).getDate()

  for (let j = 1; j <= nbJours; j++) {
    const date = new Date(annee, mois, j)
    const yyyy = date.getFullYear()
    const mm = String(date.getMonth() + 1).padStart(2, '0')
    const dd = String(date.getDate()).padStart(2, '0')
    jours.push(`${yyyy}-${mm}-${dd}`)
  }

  return jours
}

/**
 * Retourne le nom du mois en français
 */
export function getNomMois(annee, mois) {
  return new Date(annee, mois, 1).toLocaleDateString('fr-FR', {
    month: 'long',
    year: 'numeric',
  })
}