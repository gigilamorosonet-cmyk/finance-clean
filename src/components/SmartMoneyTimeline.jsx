import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { WhalesTrackerService } from '@/services/whalesTrackerService';
import { InsidersService } from '@/services/insidersService';
import { MegaDealsService } from '@/services/megaDealsService';
import { TrendingUp, TrendingDown, AlertCircle, Zap } from 'lucide-react';

export function SmartMoneyTimeline() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, whales, insiders, deals
  const [sortBy, setSortBy] = useState('recent'); // recent, impact

  const whalesService = new WhalesTrackerService(import.meta.env.VITE_FINNHUB_KEY);
  const insidersService = new InsidersService(import.meta.env.VITE_FINNHUB_KEY);
  const dealsService = new MegaDealsService();

  useEffect(() => {
    loadAllEvents();
  }, []);

  const loadAllEvents = async () => {
    setLoading(true);
    try {
      const allEvents = [];

      // 1. Charger whales
      const symbols = ['AAPL', 'MSFT', 'GOOGL', 'TSLA'];
      for (const symbol of symbols) {
        const whales = await whalesService.getWhaleTransactions(symbol, 5);
        if (whales.success) {
          whales.data.forEach(whale => {
            allEvents.push({
              id: `whale-${symbol}-${whale.timestamp}`,
              type: 'whale',
              title: `🐋 Whale Trade - ${symbol}`,
              symbol: symbol,
              description: `Large order: ${(whale.size / 1e6).toFixed(1)}M shares @ $${whale.price}`,
              value: whale.value,
              sentiment: whale.value > 10e6 ? 'bullish' : 'neutral',
              timestamp: whale.timestamp,
              impact: 'high',
              icon: whale.value > 15e6 ? '🐋' : '🦐',
              details: {
                size: whale.size,
                price: whale.price,
                value: whale.value,
                exchange: whale.exchange
              }
            });
          });
        }
      }

      // 2. Charger insiders
      for (const symbol of symbols.slice(0, 2)) {
        const insiders = await insidersService.getInsiderTransactions(symbol, 5);
        if (insiders.success) {
          insiders.data.forEach(insider => {
            allEvents.push({
              id: `insider-${symbol}-${insider.date}`,
              type: 'insider',
              title: `👔 Insider ${insider.isPositive ? 'BUY' : 'SELL'} - ${symbol}`,
              symbol: symbol,
              description: `${insider.insiderName} (${insider.title}) ${insider.isPositive ? 'bought' : 'sold'} ${(insider.shares / 1e6).toFixed(1)}M shares`,
              value: insider.value,
              sentiment: insider.isPositive ? 'bullish' : 'bearish',
              timestamp: insider.date,
              impact: 'medium',
              icon: insider.isPositive ? '📈' : '📉',
              details: {
                executor: insider.insiderName,
                shares: insider.shares,
                price: insider.price,
                value: insider.value
              }
            });
          });
        }
      }

      // 3. Charger mega deals
      const deals = await dealsService.getMegaDeals(10);
      if (deals.success) {
        deals.data.forEach(deal => {
          allEvents.push({
            id: `deal-${deal.title}-${deal.date}`,
            type: 'deal',
            title: `🚀 ${deal.dealType} - ${deal.title.substring(0, 50)}...`,
            description: `Funding: ${deal.amount ? '$' + (deal.amount / 1e9).toFixed(1) + 'B' : 'N/A'}`,
            value: deal.amount || 0,
            sentiment: deal.sentiment === 'positive' ? 'bullish' : 'neutral',
            timestamp: deal.date,
            impact: deal.amount > 2e9 ? 'high' : 'medium',
            icon: '💰',
            details: {
              dealType: deal.dealType,
              source: deal.source,
              amount: deal.amount
            }
          });
        });
      }

      // Trier par date
      allEvents.sort((a, b) => b.timestamp - a.timestamp);

      setEvents(allEvents);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = events.filter(event => {
    if (filter === 'all') return true;
    return event.type === filter;
  });

  const sortedEvents = [...filteredEvents].sort((a, b) => {
    if (sortBy === 'recent') return b.timestamp - a.timestamp;
    if (sortBy === 'impact') {
      const impactScore = { high: 3, medium: 2, low: 1 };
      return (impactScore[b.impact] || 0) - (impactScore[a.impact] || 0);
    }
    return 0;
  });

  const formatValue = (value) => {
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    return `$${value.toLocaleString()}`;
  };

  const typeColors = {
    whale: { bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', text: 'text-cyan-1' },
    insider: { bg: 'bg-gold-500/10', border: 'border-gold-500/30', text: 'text-gold-1' },
    deal: { bg: 'bg-green-500/10', border: 'border-green-500/30', text: 'text-green-500' }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold flex items-center gap-2">
          📅 Smart Money Timeline
        </h1>
        <p className="text-muted-foreground mt-1">
          Tous les mouvements de smart money en temps réel
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-4">
        {/* Filter */}
        <div className="flex gap-2">
          {[
            { id: 'all', label: 'All Events', icon: '📊' },
            { id: 'whales', label: 'Whales', icon: '🐋' },
            { id: 'insiders', label: 'Insiders', icon: '👔' },
            { id: 'deals', label: 'Mega Deals', icon: '🚀' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all border ${
                filter === f.id
                  ? 'border-cyan-1/50 bg-cyan-1/10 text-cyan-1'
                  : 'border-border/30 text-muted-foreground hover:border-cyan-1/30'
              }`}
            >
              {f.icon} {f.label}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="flex gap-2">
          {[
            { id: 'recent', label: 'Recent' },
            { id: 'impact', label: 'Impact' }
          ].map(s => (
            <button
              key={s.id}
              onClick={() => setSortBy(s.id)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all border ${
                sortBy === s.id
                  ? 'border-gold-1/50 bg-gold-1/10 text-gold-1'
                  : 'border-border/30 text-muted-foreground'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="card-scifi">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Total Events</p>
            <p className="text-3xl font-bold text-cyan-1">{events.length}</p>
          </CardContent>
        </Card>
        <Card className="card-scifi">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Whales</p>
            <p className="text-3xl font-bold text-cyan-1">{events.filter(e => e.type === 'whale').length}</p>
          </CardContent>
        </Card>
        <Card className="card-scifi">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Insiders</p>
            <p className="text-3xl font-bold text-gold-1">{events.filter(e => e.type === 'insider').length}</p>
          </CardContent>
        </Card>
        <Card className="card-scifi">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Mega Deals</p>
            <p className="text-3xl font-bold text-green-500">{events.filter(e => e.type === 'deal').length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Timeline */}
      {loading ? (
        <div className="text-center py-8 text-muted-foreground">Loading smart money movements...</div>
      ) : sortedEvents.length > 0 ? (
        <div className="space-y-3">
          {sortedEvents.map((event, idx) => {
            const colors = typeColors[event.type] || typeColors.whale;
            const isHighImpact = event.impact === 'high';

            return (
              <Card
                key={event.id}
                className={`card-scifi transition-all hover:border-cyan-1/50 cursor-pointer ${
                  isHighImpact ? 'border-gold-1/50 bg-gold-1/5' : colors.border
                }`}
              >
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    {/* Timeline dot & line */}
                    <div className="flex flex-col items-center pt-1">
                      <div className={`w-3 h-3 rounded-full ${
                        event.sentiment === 'bullish' ? 'bg-green-500' : event.sentiment === 'bearish' ? 'bg-red-500' : 'bg-cyan-1'
                      }`} />
                      {idx < sortedEvents.length - 1 && (
                        <div className="w-0.5 h-12 bg-border/30 mt-2" />
                      )}
                    </div>

                    {/* Event Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <p className={`font-bold text-base ${colors.text} line-clamp-2`}>
                            {event.icon} {event.title}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {event.description}
                          </p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="font-bold text-lg text-gold-1">
                            {formatValue(event.value)}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {event.timestamp.toLocaleDateString()} {event.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>

                      {/* Impact Badge */}
                      <div className="flex gap-2 mt-3 flex-wrap">
                        <span className={`text-xs px-2 py-1 rounded ${
                          event.impact === 'high' ? 'bg-red-500/20 text-red-400' :
                          event.impact === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-blue-500/20 text-blue-400'
                        }`}>
                          {event.impact === 'high' ? '⚠️ High Impact' : event.impact === 'medium' ? '📊 Medium Impact' : '📌 Low Impact'}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded ${
                          event.sentiment === 'bullish' ? 'bg-green-500/20 text-green-400' :
                          event.sentiment === 'bearish' ? 'bg-red-500/20 text-red-400' :
                          'bg-cyan-500/20 text-cyan-400'
                        }`}>
                          {event.sentiment === 'bullish' ? '📈 Bullish' : event.sentiment === 'bearish' ? '📉 Bearish' : '〰️ Neutral'}
                        </span>
                        {event.symbol && (
                          <span className="text-xs px-2 py-1 rounded bg-border/30 text-muted-foreground">
                            {event.symbol}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          No events found for selected filter
        </div>
      )}

      {/* Info */}
      <Card className="card-scifi bg-cyan-1/5 border-cyan-1/20">
        <CardHeader>
          <CardTitle className="text-sm">📖 How to Read the Timeline</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <div>
            <p className="font-semibold text-cyan-1">🐋 Whale Events</p>
            <p>Large transactions ($100k+) indicate institutional accumulation/distribution</p>
          </div>
          <div>
            <p className="font-semibold text-gold-1">👔 Insider Events</p>
            <p>Executive buying = confidence. Selling = caution. Watch the CEO!</p>
          </div>
          <div>
            <p className="font-semibold text-green-500">🚀 Mega Deals</p>
            <p>Billions flowing into sectors signal where future growth is</p>
          </div>
          <div>
            <p className="font-semibold text-cyan-1">⚠️ Convergence Signal</p>
            <p>When whales + insiders + deals align = Strongest buy signal 🎯</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
