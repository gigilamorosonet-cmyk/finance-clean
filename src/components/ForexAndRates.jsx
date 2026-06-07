import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { ForexService } from '@/services/forexService';
import { TrendingUp, TrendingDown, DollarSign, Zap } from 'lucide-react';

export function ForexAndRates({ selectedCountry }) {
  const [exchangeRates, setExchangeRates] = useState(null);
  const [interestRates, setInterestRates] = useState(null);
  const [loading, setLoading] = useState(true);

  const forexService = new ForexService();

  useEffect(() => {
    loadData();
  }, [selectedCountry]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Déterminer devise de base selon le pays
      const baseCurrency = {
        'FR': 'EUR',
        'DE': 'EUR',
        'IT': 'EUR',
        'ES': 'EUR',
        'GB': 'GBP',
        'US': 'USD',
        'CA': 'CAD',
        'AU': 'AUD',
        'JP': 'JPY',
        'CN': 'CNY',
        'IN': 'INR',
      }[selectedCountry] || 'EUR';

      const rates = await forexService.getExchangeRates(baseCurrency);
      const irRates = forexService.getInterestRates();

      setExchangeRates(rates);
      setInterestRates(irRates);
    } catch (error) {
      console.error('Error loading forex data:', error);
    } finally {
      setLoading(false);
    }
  };

  const rateChange = (current, previous) => {
    const change = ((current - previous) / previous) * 100;
    return {
      value: change.toFixed(2),
      isPositive: change >= 0
    };
  };

  return (
    <div className="space-y-6">
      {/* Taux de Change */}
      <Card className="card-scifi">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="text-gold-1" />
            Taux de Change en Temps Réel
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Chargement des données...</p>
            </div>
          ) : exchangeRates ? (
            <div className="space-y-3">
              {Object.entries(exchangeRates.rates).map(([currency, rate]) => {
                const mockPrevious = {
                  USD: 1.09,
                  GBP: 0.84,
                  JPY: 158.50,
                  CNY: 7.90,
                  CHF: 0.94,
                  CAD: 1.47,
                  AUD: 1.67
                }[currency] || rate;

                const change = rateChange(rate, mockPrevious);

                return (
                  <div
                    key={currency}
                    className="p-4 bg-background/50 rounded-lg border border-border/30 hover:border-gold-1/30 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded bg-gradient-to-br from-gold-1/30 to-cyan-1/30 flex items-center justify-center">
                          <span className="font-bold text-xs text-gold-1">{currency}</span>
                        </div>
                        <div>
                          <p className="font-semibold text-sm">
                            {exchangeRates.base} / {currency}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Mis à jour: {new Date(exchangeRates.date).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-xl font-bold text-cyan-1">
                          {rate.toFixed(4)}
                        </p>
                        <p className={`text-sm font-semibold flex items-center justify-end gap-1 ${
                          change.isPositive ? 'text-green-500' : 'text-red-500'
                        }`}>
                          {change.isPositive ? (
                            <TrendingUp size={14} />
                          ) : (
                            <TrendingDown size={14} />
                          )}
                          {change.isPositive ? '+' : ''}{change.value}%
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">Erreur lors du chargement</p>
          )}
        </CardContent>
      </Card>

      {/* Taux Directeurs */}
      {interestRates && (
        <Card className="card-scifi bg-gradient-to-r from-cyan-1/5 to-gold-1/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="text-cyan-1" />
              Taux Directeurs Mondiaux
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {Object.entries(interestRates.data).map(([key, bank]) => (
                <div
                  key={key}
                  className="p-4 rounded-lg bg-background/50 border border-border/30 hover:border-cyan-1/30 transition-all"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-sm text-cyan-1">{bank.name}</p>
                      <p className="text-xs text-muted-foreground">{bank.currency}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${
                      bank.trend === 'up' ? 'bg-green-500/20 text-green-400' :
                      bank.trend === 'down' ? 'bg-red-500/20 text-red-400' :
                      'bg-cyan-1/20 text-cyan-1'
                    }`}>
                      {bank.trend === 'up' ? '↗' : bank.trend === 'down' ? '↘' : '→'}
                    </span>
                  </div>

                  <div className="mb-3">
                    <p className="text-2xl font-bold text-gold-1">
                      {bank.rate.toFixed(2)}%
                    </p>
                  </div>

                  <p className="text-xs text-muted-foreground leading-tight">
                    {bank.description}
                  </p>

                  {/* Progress bar */}
                  <div className="mt-3 h-1.5 bg-background rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-1 to-gold-1"
                      style={{ width: `${(bank.rate / 10) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Info */}
            <div className="mt-6 p-3 bg-cyan-1/5 border border-cyan-1/20 rounded-lg text-sm text-muted-foreground">
              <p className="text-xs">
                💡 <strong>Conseil:</strong> Les taux directeurs influencent les coûts d'emprunt, les rendements d'épargne et les marchés des devises.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
