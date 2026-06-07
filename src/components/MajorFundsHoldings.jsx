import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { SecEdgarService } from '@/services/secEdgarService';
import { TrendingUp, Target } from 'lucide-react';

export function MajorFundsHoldings() {
  const [selectedFund, setSelectedFund] = useState('BRK.B');
  const [holdings, setHoldings] = useState(null);
  const [sectors, setSectors] = useState(null);
  const [loading, setLoading] = useState(false);

  const service = new SecEdgarService();
  const funds = [
    { symbol: 'BRK.B', name: 'Berkshire Hathaway', amount: '$383B AUM' },
    { symbol: 'BLK', name: 'BlackRock', amount: '$10T AUM' },
    { symbol: 'VOO', name: 'Vanguard S&P 500', amount: '$500B AUM' }
  ];

  useEffect(() => {
    loadData();
  }, [selectedFund]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [holdingsData, sectorsData] = await Promise.all([
        service.getLargestPositions(selectedFund, 10),
        service.getPositionsBySector(selectedFund)
      ]);
      setHoldings(holdingsData);
      setSectors(sectorsData);
    } catch (error) {
      console.error('Error loading fund data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatValue = (value) => {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    return `$${value.toLocaleString()}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold flex items-center gap-2">
          🏦 Major Funds Holdings
        </h1>
        <p className="text-muted-foreground mt-1">
          Berkshire, BlackRock, Vanguard - track what the big guys hold
        </p>
      </div>

      {/* Fund Selector */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {funds.map(fund => (
          <button
            key={fund.symbol}
            onClick={() => setSelectedFund(fund.symbol)}
            className={`p-4 rounded-lg border transition-all text-left ${
              selectedFund === fund.symbol
                ? 'border-cyan-1/50 bg-cyan-1/10'
                : 'border-border/30 hover:border-cyan-1/30'
            }`}
          >
            <p className="font-bold text-cyan-1">{fund.symbol}</p>
            <p className="text-sm font-semibold mt-1">{fund.name}</p>
            <p className="text-xs text-gold-1 mt-2">{fund.amount}</p>
          </button>
        ))}
      </div>

      {/* Top Holdings */}
      {holdings && (
        <Card className="card-scifi">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="text-cyan-1" />
              Top 10 Holdings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {holdings.map((holding, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-background/50 border border-border/30 hover:border-cyan-1/20"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-bold text-cyan-1">{idx + 1}. {holding.symbol}</p>
                      <p className="text-xs text-muted-foreground">{holding.sector}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gold-1">{holding.percentage}%</p>
                      <p className="text-sm">{formatValue(holding.value)}</p>
                    </div>
                  </div>
                  {/* Percentage bar */}
                  <div className="h-1.5 bg-background rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-1 to-gold-1"
                      style={{ width: `${holding.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sector Breakdown */}
      {sectors && (
        <Card className="card-scifi">
          <CardHeader>
            <CardTitle className="text-sm">📊 Sector Allocation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {sectors.slice(0, 6).map((sector, idx) => (
                <div key={idx}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-semibold">{sector.sector}</span>
                    <span className="text-sm text-gold-1 font-bold">{sector.percentage}%</span>
                  </div>
                  <div className="h-2 bg-background rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-1 to-gold-1"
                      style={{ width: `${sector.percentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {sector.holdings.length} positions · {formatValue(sector.totalValue)}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Key Insights */}
      <Card className="card-scifi border-gold-1/30 bg-gold-1/5">
        <CardHeader>
          <CardTitle className="text-sm">💡 Fund Insights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            🔍 Berkshire is heavily weighted to Technology (45%+), showing Buffett's recent shift from value to growth.
          </p>
          <p>
            📌 BlackRock, as the largest asset manager, holds significant positions across all sectors for diversification.
          </p>
          <p>
            🎯 When these mega-funds move, entire stock prices can shift. Track their changes for market signals.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
