import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Brain, Zap, TrendingUp, Globe } from 'lucide-react';
import { CountrySelector } from './CountrySelector';
import { CompoundInterestCalculator } from './CompoundInterestCalculator';
import { ConflictMap } from './ConflictMap';
import { MarketDataService } from '@/services/marketDataService';
import { AIService } from '@/services/aiService';

export function AdvancedAnalysis() {
  const [selectedCountry, setSelectedCountry] = useState('FR');
  const [countryData, setCountryData] = useState(null);
  const [marketData, setMarketData] = useState(null);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const marketService = new MarketDataService({
    finnhub: import.meta.env.VITE_FINNHUB_KEY,
    alphaVantage: import.meta.env.VITE_ALPHA_VANTAGE_KEY
  });

  const aiService = new AIService(import.meta.env.VITE_ANTHROPIC_KEY);

  useEffect(() => {
    loadCountryData();
    loadMarketData();
  }, [selectedCountry]);

  const loadCountryData = async () => {
    const data = await marketService.getCountryEconomics(selectedCountry);
    setCountryData(data);
  };

  const loadMarketData = async () => {
    setLoading(true);
    try {
      // Charger les principales données de marché pour ce pays
      const markets = {
        'FR': ['AAPL', 'BTC', 'EUR/USD'],
        'US': ['AAPL', 'NVDA', 'MSFT'],
        'DE': ['SAP', 'BMW', 'EUR/USD'],
        'JP': ['TYO', 'NKY', 'USD/JPY'],
        'CN': ['BZH', 'BABA', 'USD/CNY']
      };

      const selectedMarkets = markets[selectedCountry] || markets['US'];
      const data = [];

      for (const symbol of selectedMarkets) {
        const result = await marketService.getMarketData(symbol);
        if (result.success) {
          data.push(result.data);
        }
      }

      setMarketData(data);
    } catch (error) {
      console.error('Error loading market data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateAIAnalysis = async () => {
    setLoading(true);
    try {
      const analysis = await aiService.analyzePortfolio([
        { symbol: 'AAPL', type: 'Action', quantity: 50, currentPrice: 182.45, entryPrice: 145 },
        { symbol: 'BTC', type: 'Crypto', quantity: 0.5, currentPrice: 42580, entryPrice: 38500 },
        { symbol: 'ETF-MSCI', type: 'ETF', quantity: 100, currentPrice: 85.20, entryPrice: 78.50 }
      ]);
      setAiAnalysis(analysis);
    } catch (error) {
      console.error('Error generating AI analysis:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Country Selector */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">Analyse Avancée IA</h1>
          <p className="text-muted-foreground">Données de marché réelles + Intelligence Artificielle</p>
        </div>
        <CountrySelector onCountryChange={setSelectedCountry} />
      </div>

      {/* Country Economics Overview */}
      {countryData && (
        <Card className="card-scifi bg-gradient-to-r from-cyan-1/5 to-gold-1/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="text-cyan-1" />
              Indicateurs Économiques - {selectedCountry}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="p-3 bg-background/50 rounded-lg border border-border/30">
                <p className="text-xs text-muted-foreground">PIB</p>
                <p className="text-lg font-bold text-cyan-1">{countryData.gdp}</p>
              </div>
              <div className="p-3 bg-background/50 rounded-lg border border-border/30">
                <p className="text-xs text-muted-foreground">Croissance</p>
                <p className="text-lg font-bold text-green-500">+{countryData.gdpGrowth}%</p>
              </div>
              <div className="p-3 bg-background/50 rounded-lg border border-border/30">
                <p className="text-xs text-muted-foreground">Inflation</p>
                <p className="text-lg font-bold text-orange-500">{countryData.inflation}%</p>
              </div>
              <div className="p-3 bg-background/50 rounded-lg border border-border/30">
                <p className="text-xs text-muted-foreground">Chômage</p>
                <p className="text-lg font-bold text-yellow-500">{countryData.unemployment}%</p>
              </div>
              <div className="p-3 bg-background/50 rounded-lg border border-border/30">
                <p className="text-xs text-muted-foreground">Devises</p>
                <p className="text-lg font-bold text-cyan-2">{countryData.currency}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabs for Different Analysis */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-background/50 border border-border/30">
          <TabsTrigger value="overview">Marché Réel</TabsTrigger>
          <TabsTrigger value="ai">IA & Signaux</TabsTrigger>
          <TabsTrigger value="compound">Intérêts Composés</TabsTrigger>
          <TabsTrigger value="conflicts">Conflits Géo</TabsTrigger>
        </TabsList>

        {/* Market Data Tab */}
        <TabsContent value="overview" className="space-y-4">
          <Card className="card-scifi">
            <CardHeader>
              <CardTitle>Données de Marché Réelles</CardTitle>
              <CardDescription>
                Données actualisées pour {selectedCountry}
                {!import.meta.env.VITE_FINNHUB_KEY && ' (Mode démonstration - connectez votre clé API)'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Chargement des données...</p>
                </div>
              ) : marketData && marketData.length > 0 ? (
                <div className="space-y-3">
                  {marketData.map((data, idx) => (
                    <div key={idx} className="p-4 bg-background/50 rounded-lg border border-border/30">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-bold">{data.symbol}</p>
                          <p className="text-sm text-muted-foreground">
                            {data.timestamp ? new Date(data.timestamp).toLocaleString() : 'Données mockées'}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-cyan-1">
                            {typeof data.price === 'number' ? data.price.toLocaleString() : data.price}
                          </p>
                          <p className={`text-sm font-semibold ${data.changePercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {data.changePercent >= 0 ? '+' : ''}{data.changePercent?.toFixed(2) || 0}%
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">Aucune donnée disponible</p>
                  <Button
                    onClick={loadMarketData}
                    className="bg-cyan-1 hover:bg-cyan-2"
                  >
                    Réessayer
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Analysis Tab */}
        <TabsContent value="ai" className="space-y-4">
          <Card className="card-scifi">
            <CardHeader className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Brain className="text-cyan-1" size={24} />
                <div>
                  <CardTitle>Analyse IA</CardTitle>
                  <CardDescription>
                    {import.meta.env.VITE_ANTHROPIC_KEY
                      ? 'Analysé par Claude AI'
                      : 'Connectez votre clé API pour activer'}
                  </CardDescription>
                </div>
              </div>
              <Button
                onClick={generateAIAnalysis}
                disabled={loading}
                className="bg-cyan-1 hover:bg-cyan-2 gap-2"
              >
                <Zap size={16} />
                {loading ? 'Analyse...' : 'Générer'}
              </Button>
            </CardHeader>
            <CardContent>
              {aiAnalysis ? (
                <div className="space-y-4">
                  <div className="p-4 bg-background/50 rounded-lg border border-cyan-1/20">
                    <p className="text-sm text-muted-foreground mb-2">Niveau de Risque</p>
                    <p className="text-xl font-bold text-cyan-1">{aiAnalysis.riskLevel}</p>
                  </div>
                  <div className="p-4 bg-background/50 rounded-lg border border-gold-1/20">
                    <p className="text-sm text-muted-foreground mb-2">Score Diversification</p>
                    <p className="text-xl font-bold text-gold-1">{aiAnalysis.diversificationScore}/100</p>
                  </div>
                  <div className="p-4 bg-background/50 rounded-lg border border-green-500/20">
                    <p className="text-sm text-muted-foreground mb-2">Recommandations</p>
                    <ul className="space-y-2">
                      {aiAnalysis.recommendations?.map((rec, idx) => (
                        <li key={idx} className="text-sm text-green-500 flex items-start gap-2">
                          <span>✓</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">Cliquez sur "Générer" pour lancer l'analyse IA</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Compound Interest Tab */}
        <TabsContent value="compound">
          <CompoundInterestCalculator />
        </TabsContent>

        {/* Conflict Map Tab */}
        <TabsContent value="conflicts">
          <ConflictMap />
        </TabsContent>
      </Tabs>

      {/* API Configuration Reminder */}
      {(!import.meta.env.VITE_FINNHUB_KEY || !import.meta.env.VITE_ANTHROPIC_KEY) && (
        <Card className="card-scifi border-2 border-gold-1/50 bg-gold-1/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gold-1">
              <Zap size={20} />
              Configuration API Requise
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="font-semibold mb-2">Clés API à ajouter dans <code className="bg-background px-2 py-1 rounded">.env.local</code>:</p>
              <pre className="bg-background p-3 rounded text-sm text-cyan-2 overflow-x-auto">
{`# Données de Marché
VITE_FINNHUB_KEY=votre_clé_finnhub

# Données Économiques
VITE_ALPHA_VANTAGE_KEY=votre_clé_alpha_vantage

# Intelligence Artificielle (Claude)
VITE_ANTHROPIC_KEY=votre_clé_anthropic`}
              </pre>
            </div>
            <div className="space-y-2 text-sm">
              <p className="text-muted-foreground">
                📍 Obtenir vos clés API:
              </p>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Finnhub: <span className="text-cyan-2">finnhub.io</span></li>
                <li>• Alpha Vantage: <span className="text-cyan-2">alphavantage.co</span></li>
                <li>• Anthropic: <span className="text-cyan-2">console.anthropic.com</span></li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
