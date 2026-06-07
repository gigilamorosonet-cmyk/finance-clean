import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { TrendingUp, TrendingDown, Search } from 'lucide-react';

export function Markets() {
  const markets = [
    {
      id: 1,
      symbol: 'AAPL',
      name: 'Apple Inc.',
      price: 182.45,
      change: 2.45,
      volume: '52.3M',
      marketCap: '$2.8T',
      pe: '28.5',
    },
    {
      id: 2,
      symbol: 'MSFT',
      name: 'Microsoft',
      price: 405.72,
      change: 1.82,
      volume: '18.2M',
      marketCap: '$3.0T',
      pe: '32.1',
    },
    {
      id: 3,
      symbol: 'NVDA',
      name: 'NVIDIA',
      price: 872.30,
      change: 5.23,
      volume: '31.5M',
      marketCap: '$2.1T',
      pe: '65.3',
    },
    {
      id: 4,
      symbol: 'GOOGL',
      name: 'Alphabet',
      price: 156.89,
      change: -1.23,
      volume: '22.1M',
      marketCap: '$2.0T',
      pe: '24.8',
    },
    {
      id: 5,
      symbol: 'AMZN',
      name: 'Amazon',
      price: 187.45,
      change: 3.15,
      volume: '42.7M',
      marketCap: '$1.9T',
      pe: '68.2',
    },
    {
      id: 6,
      symbol: 'TSLA',
      name: 'Tesla',
      price: 242.84,
      change: -2.45,
      volume: '108.3M',
      marketCap: '$768B',
      pe: '52.1',
    },
    {
      id: 7,
      symbol: 'BTC',
      name: 'Bitcoin',
      price: 42580,
      change: 4.32,
      volume: '28.5B',
      marketCap: '$835B',
      pe: 'N/A',
    },
    {
      id: 8,
      symbol: 'ETH',
      name: 'Ethereum',
      price: 2245.67,
      change: 6.78,
      volume: '12.3B',
      marketCap: '$269B',
      pe: 'N/A',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-2">Global Markets</h1>
        <p className="text-muted-foreground">Track stocks, crypto, and forex in real-time</p>
      </div>

      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 text-muted-foreground" size={18} />
          <input
            type="text"
            placeholder="Search markets..."
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-card border border-border focus:outline-none focus:border-cyan-1 transition-colors"
          />
        </div>
        <Button variant="outline">Filter</Button>
      </div>

      {/* Markets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {markets.map((market) => (
          <Card key={market.id} className="card-scifi cursor-pointer hover:shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{market.symbol}</CardTitle>
                  <CardDescription className="text-xs">{market.name}</CardDescription>
                </div>
                {market.change >= 0 ? (
                  <TrendingUp size={18} className="text-cyan-2" />
                ) : (
                  <TrendingDown size={18} className="text-red-500" />
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-2xl font-bold text-cyan-2">
                  {typeof market.price === 'number' && market.price > 100
                    ? `$${market.price.toLocaleString()}`
                    : market.price}
                </p>
                <p className={`text-sm font-semibold ${market.change >= 0 ? 'text-cyan-2' : 'text-red-500'}`}>
                  {market.change >= 0 ? '+' : ''}{market.change}%
                </p>
              </div>

              <div className="pt-3 space-y-2 text-xs border-t border-border/30">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Volume</span>
                  <span className="font-semibold">{market.volume}</span>
                </div>
                {market.marketCap && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Market Cap</span>
                    <span className="font-semibold">{market.marketCap}</span>
                  </div>
                )}
                {market.pe !== 'N/A' && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">P/E Ratio</span>
                    <span className="font-semibold">{market.pe}</span>
                  </div>
                )}
              </div>

              <Button variant="ghost" className="w-full mt-2 text-cyan-1 hover:text-cyan-2">
                View Details
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
