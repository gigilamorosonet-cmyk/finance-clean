import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { WhalesTrackerService } from '@/services/whalesTrackerService';
import { TrendingUp, TrendingDown, AlertTriangle, Zap } from 'lucide-react';

export function WhalesTracker() {
  const [selectedSymbol, setSelectedSymbol] = useState('AAPL');
  const [whales, setWhales] = useState(null);
  const [pattern, setPattern] = useState(null);
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(false);

  const service = new WhalesTrackerService(import.meta.env.VITE_FINNHUB_KEY);

  const symbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'NVDA', 'META', 'NFLX'];

  useEffect(() => {
    loadData();
  }, [selectedSymbol]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [whalesData, patternData, activityData] = await Promise.all([
        service.getWhaleTransactions(selectedSymbol),
        service.getWhalePattern(selectedSymbol, 7),
        service.detectWhaleActivity(selectedSymbol)
      ]);

      setWhales(whalesData.data);
      setPattern(patternData);
      setActivity(activityData.activity);
    } catch (error) {
      console.error('Error loading whale data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatValue = (value) => {
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    return `$${value.toLocaleString()}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold flex items-center gap-2">
            🐋 Whales Tracker
          </h1>
          <p className="text-muted-foreground mt-1">
            Track big transactions (whale trades &gt; $100k)
          </p>
        </div>
      </div>

      {/* Symbol Selector */}
      <Card className="card-scifi">
        <CardHeader>
          <CardTitle className="text-sm">Select Symbol</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-8 gap-2">
            {symbols.map(symbol => (
              <button
                key={symbol}
                onClick={() => setSelectedSymbol(symbol)}
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all border ${
                  selectedSymbol === symbol
                    ? 'border-cyan-1/50 bg-cyan-1/10 text-cyan-1'
                    : 'border-border/30 hover:border-cyan-1/30'
                }`}
              >
                {symbol}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      {activity && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="card-scifi">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Recent Whales</p>
              <p className="text-3xl font-bold text-cyan-1">{activity.recentWhales}</p>
            </CardContent>
          </Card>
          <Card className="card-scifi">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Total Volume</p>
              <p className="text-3xl font-bold text-gold-1">
                {(activity.totalVolume / 1e6).toFixed(1)}M
              </p>
            </CardContent>
          </Card>
          <Card className="card-scifi">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Total Value</p>
              <p className="text-3xl font-bold text-green-500">
                {formatValue(activity.totalValue)}
              </p>
            </CardContent>
          </Card>
          <Card className={`card-scifi border-${
            activity.sentiment === 'bullish' ? 'green' : activity.sentiment === 'bearish' ? 'red' : 'cyan'
          }-500/30`}>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Sentiment</p>
              <p className={`text-2xl font-bold ${
                activity.sentiment === 'bullish' ? 'text-green-500' : activity.sentiment === 'bearish' ? 'text-red-500' : 'text-cyan-1'
              }`}>
                {activity.sentiment.toUpperCase()}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Whale Transactions Table */}
      <Card className="card-scifi">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="text-gold-1" size={20} />
            Whale Transactions (Last 24h)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading...</div>
          ) : whales && whales.length > 0 ? (
            <div className="space-y-2 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/30">
                    <th className="text-left py-2 px-3 text-muted-foreground">Time</th>
                    <th className="text-left py-2 px-3 text-muted-foreground">Symbol</th>
                    <th className="text-right py-2 px-3 text-muted-foreground">Price</th>
                    <th className="text-right py-2 px-3 text-muted-foreground">Size</th>
                    <th className="text-right py-2 px-3 text-muted-foreground">Value</th>
                    <th className="text-left py-2 px-3 text-muted-foreground">Exchange</th>
                  </tr>
                </thead>
                <tbody>
                  {whales.map((whale, idx) => (
                    <tr
                      key={idx}
                      className="border-b border-border/20 hover:bg-border/10 transition-colors"
                    >
                      <td className="py-3 px-3">
                        <span className="text-xs">
                          {whale.timestamp.toLocaleTimeString()}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-semibold text-cyan-1">
                        {whale.symbol}
                      </td>
                      <td className="py-3 px-3 text-right">
                        ${whale.price.toFixed(2)}
                      </td>
                      <td className="py-3 px-3 text-right text-gold-1">
                        {(whale.size / 1e6).toFixed(2)}M
                      </td>
                      <td className="py-3 px-3 text-right font-semibold text-green-500">
                        {formatValue(whale.value)}
                      </td>
                      <td className="py-3 px-3 text-xs">
                        <span className="bg-border/30 px-2 py-1 rounded">
                          {whale.exchange}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No whale transactions found
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pattern Analysis */}
      {pattern && (
        <Card className="card-scifi">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="text-gold-1" />
              Whale Sentiment (7 days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Buys */}
              <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30">
                <p className="text-sm text-muted-foreground mb-2">Whale Buys</p>
                <div>
                  <p className="text-3xl font-bold text-green-500">{pattern.totalBuys}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Volume: {formatValue(pattern.buyVolume)}
                  </p>
                </div>
              </div>

              {/* Sells */}
              <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30">
                <p className="text-sm text-muted-foreground mb-2">Whale Sells</p>
                <div>
                  <p className="text-3xl font-bold text-red-500">{pattern.totalSells}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Volume: {formatValue(pattern.sellVolume)}
                  </p>
                </div>
              </div>

              {/* Net */}
              <div className={`p-4 rounded-lg border ${
                pattern.sentiment === 'bullish'
                  ? 'bg-green-500/10 border-green-500/30'
                  : 'bg-red-500/10 border-red-500/30'
              }`}>
                <p className="text-sm text-muted-foreground mb-2">Sentiment</p>
                <div>
                  <p className={`text-3xl font-bold ${
                    pattern.sentiment === 'bullish' ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {pattern.sentiment.toUpperCase()}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Confidence: {(pattern.confidence * 100).toFixed(0)}%
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Info */}
      <Card className="card-scifi bg-cyan-1/5 border-cyan-1/20">
        <CardContent className="pt-6 text-sm text-muted-foreground space-y-2">
          <p>
            🐋 <strong>Whale Tracking:</strong> Identifies large transactions (&gt;$100k) that indicate institutional activity.
          </p>
          <p>
            📊 <strong>How to Use:</strong> Whales moving into a stock often signal bullish/bearish sentiment. Track their patterns.
          </p>
          <p>
            ⚠️ <strong>Note:</strong> This data requires Finnhub API. Using mock data for demo mode.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
