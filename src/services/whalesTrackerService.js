// Service pour tracker les grosses transactions (Whales)
// Données de volumes anormalement hauts + gros ordres

export class WhalesTrackerService {
  constructor(apiKey = null) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://finnhub.io/api/v1';
    this.useRealAPI = !!apiKey;
  }

  // Obtenir les transactions importantes (Whales)
  async getWhaleTransactions(symbol = 'AAPL', limit = 50) {
    if (this.useRealAPI && this.apiKey) {
      try {
        // Finnhub API endpoint pour trades importants
        const response = await fetch(
          `${this.baseUrl}/stock/trades?symbol=${symbol}&limit=${limit}&token=${this.apiKey}`
        );

        if (!response.ok) throw new Error(`API Error: ${response.status}`);
        const data = await response.json();

        // Filtrer les grandes transactions (whale trades)
        return {
          success: true,
          data: this.filterWhaleTransactions(data.results || [], symbol),
          source: 'real'
        };
      } catch (error) {
        console.warn('Finnhub API failed, using mock data:', error);
        return this.getMockWhaleTransactions(symbol);
      }
    }
    return this.getMockWhaleTransactions(symbol);
  }

  // Filtrer transactions whale (> 100k USD)
  filterWhaleTransactions(trades, symbol) {
    const WHALE_THRESHOLD = 100000; // 100k USD minimum

    return trades
      .filter(trade => {
        const value = trade.p * trade.s; // price * size
        return value > WHALE_THRESHOLD;
      })
      .map(trade => ({
        timestamp: new Date(trade.t * 1000),
        symbol: symbol,
        price: parseFloat(trade.p.toFixed(2)),
        size: parseInt(trade.s),
        value: parseFloat((trade.p * trade.s).toFixed(2)),
        exchange: trade.x || 'UNKNOWN',
        condition: trade.c ? trade.c[0] : '',
        isWhale: true
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 20);
  }

  // Obtenir pattern d'achats/ventes pour un symbole
  async getWhalePattern(symbol = 'AAPL', days = 7) {
    const transactions = await this.getWhaleTransactions(symbol, 100);

    if (!transactions.success) {
      return this.getMockWhalePattern(symbol, days);
    }

    const now = Date.now();
    const cutoff = now - (days * 24 * 60 * 60 * 1000);

    const pattern = {
      symbol,
      period: `${days}j`,
      totalBuys: 0,
      totalSells: 0,
      netFlow: 0,
      buyVolume: 0,
      sellVolume: 0,
      largestBuy: null,
      largestSell: null,
      sentiment: 'neutral',
      transactions: []
    };

    // Note: Finnhub ne donne pas buy/sell direction directement
    // On doit utiliser d'autres signaux
    // Pour démo, on simule basé sur prix

    return pattern;
  }

  // Détecter activité whale suspecte
  async detectWhaleActivity(symbol = 'AAPL') {
    const transactions = await this.getWhaleTransactions(symbol);

    if (!transactions.success) {
      return this.getMockWhaleActivity(symbol);
    }

    const recentTransactions = transactions.data.slice(0, 5);

    // Analyser patterns
    const totalVolume = recentTransactions.reduce((sum, t) => sum + t.size, 0);
    const totalValue = recentTransactions.reduce((sum, t) => sum + t.value, 0);
    const avgPrice = totalValue / totalVolume;

    // Déterminer sentiment basé sur patterns
    const largestTrade = recentTransactions[0];
    const priceDeviation = ((largestTrade.price - avgPrice) / avgPrice) * 100;

    return {
      success: true,
      symbol,
      activity: {
        recentWhales: recentTransactions.length,
        totalVolume: parseInt(totalVolume),
        totalValue: parseFloat(totalValue.toFixed(2)),
        avgPrice: parseFloat(avgPrice.toFixed(2)),
        sentiment: priceDeviation > 2 ? 'bullish' : priceDeviation < -2 ? 'bearish' : 'neutral',
        riskLevel: recentTransactions.length > 3 ? 'high' : 'normal',
        trades: recentTransactions
      },
      source: 'real'
    };
  }

  // Mock data - Grosses transactions
  getMockWhaleTransactions(symbol = 'AAPL') {
    const now = Date.now();
    const whales = [
      {
        timestamp: new Date(now - 3600000),
        symbol: symbol,
        price: 189.50,
        size: 50000,
        value: 9475000,
        exchange: 'NASDAQ',
        condition: '✅',
        isWhale: true
      },
      {
        timestamp: new Date(now - 7200000),
        symbol: symbol,
        price: 189.45,
        size: 75000,
        value: 14208750,
        exchange: 'NASDAQ',
        condition: '✅',
        isWhale: true
      },
      {
        timestamp: new Date(now - 10800000),
        symbol: symbol,
        price: 189.30,
        size: 100000,
        value: 18930000,
        exchange: 'NYSE',
        condition: '⚠️',
        isWhale: true
      },
      {
        timestamp: new Date(now - 14400000),
        symbol: symbol,
        price: 189.20,
        size: 45000,
        value: 8514000,
        exchange: 'NASDAQ',
        condition: '✅',
        isWhale: true
      },
      {
        timestamp: new Date(now - 18000000),
        symbol: symbol,
        price: 189.60,
        size: 125000,
        value: 23700000,
        exchange: 'NYSE',
        condition: '✅',
        isWhale: true
      }
    ];

    return {
      success: true,
      data: whales,
      source: 'mock'
    };
  }

  // Mock pattern
  getMockWhalePattern(symbol = 'AAPL', days = 7) {
    return {
      success: true,
      symbol,
      period: `${days}j`,
      totalBuys: 5,
      totalSells: 3,
      netFlow: 2,
      buyVolume: 450000,
      sellVolume: 220000,
      largestBuy: { size: 125000, price: 189.60, value: 23700000 },
      largestSell: { size: 100000, price: 190.20, value: 19020000 },
      sentiment: 'bullish',
      confidence: 0.72,
      transactions: [
        { type: 'BUY', size: 125000, price: 189.60, value: 23700000, time: '2h ago' },
        { type: 'BUY', size: 75000, price: 189.45, value: 14208750, time: '4h ago' },
        { type: 'SELL', size: 100000, price: 190.20, value: 19020000, time: '6h ago' },
        { type: 'BUY', size: 100000, price: 189.30, value: 18930000, time: '7h ago' },
        { type: 'BUY', size: 50000, price: 189.50, value: 9475000, time: '8h ago' }
      ]
    };
  }

  // Mock activité whale
  getMockWhaleActivity(symbol = 'AAPL') {
    return {
      success: true,
      symbol,
      activity: {
        recentWhales: 5,
        totalVolume: 395000,
        totalValue: 74827750,
        avgPrice: 189.43,
        sentiment: 'bullish',
        riskLevel: 'high',
        indicator: '🐋 Whale accumulation detected!',
        trades: [
          {
            timestamp: new Date(),
            symbol,
            price: 189.60,
            size: 125000,
            value: 23700000,
            exchange: 'NYSE',
            isWhale: true
          }
        ]
      },
      source: 'mock'
    };
  }

  // Obtenir top symboles avec activité whale
  async getTopWhaleSymbols(limit = 10) {
    // En production, parcourir les S&P 500
    const symbols = ['AAPL', 'MSFT', 'TSLA', 'AMZN', 'NVDA', 'META', 'GOOGL', 'BRK.B', 'JPM', 'V'];

    const topSymbols = [];
    for (const symbol of symbols.slice(0, limit)) {
      try {
        const activity = await this.detectWhaleActivity(symbol);
        if (activity.success) {
          topSymbols.push({
            symbol,
            whaleCount: activity.activity.recentWhales,
            totalValue: activity.activity.totalValue,
            sentiment: activity.activity.sentiment
          });
        }
      } catch (error) {
        console.warn(`Error fetching ${symbol}:`, error);
      }
    }

    return topSymbols.sort((a, b) => b.totalValue - a.totalValue);
  }
}
