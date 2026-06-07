export function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Titre */}
      <div>
        <h1 className="text-4xl font-bold text-slate-100 mb-2">📊 Dashboard</h1>
        <p className="text-slate-400">Bienvenue sur FinVue - Votre plateforme d'analyse financière</p>
      </div>

      {/* Stats Principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Portefeuille Total', value: '$0', color: 'cyan' },
          { label: 'Gains/Pertes', value: '+0%', color: 'green' },
          { label: 'Actifs', value: '0', color: 'blue' },
          { label: 'Alertes', value: '0', color: 'yellow' }
        ].map((stat, idx) => (
          <div
            key={idx}
            className={`bg-slate-800/50 border border-${stat.color}-500/30 rounded-lg p-6`}
          >
            <p className="text-slate-400 text-sm mb-2">{stat.label}</p>
            <p className={`text-3xl font-bold text-${stat.color}-400`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Section Bienvenue */}
      <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-8">
        <h2 className="text-xl font-bold text-slate-100 mb-4">🚀 Commencer</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-cyan-400 font-semibold mb-2">📍 Menu Navigation</h3>
            <p className="text-slate-400 text-sm">Utilisez le menu déroulant en haut pour naviguer entre:</p>
            <ul className="text-slate-400 text-sm mt-2 space-y-1 ml-4">
              <li>✅ Dashboard - Vue d'ensemble</li>
              <li>✅ Investment - Whales, Insiders, Funds, Deals</li>
            </ul>
          </div>
          <div>
            <h3 className="text-blue-400 font-semibold mb-2">⚙️ Configuration API</h3>
            <p className="text-slate-400 text-sm">Pour activer les données réelles, ajoutez vos clés API:</p>
            <ul className="text-slate-400 text-sm mt-2 space-y-1 ml-4">
              <li>VITE_FINNHUB_KEY - Whales & Insiders</li>
              <li>VITE_NEWS_API_KEY - Mega Deals</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Fonctionnalités */}
      <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-8">
        <h2 className="text-xl font-bold text-slate-100 mb-6">💡 Fonctionnalités</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: '🐋', title: 'Whales Tracker', desc: 'Transactions > $100k' },
            { icon: '👔', title: 'Insiders', desc: 'Mouvements dirigeants' },
            { icon: '🏦', title: 'Major Funds', desc: 'Berkshire, BlackRock' },
            { icon: '🚀', title: 'Mega Deals', desc: 'Funding & Acquisitions' }
          ].map((feature, idx) => (
            <div
              key={idx}
              className="bg-slate-700/30 border border-slate-600 rounded-lg p-4 hover:border-cyan-500/50 transition-all cursor-pointer"
            >
              <div className="text-3xl mb-2">{feature.icon}</div>
              <p className="font-semibold text-slate-100">{feature.title}</p>
              <p className="text-xs text-slate-400 mt-1">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Info */}
      <div className="text-center text-slate-500 text-sm">
        <p>Cliquez sur "Investment" dans le menu pour voir les données</p>
      </div>
    </div>
  );
}
