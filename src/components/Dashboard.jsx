import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { TrendingUp, Wallet, PieChart, Eye } from 'lucide-react';

export function Dashboard() {
  const kpis = [
    {
      title: 'Wallet Balance',
      value: '$24,582.50',
      change: '+12.5%',
      icon: Wallet,
    },
    {
      title: 'Budget Savings',
      value: '$3,450.00',
      change: '+4.2%',
      icon: TrendingUp,
    },
    {
      title: 'YTD Return',
      value: '18.5%',
      change: '+2.3%',
      icon: PieChart,
    },
    {
      title: 'Watchlist',
      value: '12 Assets',
      change: 'Updated 2h ago',
      icon: Eye,
    },
  ];

  const topMarkets = [
    { symbol: 'AAPL', name: 'Apple Inc.', price: '$182.45', change: '+2.45%', trend: 'up' },
    { symbol: 'NVDA', name: 'NVIDIA Corp.', price: '$872.30', change: '+5.23%', trend: 'up' },
    { symbol: 'BTC', name: 'Bitcoin', price: '$42,580', change: '+3.12%', trend: 'up' },
    { symbol: 'EUR/USD', name: 'Euro Dollar', price: '1.0845', change: '-0.45%', trend: 'down' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-4xl font-bold mb-2">Welcome to FinVue</h1>
        <p className="text-muted-foreground">Your personal finance dashboard powered by advanced analytics</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <Card key={idx} className="card-scifi">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {kpi.title}
                  </CardTitle>
                  <Icon className="icon-glow" size={18} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-cyan-2">{kpi.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{kpi.change}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Markets Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="card-scifi">
            <CardHeader>
              <CardTitle>Top Markets</CardTitle>
              <CardDescription>Real-time market data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topMarkets.map((market, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 rounded-lg border border-border/30 hover:border-cyan-1/50 transition-colors">
                    <div>
                      <p className="font-semibold text-sm">{market.symbol}</p>
                      <p className="text-xs text-muted-foreground">{market.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm">{market.price}</p>
                      <p className={`text-xs ${market.trend === 'up' ? 'text-cyan-2' : 'text-red-500'}`}>
                        {market.change}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chart Placeholder */}
        <div className="lg:col-span-1">
          <Card className="card-scifi h-full">
            <CardHeader>
              <CardTitle className="text-lg">Portfolio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-40 rounded-lg border border-cyan-1/20">
                <p className="text-muted-foreground text-sm">Chart placeholder</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
