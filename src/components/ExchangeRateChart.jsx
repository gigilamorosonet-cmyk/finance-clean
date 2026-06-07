import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { TradingEconomicsService } from '@/services/tradingEconomicsService';

export function ExchangeRateChart({ pair = 'EUR/USD', days = 30 }) {
  const [history, setHistory] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);

  const service = new TradingEconomicsService(import.meta.env.VITE_TRADING_ECONOMICS_KEY);

  useEffect(() => {
    loadData();
  }, [pair, days]);

  const loadData = async () => {
    setLoading(true);
    try {
      const histData = await service.getExchangeRateHistory(pair, days);
      const foreData = await service.getExchangeRateForecast(pair, 30);

      setHistory(histData.data);
      setForecast(foreData.forecast);
    } catch (error) {
      console.error('Error loading exchange rate data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!history) {
    return <div className="text-center py-8 text-muted-foreground">Chargement...</div>;
  }

  // Calcul min/max pour scaling
  const allData = [...history, ...(forecast || [])];
  const rates = allData.map(d => d.rate);
  const minRate = Math.min(...rates);
  const maxRate = Math.max(...rates);
  const range = maxRate - minRate;

  // Hauteur relative du graphique
  const getHeight = (rate) => {
    return ((rate - minRate) / range) * 200 + 50; // 50-250px
  };

  // Couleur selon tendance
  const startRate = history[0].rate;
  const endRate = history[history.length - 1].rate;
  const isTrendUp = endRate >= startRate;

  // Changement %
  const changePercent = ((endRate - startRate) / startRate) * 100;

  return (
    <div className="space-y-6">
      {/* Header avec stats */}
      <Card className="card-scifi">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>{pair}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Historique {days} jours + Prédiction 30 jours
              </p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-cyan-1">
                {endRate.toFixed(4)}
              </p>
              <p className={`text-sm font-semibold flex items-center gap-1 justify-end ${
                isTrendUp ? 'text-green-500' : 'text-red-500'
              }`}>
                {isTrendUp ? (
                  <TrendingUp size={16} />
                ) : (
                  <TrendingDown size={16} />
                )}
                {isTrendUp ? '+' : ''}{changePercent.toFixed(2)}%
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Graphique SVG */}
      <Card className="card-scifi">
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <svg viewBox="0 0 1400 300" className="w-full min-w-[1200px]" style={{ minHeight: '350px' }}>
              {/* Grille background */}
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(6, 182, 212, 0.1)" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="1400" height="300" fill="url(#grid)" />

              {/* Axe Y (taux) */}
              <line x1="40" y1="30" x2="40" y2="270" stroke="rgba(6, 182, 212, 0.3)" strokeWidth="2" />

              {/* Axe X (temps) */}
              <line x1="40" y1="270" x2="1390" y2="270" stroke="rgba(6, 182, 212, 0.3)" strokeWidth="2" />

              {/* Labels Y */}
              <text x="10" y="35" fontSize="10" fill="#a0aec0" textAnchor="end">
                {maxRate.toFixed(3)}
              </text>
              <text x="10" y="150" fontSize="10" fill="#a0aec0" textAnchor="end">
                {(minRate + range / 2).toFixed(3)}
              </text>
              <text x="10" y="275" fontSize="10" fill="#a0aec0" textAnchor="end">
                {minRate.toFixed(3)}
              </text>

              {/* Historique - Ligne*/}
              <polyline
                points={history.map((d, i) => {
                  const x = 40 + (i / (history.length - 1)) * 1000;
                  const y = 270 - (getHeight(d.rate) - 50);
                  return `${x},${y}`;
                }).join(' ')}
                fill="none"
                stroke="rgba(6, 182, 212, 0.8)"
                strokeWidth="2"
              />

              {/* Historique - Points */}
              {history.map((d, i) => {
                const x = 40 + (i / (history.length - 1)) * 1000;
                const y = 270 - (getHeight(d.rate) - 50);
                return (
                  <circle key={`hist-${i}`} cx={x} cy={y} r="3" fill="#06b6d4" opacity="0.6" />
                );
              })}

              {/* Prédiction - Ligne (pointillée) */}
              {forecast && forecast.length > 0 && (
                <>
                  <polyline
                    points={forecast.map((d, i) => {
                      const x = 1040 + (i / forecast.length) * 350;
                      const y = 270 - (getHeight(d.rate) - 50);
                      return `${x},${y}`;
                    }).join(' ')}
                    fill="none"
                    stroke="rgba(245, 158, 11, 0.6)"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                  />

                  {/* Prédiction - Points */}
                  {forecast.map((d, i) => {
                    const x = 1040 + (i / forecast.length) * 350;
                    const y = 270 - (getHeight(d.rate) - 50);
                    return (
                      <circle key={`pred-${i}`} cx={x} cy={y} r="2" fill="#f59e0b" opacity="0.4" />
                    );
                  })}
                </>
              )}

              {/* Séparateur historique/prédiction */}
              <line x1="1040" y1="30" x2="1040" y2="270" stroke="rgba(245, 158, 11, 0.5)" strokeWidth="1" strokeDasharray="3,3" />

              {/* Label historique */}
              <text x="520" y="290" fontSize="11" fill="#a0aec0" textAnchor="middle">
                Historique ({days}j)
              </text>

              {/* Label prédiction */}
              <text x="1215" y="290" fontSize="11" fill="#f59e0b" textAnchor="middle">
                Prédiction (30j)
              </text>

              {/* Légende */}
              <g transform="translate(50, 10)">
                <circle cx="0" cy="0" r="3" fill="rgba(6, 182, 212, 0.8)" />
                <text x="10" y="4" fontSize="11" fill="#a0aec0">Données réelles</text>

                <circle cx="180" cy="0" r="3" fill="rgba(245, 158, 11, 0.6)" />
                <text x="190" y="4" fontSize="11" fill="#a0aec0">Prédictions ML</text>
              </g>
            </svg>
          </div>
        </CardContent>
      </Card>

      {/* Tableau détail */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Statistiques */}
        <Card className="card-scifi">
          <CardHeader>
            <CardTitle className="text-sm">📊 Statistiques</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Min (30j)</span>
              <span className="font-semibold text-cyan-1">{minRate.toFixed(4)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Max (30j)</span>
              <span className="font-semibold text-gold-1">{maxRate.toFixed(4)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Moyenne</span>
              <span className="font-semibold">
                {(history.reduce((a, b) => a + b.rate, 0) / history.length).toFixed(4)}
              </span>
            </div>
            <div className="flex justify-between items-center border-t border-border/30 pt-3">
              <span className="text-sm text-muted-foreground">Volatilité</span>
              <span className={`font-semibold ${range > 0.02 ? 'text-red-500' : 'text-green-500'}`}>
                {(range * 1000).toFixed(2)} pips
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Prédictions */}
        {forecast && (
          <Card className="card-scifi border-gold-1/30">
            <CardHeader>
              <CardTitle className="text-sm">🤖 Prédiction 30 Jours</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Taux Prédit (fin)</span>
                <span className="font-semibold text-gold-1">
                  {forecast[forecast.length - 1]?.rate.toFixed(4)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Direction</span>
                <span className={`font-semibold flex items-center gap-1 ${
                  forecast[forecast.length - 1]?.rate >= endRate ? 'text-green-500' : 'text-red-500'
                }`}>
                  {forecast[forecast.length - 1]?.rate >= endRate ? '📈 Hausse' : '📉 Baisse'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Confiance</span>
                <span className="font-semibold text-cyan-1">65%</span>
              </div>
              <div className="flex justify-between items-center border-t border-border/30 pt-3">
                <span className="text-sm text-muted-foreground">Source</span>
                <span className="text-xs text-gold-1">
                  {history[0]?.source === 'real' ? 'API Réelle' : 'Mock Data'}
                </span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Info */}
      <Card className="card-scifi bg-cyan-1/5 border-cyan-1/20">
        <CardContent className="pt-6 text-sm text-muted-foreground space-y-2">
          <p>
            💡 <strong>Graphique interactif</strong> montrant 30 jours d'historique + 30 jours de prédictions ML.
          </p>
          <p>
            🎯 Les prédictions utilisent <strong>moyenne mobile + analyse trend + données historiques</strong>.
          </p>
          <p>
            ⚠️ Confiance à 65% - À utiliser comme référence seulement, pas comme conseil financier.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
