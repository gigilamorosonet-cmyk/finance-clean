import { useState } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export function Market() {
  const [selectedSymbol, setSelectedSymbol] = useState('AAPL');

  const symbols = [
    { symbol: 'AAPL', name: 'Apple', price: '$182.45', change: '+2.3%' },
    { symbol: 'MSFT', name: 'Microsoft', price: '$417.89', change: '+1.8%' },
    { symbol: 'GOOGL', name: 'Google', price: '$142.63', change: '+0.9%' },
    { symbol: 'TSLA', name: 'Tesla', price: '$242.84', change: '-1.2%' },
    { symbol: 'AMZN', name: 'Amazon', price: '$186.91', change: '+1.5%' },
    { symbol: 'NVDA', name: 'NVIDIA', price: '$872.30', change: '+3.1%' },
  ];

  // Generate mock data for charts
  const generateChartData = () => {
    const data = [];
    let price = 100;
    let volume = 50;

    for (let i = 0; i < 60; i++) {
      price += (Math.random() - 0.48) * 3;
      volume = Math.floor(40 + Math.random() * 60);

      data.push({
        day: `J${i + 1}`,
        price: parseFloat(price.toFixed(2)),
        volume: volume,
        ma7: price + (Math.random() - 0.5) * 1,
        ma30: price + (Math.random() - 0.5) * 2,
      });
    }
    return data;
  };

  const chartData = generateChartData();

  return (
    <div className="space-y-8">
      {/* Titre */}
      <div>
        <h1 className="text-4xl font-bold text-slate-100 mb-2">📈 Marché</h1>
        <p className="text-slate-400">Graphiques de trading temps réel - Recharts</p>
      </div>

      {/* Sélecteur d'actifs */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
        <h2 className="text-xl font-bold text-slate-100 mb-4">🎯 Sélectionner un actif</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {symbols.map((sym) => (
            <button
              key={sym.symbol}
              onClick={() => setSelectedSymbol(sym.symbol)}
              className={`p-4 rounded-lg border transition-all ${
                selectedSymbol === sym.symbol
                  ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400'
                  : 'bg-slate-700/30 border-slate-600 text-slate-300 hover:border-cyan-500/50'
              }`}
            >
              <div className="font-bold text-sm">{sym.symbol}</div>
              <div className="text-xs text-slate-500 mt-1">{sym.name}</div>
              <div className="text-lg font-semibold mt-2 text-green-400">{sym.price}</div>
              <div className={`text-xs font-semibold mt-1 ${sym.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                {sym.change}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Graphique Principal */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
        <h2 className="text-xl font-bold text-slate-100 mb-6">
          📊 {selectedSymbol} - Évolution 60 jours
        </h2>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
            <XAxis
              dataKey="day"
              stroke="#94a3b8"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              stroke="#94a3b8"
              style={{ fontSize: '12px' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                border: '1px solid #475569',
                borderRadius: '8px',
                color: '#e2e8f0',
              }}
              cursor={{ stroke: '#0ea5e9', strokeWidth: 1 }}
            />
            <Legend
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="line"
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#0ea5e9"
              dot={false}
              strokeWidth={2}
              name="Prix"
              isAnimationActive={true}
            />
            <Line
              type="monotone"
              dataKey="ma7"
              stroke="#10b981"
              dot={false}
              strokeWidth={1}
              strokeDasharray="5 5"
              name="MA7"
            />
            <Line
              type="monotone"
              dataKey="ma30"
              stroke="#f59e0b"
              dot={false}
              strokeWidth={1}
              strokeDasharray="5 5"
              name="MA30"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Graphique Volume */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
        <h2 className="text-xl font-bold text-slate-100 mb-6">📊 Volume de transactions</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
            <XAxis
              dataKey="day"
              stroke="#94a3b8"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              stroke="#94a3b8"
              style={{ fontSize: '12px' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                border: '1px solid #475569',
                borderRadius: '8px',
                color: '#e2e8f0',
              }}
            />
            <Bar
              dataKey="volume"
              fill="#06b6d4"
              radius={[4, 4, 0, 0]}
              name="Volume"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
          <p className="text-slate-400 text-sm mb-2">Ouverture</p>
          <p className="text-2xl font-bold text-cyan-400">$178.50</p>
          <p className="text-xs text-slate-500 mt-2">Aujourd'hui</p>
        </div>
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
          <p className="text-slate-400 text-sm mb-2">Plus Haut</p>
          <p className="text-2xl font-bold text-green-400">$184.20</p>
          <p className="text-xs text-slate-500 mt-2">52 semaines</p>
        </div>
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
          <p className="text-slate-400 text-sm mb-2">Plus Bas</p>
          <p className="text-2xl font-bold text-red-400">$176.30</p>
          <p className="text-xs text-slate-500 mt-2">52 semaines</p>
        </div>
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
          <p className="text-slate-400 text-sm mb-2">Volume Moyen</p>
          <p className="text-2xl font-bold text-blue-400">52.3M</p>
          <p className="text-xs text-slate-500 mt-2">Titres/jour</p>
        </div>
      </div>

      {/* Info */}
      <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-6">
        <h3 className="text-lg font-bold text-slate-100 mb-3">ℹ️ À propos</h3>
        <p className="text-slate-400 text-sm">
          Les graphiques utilisent <strong>Recharts</strong> - une librairie React pour visualiser les données de marché en temps réel.
        </p>
        <ul className="text-slate-400 text-sm mt-4 space-y-2 ml-4">
          <li>✅ Graphiques interactifs et réactifs</li>
          <li>✅ Support des moyennes mobiles (MA7, MA30)</li>
          <li>✅ Analyse du volume de transactions</li>
          <li>✅ Responsive et mobile-friendly</li>
        </ul>
      </div>
    </div>
  );
}
