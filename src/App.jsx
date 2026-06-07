import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Dashboard } from './components/Dashboard';
import { InvestmentHub } from './components/InvestmentHub';
import { Market } from './components/Market';
import { Budget } from './components/Budget';
import { WorldEconomics } from './components/WorldEconomics';
import './index.css';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [menuOpen, setMenuOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: '📊 Dashboard', component: Dashboard },
    { id: 'market', label: '📈 Marché', component: Market },
    { id: 'budget', label: '💰 Budget', component: Budget },
    { id: 'world', label: '🌍 Monde Éco', component: WorldEconomics },
    { id: 'investment', label: '🎯 Investment', component: InvestmentHub }
  ];

  const CurrentComponent = menuItems.find(item => item.id === currentPage)?.component || Dashboard;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              FinVue
            </div>
          </div>

          {/* Menu Déroulant */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600 transition-all text-slate-100 font-medium"
            >
              {menuItems.find(item => item.id === currentPage)?.label}
              <ChevronDown size={16} className={`transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown */}
            {menuOpen && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-slate-800 border border-slate-600 rounded-lg shadow-lg overflow-hidden z-50">
                {menuItems.map(item => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentPage(item.id);
                      setMenuOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 transition-all ${
                      currentPage === item.id
                        ? 'bg-cyan-500/20 border-l-4 border-cyan-400 text-cyan-400'
                        : 'text-slate-300 hover:bg-slate-700/50'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Contenu Principal */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <CurrentComponent />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-700 bg-slate-900/50 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-slate-400 text-sm">
          <p>FinVue Pro - Investment Intelligence Platform</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
