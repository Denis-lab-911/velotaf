import useVelotafStore from '../stores/velotafStore'

export default function Statistiques() {
  const { getStats, settings, updateSettings } = useVelotafStore()
  const { statsPeriod, indemniteType } = settings
  const stats = getStats(statsPeriod)

  const periodButtons = [
    { key: 'annee', label: 'Année' },
    { key: 'mois', label: 'Mois' },
  ]

  const changePeriod = (period) => {
    if (period !== statsPeriod) {
      updateSettings({ statsPeriod: period })
    }
  }

  return (
    <div className="p-6 border-t border-gray-100">
      <h2 className="text-lg font-bold text-gray-700 mb-4">📊 Mes statistiques</h2>

      <div className="flex gap-2 mb-4">
        {periodButtons.map((button) => (
          <button
            key={button.key}
            onClick={() => changePeriod(button.key)}
            className={`flex-1 py-1.5 rounded-lg text-sm font-medium transition-colors ${statsPeriod === button.key ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-500'}`}
          >
            {button.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-blue-50 rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-blue-600">{stats.joursVelo}</p>
          <p className="text-xs text-gray-500 mt-1">Jours à vélo</p>
        </div>

        <div className="bg-green-50 rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-green-600">{stats.pourcentageVelo}%</p>
          <p className="text-xs text-gray-500 mt-1">Trajets en vélo</p>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-gray-700">{stats.distanceTotaleKm} km</p>
          <p className="text-xs text-gray-500 mt-1">Distance cumulée</p>
        </div>

        <div className="bg-teal-50 rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-teal-600">{stats.co2EconomiseKg} kg</p>
          <p className="text-xs text-gray-500 mt-1">CO2 économisé</p>
        </div>

        <div className="bg-yellow-50 rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-yellow-600">{stats.carburantEconomiseEuro}€</p>
          <p className="text-xs text-gray-500 mt-1">Carburant économisé</p>
        </div>

        {indemniteType !== 'aucune' && (
          <div className="bg-purple-50 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-purple-600">{stats.indemniteTotaleEuro}€</p>
            <p className="text-xs text-gray-500 mt-1">Indemnité vélo</p>
          </div>
        )}
      </div>

      <div className="mt-4 bg-emerald-50 rounded-xl p-4 text-center border-2 border-emerald-200">
        <p className="text-4xl font-bold text-emerald-700">{stats.economiesTotal}€</p>
        <p className="text-sm text-emerald-600 font-semibold mt-1">Économies totales</p>
      </div>

      <p className="text-xs text-gray-400 text-center mt-4">
        Sur {stats.joursTotal} jours enregistrés ({stats.joursNonDeplacement} congés/télétravail exclus)
      </p>
    </div>
  )
}