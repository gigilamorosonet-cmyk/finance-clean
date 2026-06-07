import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Globe3D } from './Globe3D';
import { ExchangeRateChart } from './ExchangeRateChart';
import { AlertCenter } from './AlertCenter';
import { WorldMap } from './WorldMap';
import { BarChart3, Brain, Globe, Zap, TrendingUp } from 'lucide-react';
import { TradingEconomicsService } from '@/services/tradingEconomicsService';
import { MLPredictionService } from '@/services/mlPredictionService';
import { getAlertService } from '@/services/alertService';

export function AdvancedGlobalView() {
  const [selectedCountry, setSelectedCountry] = useState('FR');
  const [selectedPair, setSelectedPair] = useState('EUR/USD');
  const [activeTab, setActiveTab] = useState('overview');
  const [technicalAnalysis, setTechnicalAnalysis] = useState(null);
  const [tradingSignal, setTradingSignal] = useState(null);
  const [loading, setLoading] = useState(false);

  const tradingService = new TradingEconomicsService(import.meta.env.VITE_TRADING_ECONOMICS_KEY);
  const mlService = new MLPredictionService();
  const alertService = getAlertService();

  // Paires de devises populaires
  const pairs = ['EUR/USD', 'GBP/USD', 'USD/JPY', 'USD/CNY', 'AUD/USD', 'USD/CAD'];

  useEffect(() => {
    loadTechnicalAnalysis();
  }, [selectedPair]);

  const loadTechnicalAnalysis = async () => {
    setLoading(true);
    try {
      const history = await tradingService.getExchangeRateHistory(selectedPair, 30);

      if (history.success) {
        const technical = mlService.analyzeTechnical(history.data);
        const signal = mlService.generateTradingSignal(technical);

        setTechnicalAnalysis(technical);
        setTradingSignal(signal);

        // Créer alerte si signal fort
        if (signal.score > 70) {
          alertService.createAlert(
            'trading',
            `🎯 Signal d'Achat: ${selectedPair}`,
            `Score: ${signal.score}/100 - ${signal.signal}`,
            'warning',
            {
              pair: selectedPair,
              score: signal.score,
              signal: signal.signal
            }
          );
        } else if (signal.score < 30) {
          alertService.createAlert(
            'trading',
            `⛔ Signal de Vente: ${selectedPair}`,
            `Score: ${signal.score}/100 - ${signal.signal}`,
            'danger',
            {
              pair: selectedPair,
              score: signal.score,
              signal: signal.signal
            }
          );
        }
      }
    } catch (error) {
      console.error('Error loading technical analysis:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-1 to-gold-1 flex items-center justify-center">
            <Globe className="text-background" size={24} />
          </div>
          <div>
            <h1 className="text-4xl font-bold">Vue Globale Avancée</h1>
            <p className="text-muted-foreground">
              Carte 3D + Graphiques + Analyse ML + Alertes Temps Réel
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="card-scifi">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Paire</p>
            <p className="text-2xl font-bold text-cyan-1">{selectedPair}</p>
          </CardContent>
        </Card>
        {technicalAnalysis && (
          <>
            <Card className="card-scifi">
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">RSI (14)</p>
                <p className={`text-2xl font-bold ${
                  technicalAnalysis.rsi.value > 70 ? 'text-red-500' :
                  technicalAnalysis.rsi.value < 30 ? 'text-green-500' :
                  'text-cyan-1'
                }`}>
                  {technicalAnalysis.rsi.value}
                </p>
              </CardContent>
            </Card>
            <Card className="card-scifi">
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">Volatilité</p>
                <p className="text-2xl font-bold text-gold-1">
                  {(parseFloat(technicalAnalysis.volatility) * 100).toFixed(2)}%
                </p>
              </CardContent>
            </Card>
          </>
        )}
        {tradingSignal && (
          <Card className={`card-scifi ${
            tradingSignal.score > 60 ? 'border-green-500/50' :
            tradingSignal.score < 40 ? 'border-red-500/50' :
            'border-cyan-1/30'
          }`}>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Trading Signal</p>
              <p className={`text-lg font-bold ${
                tradingSignal.score > 60 ? 'text-green-500' :
                tradingSignal.score < 40 ? 'text-red-500' :
                'text-cyan-1'
              }`}>
                {tradingSignal.signal}
              </p>
              <div className="mt-2 h-1.5 bg-background rounded-full overflow-hidden">
                <div
                  className={`h-full ${
                    tradingSignal.score > 60 ? 'bg-green-500' :
                    tradingSignal.score < 40 ? 'bg-red-500' :
                    'bg-cyan-1'
                  }`}
                  style={{ width: `${tradingSignal.score}%` }}
                />
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-background/50 border border-border/30">
          <TabsTrigger value="overview">
            <Globe size={16} className="mr-2" />
            Vue Globale
          </TabsTrigger>
          <TabsTrigger value="globe3d">
            <Zap size={16} className="mr-2" />
            Globe 3D
          </TabsTrigger>
          <TabsTrigger value="charts">
            <BarChart3 size={16} className="mr-2" />
            Graphiques
          </TabsTrigger>
          <TabsTrigger value="analysis">
            <Brain size={16} className="mr-2" />
            Analyse ML
          </TabsTrigger>
          <TabsTrigger value="pairs">
            <TrendingUp size={16} className="mr-2" />
            Devises
          </TabsTrigger>
        </TabsList>

        {/* Vue Globale */}
        <TabsContent value="overview" className="space-y-4">
          <WorldMap onCountrySelect={setSelectedCountry} />
        </TabsContent>

        {/* Globe 3D */}
        <TabsContent value="globe3d" className="space-y-4">
          <Globe3D onCountrySelect={setSelectedCountry} />
        </TabsContent>

        {/* Graphiques */}
        <TabsContent value="charts" className="space-y-4">
          <Card className="card-scifi">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <BarChart3 className="text-cyan-1" />
                  Historique 30j + Prédictions 30j
                </span>
                <select
                  value={selectedPair}
                  onChange={(e) => setSelectedPair(e.target.value)}
                  className="bg-background border border-border/30 rounded px-3 py-2 text-sm font-normal"
                >
                  {pairs.map(pair => (
                    <option key={pair} value={pair}>{pair}</option>
                  ))}
                </select>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ExchangeRateChart pair={selectedPair} days={30} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analyse ML */}
        <TabsContent value="analysis" className="space-y-4">
          {technicalAnalysis && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* RSI */}
              <Card className="card-scifi">
                <CardHeader>
                  <CardTitle className="text-sm">📊 RSI (14)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-center">
                    <p className={`text-4xl font-bold ${
                      technicalAnalysis.rsi.value > 70 ? 'text-red-500' :
                      technicalAnalysis.rsi.value < 30 ? 'text-green-500' :
                      'text-cyan-1'
                    }`}>
                      {technicalAnalysis.rsi.value}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">
                      Signal: <strong>{technicalAnalysis.rsi.signal}</strong>
                    </p>
                    <div className="h-2 bg-background rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-green-500 via-cyan-1 to-red-500"
                        style={{ width: `${technicalAnalysis.rsi.value}%` }}
                      />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground pt-2 border-t border-border/30">
                    {technicalAnalysis.rsi.value > 70 ? '⛔ Suracheté' :
                     technicalAnalysis.rsi.value < 30 ? '✅ Survendu' :
                     '➡️ Neutre'}
                  </p>
                </CardContent>
              </Card>

              {/* MACD */}
              <Card className="card-scifi">
                <CardHeader>
                  <CardTitle className="text-sm">📈 MACD</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div>
                      <p className="text-xs text-muted-foreground">MACD Line</p>
                      <p className="text-lg font-bold text-cyan-1">
                        {technicalAnalysis.macd.macdLine.toFixed(4)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Signal</p>
                      <p className="text-lg font-bold text-gold-1">
                        {technicalAnalysis.macd.signalLine.toFixed(4)}
                      </p>
                    </div>
                  </div>
                  <div className="p-2 bg-background/50 rounded">
                    <p className="text-xs text-muted-foreground">Histogram</p>
                    <p className={`text-lg font-bold ${
                      technicalAnalysis.macd.histogram > 0 ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {technicalAnalysis.macd.histogram.toFixed(4)}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Support/Resistance */}
              <Card className="card-scifi">
                <CardHeader>
                  <CardTitle className="text-sm">🎯 Support & Résistance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-xs text-muted-foreground">Résistance</span>
                      <span className="font-bold text-red-500">
                        {technicalAnalysis.resistance.toFixed(4)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-muted-foreground">Prix Actuel</span>
                      <span className="font-bold text-cyan-1">
                        {technicalAnalysis.currentPrice.toFixed(4)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-muted-foreground">Support</span>
                      <span className="font-bold text-green-500">
                        {technicalAnalysis.support.toFixed(4)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Trading Signal */}
              {tradingSignal && (
                <Card className={`card-scifi ${
                  tradingSignal.score > 60 ? 'border-green-500/50 bg-green-500/5' :
                  tradingSignal.score < 40 ? 'border-red-500/50 bg-red-500/5' :
                  'border-cyan-1/30'
                }`}>
                  <CardHeader>
                    <CardTitle className="text-sm">🎯 Trading Signal ML</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-center">
                      <p className={`text-3xl font-bold ${
                        tradingSignal.score > 60 ? 'text-green-500' :
                        tradingSignal.score < 40 ? 'text-red-500' :
                        'text-cyan-1'
                      }`}>
                        {tradingSignal.score}/100
                      </p>
                      <p className="text-sm font-semibold mt-2">
                        {tradingSignal.signal}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 text-xs"
                        onClick={loadTechnicalAnalysis}
                        disabled={loading}
                      >
                        {loading ? 'Analyse...' : 'Rafraîchir'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </TabsContent>

        {/* Devises */}
        <TabsContent value="pairs" className="space-y-4">
          <Card className="card-scifi">
            <CardHeader>
              <CardTitle>Paires de Devises Populaires</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {pairs.map(pair => (
                  <button
                    key={pair}
                    onClick={() => {
                      setSelectedPair(pair);
                      setActiveTab('charts');
                    }}
                    className={`p-4 rounded-lg border transition-all text-left ${
                      selectedPair === pair
                        ? 'border-cyan-1/50 bg-cyan-1/10'
                        : 'border-border/30 hover:border-cyan-1/30'
                    }`}
                  >
                    <p className="font-semibold text-cyan-1">{pair}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Cliquer pour voir graphique
                    </p>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Alert Center */}
      <AlertCenter />

      {/* Info */}
      <Card className="card-scifi bg-cyan-1/5 border-cyan-1/20">
        <CardContent className="pt-6 text-sm text-muted-foreground space-y-2">
          <p>
            🌍 <strong>Vue Globale Avancée</strong> combine une carte 2D/3D, des graphiques temps réel, et des analyses ML.
          </p>
          <p>
            📊 Les analyses techniques utilisent RSI, MACD, SMA, et Support/Resistance pour générer des signaux.
          </p>
          <p>
            🔔 Les alertes sont automatiques - une cloche notifie les changements importants.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
