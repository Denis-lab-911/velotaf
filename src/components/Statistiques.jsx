import useVelotafStore from '../stores/velotafStore'

export default function Statistiques() {
  const { getStats } = useVelotafStore()
  const stats = getStats()

  return (
    <div className="p-6 border-t border-gray-100">
      <h2 className="text-lg font-bold text-gray-700 mb-4">📊 Mes statistiques</h2>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-green-50 rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-green-600">{stats.pourcentageVelo}%</p>
          <p className="text-xs text-gray-500 mt-1">Trajets en vélo</p>
        </div>

        <div className="bg-blue-50 rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-blue-600">{stats.joursVelo}</p>
          <p className="text-xs text-gray-500 mt-1">Jours à vélo</p>
        </div>

        <div className="bg-yellow-50 rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-yellow-600">{stats.carburantEconomiseEuro}€</p>
          <p className="text-xs text-gray-500 mt-1">Carburant économisé</p>
        </div>

        <div className="bg-purple-50 rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-purple-600">{stats.indemniteTotaleEuro}€</p>
          <p className="text-xs text-gray-500 mt-1">Indemnité vélo</p>
        </div>
      </div>

      <p className="text-xs text-gray-400 text-center mt-4">
        Sur {stats.joursTotal} jours enregistrés
      </p>
    </div>
  )
}