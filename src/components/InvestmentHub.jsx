import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { WhalesTracker } from './WhalesTracker';
import { InsidersActivity } from './InsidersActivity';
import { MajorFundsHoldings } from './MajorFundsHoldings';
import { MegaDealsTracker } from './MegaDealsTracker';
import { SmartMoneyTimeline } from './SmartMoneyTimeline';
import { TrendingUp, Users, Building2, Zap, Wallet, Clock } from 'lucide-react';

export function InvestmentHub() {
  const [activeTab, setActiveTab] = useState('whales');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-1 to-gold-1 flex items-center justify-center">
          <Wallet className="text-background" size={24} />
        </div>
        <div>
          <h1 className="text-4xl font-bold">Investment Intelligence</h1>
          <p className="text-muted-foreground">
            Whales · Insiders · Mega Funds · Mega Deals
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="card-scifi">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">🐋 Whale Trades</p>
            <p className="text-2xl font-bold text-cyan-1">$500M+</p>
            <p className="text-xs text-gold-1 mt-1">Last 24h</p>
          </CardContent>
        </Card>
        <Card className="card-scifi">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">👔 Insider Activity</p>
            <p className="text-2xl font-bold text-green-500">+45</p>
            <p className="text-xs text-gold-1 mt-1">Net Buys (30d)</p>
          </CardContent>
        </Card>
        <Card className="card-scifi">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">🏦 Fund Holdings</p>
            <p className="text-2xl font-bold text-gold-1">$27T</p>
            <p className="text-xs text-gold-1 mt-1">Total AUM</p>
          </CardContent>
        </Card>
        <Card className="card-scifi">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">🚀 Mega Deals</p>
            <p className="text-2xl font-bold text-cyan-1">$52B</p>
            <p className="text-xs text-gold-1 mt-1">AI Funding YTD</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-background/50 border border-border/30">
          <TabsTrigger value="timeline">
            <Clock size={16} className="mr-2" />
            Timeline
          </TabsTrigger>
          <TabsTrigger value="whales">
            <TrendingUp size={16} className="mr-2" />
            Whales
          </TabsTrigger>
          <TabsTrigger value="insiders">
            <Users size={16} className="mr-2" />
            Insiders
          </TabsTrigger>
          <TabsTrigger value="funds">
            <Building2 size={16} className="mr-2" />
            Funds
          </TabsTrigger>
          <TabsTrigger value="deals">
            <Zap size={16} className="mr-2" />
            Deals
          </TabsTrigger>
        </TabsList>

        {/* Timeline Tab */}
        <TabsContent value="timeline">
          <SmartMoneyTimeline />
        </TabsContent>

        {/* Whales Tab */}
        <TabsContent value="whales">
          <WhalesTracker />
        </TabsContent>

        {/* Insiders Tab */}
        <TabsContent value="insiders">
          <InsidersActivity />
        </TabsContent>

        {/* Funds Tab */}
        <TabsContent value="funds">
          <MajorFundsHoldings />
        </TabsContent>

        {/* Deals Tab */}
        <TabsContent value="deals">
          <MegaDealsTracker />
        </TabsContent>
      </Tabs>

      {/* How It Works */}
      <Card className="card-scifi border-gold-1/30 bg-gold-1/5">
        <CardHeader>
          <CardTitle className="text-gold-1 text-sm">📖 How to Use Investment Intelligence</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <div>
            <p className="font-semibold text-cyan-1 mb-1">🐋 Whales Tracker</p>
            <p>Track large transactions ($100k+). When whales move, big money is positioning. Follow their moves.</p>
          </div>
          <div>
            <p className="font-semibold text-cyan-1 mb-1">👔 Insiders Activity</p>
            <p>Executives buying = bullish signal. Mass selling = bearish. They know their companies best.</p>
          </div>
          <div>
            <p className="font-semibold text-cyan-1 mb-1">🏦 Major Funds Holdings</p>
            <p>See what Berkshire, BlackRock, Vanguard hold. These moves affect entire markets. Copy their homework.</p>
          </div>
          <div>
            <p className="font-semibold text-cyan-1 mb-1">🚀 Mega Deals</p>
            <p>Billions flowing into AI, biotech, space? Growth is coming. Track funding trends for sector tailwinds.</p>
          </div>
        </CardContent>
      </Card>

      {/* Key Signals */}
      <Card className="card-scifi">
        <CardHeader>
          <CardTitle className="text-sm">🎯 Key Signals to Watch</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30">
              <p className="font-bold text-green-500 mb-1">✅ Bullish Signals</p>
              <ul className="text-muted-foreground space-y-1 text-xs">
                <li>• Insiders buying heavily</li>
                <li>• Whales accumulating</li>
                <li>• Mega funds increasing position</li>
                <li>• Big funding round = growth</li>
              </ul>
            </div>
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30">
              <p className="font-bold text-red-500 mb-1">⚠️ Bearish Signals</p>
              <ul className="text-muted-foreground space-y-1 text-xs">
                <li>• Insiders mass selling</li>
                <li>• Whales dumping shares</li>
                <li>• Mega funds divesting</li>
                <li>• Funding slowdown in sector</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Integration Notes */}
      <Card className="card-scifi bg-cyan-1/5 border-cyan-1/20">
        <CardContent className="pt-6 text-sm text-muted-foreground space-y-2">
          <p>
            💡 <strong>Real Data:</strong> This system uses Finnhub (whales, insiders), SEC EDGAR (fund holdings), and News APIs (mega deals).
          </p>
          <p>
            🔑 <strong>API Keys Needed:</strong> Finnhub for best results. SEC EDGAR is 100% free. NewsAPI optional for deal tracking.
          </p>
          <p>
            🎯 <strong>Combined Strategy:</strong> When whales + insiders + funds all buy = major opportunity. Watch for convergence!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
