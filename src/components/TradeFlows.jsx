import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { ForexService } from '@/services/forexService';
import { TrendingUp, TrendingDown, ArrowRightLeft, Globe } from 'lucide-react';

export function TradeFlows({ selectedCountry }) {
  const [tradeData, setTradeData] = useState(null);
  const forexService = new ForexService();

  useEffect(() => {
    const trades = forexService.getTradeFlows();
    const countryTrade = trades.data[selectedCountry];
    setTradeData(countryTrade);
  }, [selectedCountry]);

  if (!tradeData) {
    return <div className="text-center py-8 text-muted-foreground">Chargement...</div>;
  }

  const maxTrade = Math.max(tradeData.exports, tradeData.imports);
  const tradeBalanceIsPositive = tradeData.tradeBalance >= 0;

  return (
    <div className="space-y-6">
      {/* Vue d'ensemble */}
      <Card className="card-scifi bg-gradient-to-r from-cyan-1/5 to-gold-1/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowRightLeft className="text-cyan-1" />
            Flux Commerciaux - {tradeData.country}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Exports */}
            <div className="p-4 rounded-lg bg-background/50 border border-green-500/30">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Exports</p>
                <TrendingUp className="text-green-500" size={18} />
              </div>
              <p className="text-2xl font-bold text-green-500">
                ${tradeData.exports}B
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Croissance: +{tradeData.growthRate}% YoY
              </p>
            </div>

            {/* Imports */}
            <div className="p-4 rounded-lg bg-background/50 border border-orange-500/30">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Imports</p>
                <TrendingDown className="text-orange-500" size={18} />
              </div>
              <p className="text-2xl font-bold text-orange-500">
                ${tradeData.imports}B
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Volume mensuel de biens
              </p>
            </div>

            {/* Balance */}
            <div className={`p-4 rounded-lg border ${
              tradeBalanceIsPositive
                ? 'bg-green-500/5 border-green-500/30'
                : 'bg-red-500/5 border-red-500/30'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Solde Comercial</p>
                {tradeBalanceIsPositive ? (
                  <TrendingUp className="text-green-500" size={18} />
                ) : (
                  <TrendingDown className="text-red-500" size={18} />
                )}
              </div>
              <p className={`text-2xl font-bold ${
                tradeBalanceIsPositive ? 'text-green-500' : 'text-red-500'
              }`}>
                {tradeBalanceIsPositive ? '+' : ''}{tradeData.tradeBalance}B
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {tradeBalanceIsPositive ? 'Excédent' : 'Déficit'} commercial
              </p>
            </div>
          </div>

          {/* Barres comparatives */}
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <p className="text-sm font-semibold text-green-500">Exports</p>
                <p className="text-xs text-muted-foreground">${tradeData.exports}B</p>
              </div>
              <div className="h-2 bg-background rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-500 to-green-400"
                  style={{ width: `${(tradeData.exports / maxTrade) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <p className="text-sm font-semibold text-orange-500">Imports</p>
                <p className="text-xs text-muted-foreground">${tradeData.imports}B</p>
              </div>
              <div className="h-2 bg-background rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-orange-500 to-orange-400"
                  style={{ width: `${(tradeData.imports / maxTrade) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Principaux exports */}
      <Card className="card-scifi">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            📤 Principaux Exports
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {tradeData.mainExports.map((export_, idx) => (
              <span
                key={idx}
                className="px-3 py-2 rounded-full bg-green-500/10 border border-green-500/30 text-sm text-green-400"
              >
                {export_}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Principaux imports */}
      <Card className="card-scifi">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            📥 Principaux Imports
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {tradeData.mainImports.map((import_, idx) => (
              <span
                key={idx}
                className="px-3 py-2 rounded-full bg-orange-500/10 border border-orange-500/30 text-sm text-orange-400"
              >
                {import_}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Partenaires commerciaux */}
      <Card className="card-scifi border-cyan-1/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="text-cyan-1" />
            Partenaires Commerciaux
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {tradeData.topPartners.map((partner, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg bg-background/50 border border-cyan-1/20 text-center hover:border-cyan-1/50 transition-all cursor-pointer"
              >
                <p className="text-sm font-semibold text-cyan-1">{partner}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Partenaire #{idx + 1}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-cyan-1/5 border border-cyan-1/20 rounded-lg text-sm text-muted-foreground">
            <p className="text-xs">
              💡 <strong>Insight:</strong> Les perturbations commerciales affectent les prix des matières premières et les marchés financiers.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
