import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { InsidersService } from '@/services/insidersService';
import { TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';

export function InsidersActivity() {
  const [selectedSymbol, setSelectedSymbol] = useState('AAPL');
  const [sentiment, setSentiment] = useState(null);
  const [transactions, setTransactions] = useState(null);
  const [loading, setLoading] = useState(false);

  const service = new InsidersService(import.meta.env.VITE_FINNHUB_KEY);
  const symbols = ['AAPL', 'MSFT', 'GOOGL', 'TSLA', 'AMZN', 'NVDA', 'META', 'JPM'];

  useEffect(() => {
    loadData();
  }, [selectedSymbol]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [sentimentData, txnData] = await Promise.all([
        service.getInsiderSentiment(selectedSymbol, 30),
        service.getInsiderTransactions(selectedSymbol, 10)
      ]);
      setSentiment(sentimentData);
      setTransactions(txnData.data);
    } catch (error) {
      console.error('Error loading insider data:', error);
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
      <div>
        <h1 className="text-4xl font-bold flex items-center gap-2">
          👔 Insiders Activity
        </h1>
        <p className="text-muted-foreground mt-1">
          Track insider buying/selling - executives' moves
        </p>
      </div>

      {/* Symbol Selector */}
      <Card className="card-scifi">
        <CardContent className="pt-6">
          <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
            {symbols.map(symbol => (
              <button
                key={symbol}
                onClick={() => setSelectedSymbol(symbol)}
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all border ${
                  selectedSymbol === symbol
                    ? 'border-cyan-1/50 bg-cyan-1/10 text-cyan-1'
                    : 'border-border/30'
                }`}
              >
                {symbol}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Sentiment Overview */}
      {sentiment && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Main Sentiment */}
          <Card className={`card-scifi border-${
            sentiment.sentiment === 'bullish' ? 'green' : 'red'
          }-500/30 bg-${sentiment.sentiment === 'bullish' ? 'green' : 'red'}-500/5`}>
            <CardHeader>
              <CardTitle className="text-sm">Insider Sentiment (30d)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <p className={`text-4xl font-bold ${
                  sentiment.sentiment === 'bullish' ? 'text-green-500' : 'text-red-500'
                }`}>
                  {sentiment.sentiment.toUpperCase()}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  {sentiment.buys} Buys | {sentiment.sells} Sells
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="p-2 bg-background/50 rounded">
                  <p className="text-xs text-muted-foreground">Net Buys</p>
                  <p className={`font-bold ${sentiment.netBuys > 0 ? 'text-green-500' : 'text-red-500'}`}>
                    +{sentiment.netBuys}
                  </p>
                </div>
                <div className="p-2 bg-background/50 rounded">
                  <p className="text-xs text-muted-foreground">Confidence</p>
                  <p className="font-bold text-cyan-1">
                    {(sentiment.confidence * 100).toFixed(0)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Volume Stats */}
          <Card className="card-scifi">
            <CardHeader>
              <CardTitle className="text-sm">Transaction Volume</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-xs text-green-500 font-semibold">Buy Volume</p>
                <p className="text-2xl font-bold">{formatValue(sentiment.buyVolume)}</p>
              </div>
              <div>
                <p className="text-xs text-red-500 font-semibold">Sell Volume</p>
                <p className="text-2xl font-bold">{formatValue(sentiment.sellVolume)}</p>
              </div>
              <div className="border-t border-border/30 pt-3">
                <p className="text-xs text-cyan-1 font-semibold">Net Flow</p>
                <p className="text-2xl font-bold text-gold-1">
                  {formatValue(sentiment.netFlow)}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Top Executives */}
      {sentiment && sentiment.topExecutives && (
        <Card className="card-scifi">
          <CardHeader>
            <CardTitle className="text-sm">Top Active Executives</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {sentiment.topExecutives.map((exec, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-background/50 border border-border/30"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold text-sm text-cyan-1">{exec.name}</p>
                      <p className="text-xs text-muted-foreground">{exec.title}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${
                      exec.buys > exec.sells
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {exec.buys > exec.sells ? '📈 Bullish' : '📉 Bearish'}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <p className="text-muted-foreground">Buys</p>
                      <p className="font-bold text-green-500">{exec.buys}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Sells</p>
                      <p className="font-bold text-red-500">{exec.sells}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Volume</p>
                      <p className="font-bold text-cyan-1">
                        {(exec.buyVolume / 1e6).toFixed(1)}M
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Transactions */}
      {transactions && (
        <Card className="card-scifi">
          <CardHeader>
            <CardTitle className="text-sm">Recent Insider Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {transactions.map((txn, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-background/50 border border-border/30 hover:border-cyan-1/30 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{txn.insiderName}</p>
                      <p className="text-xs text-muted-foreground">{txn.title}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2">
                        {txn.isPositive ? (
                          <TrendingUp className="text-green-500" size={16} />
                        ) : (
                          <TrendingDown className="text-red-500" size={16} />
                        )}
                        <span className={`font-bold ${txn.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                          {txn.isPositive ? 'BUY' : 'SELL'}
                        </span>
                      </div>
                      <p className="text-sm font-bold mt-1">{formatValue(txn.value)}</p>
                      <p className="text-xs text-muted-foreground">
                        {txn.date.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Info */}
      <Card className="card-scifi bg-cyan-1/5 border-cyan-1/20">
        <CardContent className="pt-6 text-sm text-muted-foreground">
          👔 <strong>Insider Trading:</strong> When executives buy, it often signals confidence in the company. Mass selling can be bearish.
        </CardContent>
      </Card>
    </div>
  );
}
