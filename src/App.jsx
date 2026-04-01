import BoutonTrajet from './components/BoutonTrajet'
import Statistiques from './components/Statistiques'
import Reglages from './components/Reglages'
import Historique from './components/Historique'

function App() {
  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-sm">
        <div className="p-6 border-b border-gray-100 text-center">
          <h1 className="text-2xl font-bold text-green-700">🚴 VéloTaf</h1>
        </div>
        <BoutonTrajet />
        <Statistiques />
        <Historique />
        <Reglages />
      </div>
    </div>
  )
}

export default App