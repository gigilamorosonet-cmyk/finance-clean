import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { MegaDealsService } from '@/services/megaDealsService';
import { TrendingUp, Zap, Flame } from 'lucide-react';

export function MegaDealsTracker() {
  const [deals, setDeals] = useState(null);
  const [sectors, setSectors] = useState(null);
  const [trends, setTrends] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');

  const service = new MegaDealsService();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [dealsData, sectorsData, trendsData] = await Promise.all([
        service.getMegaDeals(30),
        service.getFundingBySector(),
        service.getHotTrends()
      ]);
      setDeals(dealsData.data || []);
      setSectors(sectorsData || []);
      setTrends(trendsData);
    } catch (error) {
      console.error('Error loading deals:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatValue = (value) => {
    if (!value) return 'N/A';
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    return `$${value.toLocaleString()}`;
  };

  const filteredDeals = deals?.filter(deal => {
    if (filter === 'all') return true;
    return deal.dealType === filter;
  }) || [];

  const dealTypes = ['all', 'Series Funding', 'Investment', 'Acquisition', 'IPO'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold flex items-center gap-2">
          🚀 Mega Deals Tracker
        </h1>
        <p className="text-muted-foreground mt-1">
          SoftBank, SpaceX, Anthropic, OpenAI - track massive funding rounds
        </p>
      </div>

      {/* Hot Trends */}
      {trends && (
        <Card className="card-scifi border-gold-1/30 bg-gold-1/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gold-1">
              <Flame />
              Hot Sectors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {trends.topSectors.map((sector, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-background/50 border border-gold-1/20 text-center">
                  <p className="font-bold text-sm text-cyan-1">{sector.sector}</p>
                  <p className="text-2xl font-bold text-gold-1 mt-1">{sector.totalFunding}</p>
                  <p className="text-xs text-muted-foreground mt-1">{sector.deals} deals</p>
                  <p className="text-xs text-gold-1 font-semibold mt-2">{sector.trend}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {dealTypes.map(type => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
              filter === type
                ? 'bg-cyan-1 text-background'
                : 'bg-border/30 text-muted-foreground hover:bg-border/50'
            }`}
          >
            {type === 'all' ? 'All Deals' : type}
            {type !== 'all' && deals && ` (${deals.filter(d => d.dealType === type).length})`}
          </button>
        ))}
      </div>

      {/* Deals List */}
      {loading ? (
        <div className="text-center py-8 text-muted-foreground">Loading deals...</div>
      ) : filteredDeals.length > 0 ? (
        <div className="space-y-3">
          {filteredDeals.map((deal, idx) => (
            <Card key={idx} className="card-scifi hover:border-cyan-1/50 transition-colors cursor-pointer">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <p className="font-bold text-cyan-1 line-clamp-2">{deal.title}</p>
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                      {deal.description}
                    </p>
                  </div>
                  <div className="text-right ml-4">
                    <p className={`text-2xl font-bold ${
                      deal.sentiment === 'positive' ? 'text-green-500' : 'text-muted-foreground'
                    }`}>
                      {formatValue(deal.amount)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex gap-2">
                    <span className="bg-border/30 px-2 py-1 rounded">{deal.dealType}</span>
                    <span className="bg-border/30 px-2 py-1 rounded">{deal.source}</span>
                  </div>
                  <span>{new Date(deal.date).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">No deals found</div>
      )}

      {/* Sector Funding */}
      {sectors && (
        <Card className="card-scifi">
          <CardHeader>
            <CardTitle className="text-sm">📊 Funding by Sector (YTD)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {sectors.slice(0, 5).map((sector, idx) => (
                <div key={idx}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-semibold">{sector.sector}</span>
                    <span className="text-sm text-gold-1 font-bold">{sector.totalFunding}</span>
                  </div>
                  <div className="h-2 bg-background rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-1 to-gold-1"
                      style={{ width: `${Math.min((parseFloat(sector.totalFunding) / 60) * 100, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {sector.count} deals · Avg: {sector.avgDeal}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Info */}
      <Card className="card-scifi bg-cyan-1/5 border-cyan-1/20">
        <CardContent className="pt-6 text-sm text-muted-foreground space-y-2">
          <p>
            🚀 <strong>Mega Deals:</strong> Track massive funding rounds and M&A activity. AI is dominating with $52B+!
          </p>
          <p>
            📈 <strong>Trend:</strong> When billions flow into a sector, public companies in that space often rally.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
