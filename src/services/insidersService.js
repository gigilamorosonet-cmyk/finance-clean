// Service pour tracker les insider trades
// Achats/ventes dirigeants via Finnhub API

export class InsidersService {
  constructor(apiKey = null) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://finnhub.io/api/v1';
    this.useRealAPI = !!apiKey;
  }

  // Obtenir insider transactions pour un symbole
  async getInsiderTransactions(symbol = 'AAPL', limit = 50) {
    if (this.useRealAPI && this.apiKey) {
      try {
        // Finnhub API: Insider transactions
        const response = await fetch(
          `${this.baseUrl}/stock/insider-transactions?symbol=${symbol}&token=${this.apiKey}`
        );

        if (!response.ok) throw new Error(`API Error: ${response.status}`);
        const data = await response.json();

        return {
          success: true,
          data: this.processInsiderData(data.data || [], symbol),
          source: 'real'
        };
      } catch (error) {
        console.warn('Finnhub insider API failed, using mock:', error);
        return this.getMockInsiderTransactions(symbol);
      }
    }
    return this.getMockInsiderTransactions(symbol);
  }

  // Traiter données insiders
  processInsiderData(transactions, symbol) {
    return transactions
      .map(t => ({
        date: new Date(t.transactionDate * 1000 || t.filingDate * 1000),
        insiderName: t.insiderName || 'Unknown',
        title: t.insiderTitle || 'Executive',
        symbol: symbol,
        transactionType: t.transactionType || 'Unknown', // BUY, SELL, etc
        shares: parseInt(t.share || 0),
        price: parseFloat(t.price || 0),
        value: parseInt(t.share || 0) * parseFloat(t.price || 0),
        sharesAfter: parseInt(t.sharesAfterTransaction || 0),
        url: t.link || null,
        isPositive: (t.transactionType || '').toUpperCase() === 'BUY'
      }))
      .filter(t => t.value > 0)
      .sort((a, b) => b.date - a.date)
      .slice(0, limit);
  }

  // Analyser sentiment insiders
  async getInsiderSentiment(symbol = 'AAPL', days = 30) {
    const transactions = await this.getInsiderTransactions(symbol, 100);

    if (!transactions.success) {
      return this.getMockInsiderSentiment(symbol);
    }

    const now = Date.now();
    const cutoff = now - (days * 24 * 60 * 60 * 1000);

    const recentTxs = transactions.data.filter(t => t.date.getTime() > cutoff);

    const buys = recentTxs.filter(t => t.isPositive).length;
    const sells = recentTxs.filter(t => !t.isPositive).length;
    const buyVolume = recentTxs
      .filter(t => t.isPositive)
      .reduce((sum, t) => sum + t.shares, 0);
    const sellVolume = recentTxs
      .filter(t => !t.isPositive)
      .reduce((sum, t) => sum + t.shares, 0);

    const netBuys = buys - sells;
    const sentiment = netBuys > sells ? 'bullish' : netBuys < sells ? 'bearish' : 'neutral';

    return {
      success: true,
      symbol,
      period: `${days}j`,
      totalTransactions: recentTxs.length,
      buys,
      sells,
      netBuys,
      buyVolume,
      sellVolume,
      netFlow: buyVolume - sellVolume,
      sentiment,
      confidence: Math.abs(netBuys) > 5 ? 0.8 : Math.abs(netBuys) > 2 ? 0.6 : 0.4,
      topExecutives: this.getTopExecutives(recentTxs),
      source: 'real'
    };
  }

  // Obtenir top executives par volume
  getTopExecutives(transactions) {
    const executives = {};

    transactions.forEach(t => {
      if (!executives[t.insiderName]) {
        executives[t.insiderName] = {
          name: t.insiderName,
          title: t.title,
          buys: 0,
          sells: 0,
          buyVolume: 0,
          sellVolume: 0
        };
      }

      if (t.isPositive) {
        executives[t.insiderName].buys++;
        executives[t.insiderName].buyVolume += t.shares;
      } else {
        executives[t.insiderName].sells++;
        executives[t.insiderName].sellVolume += t.shares;
      }
    });

    return Object.values(executives)
      .sort((a, b) => (b.buyVolume + b.sellVolume) - (a.buyVolume + a.sellVolume))
      .slice(0, 5);
  }

  // Déterminer si insiders sont accumulant (bullish)
  async isInsiderAccumulating(symbol = 'AAPL', threshold = 3) {
    const sentiment = await this.getInsiderSentiment(symbol, 30);

    if (!sentiment.success) {
      return { accumulating: false, reason: 'No data' };
    }

    if (sentiment.netBuys >= threshold) {
      return {
        accumulating: true,
        reason: `Insiders netBuys: ${sentiment.netBuys}`,
        confidence: sentiment.confidence,
        sentiment: sentiment.sentiment
      };
    }

    return {
      accumulating: false,
      reason: `Net buys: ${sentiment.netBuys} (< ${threshold})`,
      confidence: sentiment.confidence,
      sentiment: sentiment.sentiment
    };
  }

  // Mock data - Insider transactions
  getMockInsiderTransactions(symbol = 'AAPL') {
    const now = Date.now();
    return {
      success: true,
      data: [
        {
          date: new Date(now - 86400000),
          insiderName: 'Tim Cook',
          title: 'Chief Executive Officer',
          symbol,
          transactionType: 'BUY',
          shares: 50000,
          price: 189.45,
          value: 9472500,
          sharesAfter: 1500000,
          isPositive: true
        },
        {
          date: new Date(now - 172800000),
          insiderName: 'Luca Maestri',
          title: 'Chief Financial Officer',
          symbol,
          transactionType: 'BUY',
          shares: 35000,
          price: 188.90,
          value: 6611500,
          sharesAfter: 850000,
          isPositive: true
        },
        {
          date: new Date(now - 259200000),
          insiderName: 'Susan Wagner',
          title: 'Board Director',
          symbol,
          transactionType: 'SELL',
          shares: 100000,
          price: 190.20,
          value: 19020000,
          sharesAfter: 200000,
          isPositive: false
        },
        {
          date: new Date(now - 345600000),
          insiderName: 'Craig Federighi',
          title: 'Senior Vice President',
          symbol,
          transactionType: 'BUY',
          shares: 25000,
          price: 187.50,
          value: 4687500,
          sharesAfter: 500000,
          isPositive: true
        },
        {
          date: new Date(now - 432000000),
          insiderName: 'Tim Cook',
          title: 'Chief Executive Officer',
          symbol,
          transactionType: 'BUY',
          shares: 75000,
          price: 185.30,
          value: 13897500,
          sharesAfter: 1450000,
          isPositive: true
        }
      ],
      source: 'mock'
    };
  }

  // Mock sentiment
  getMockInsiderSentiment(symbol = 'AAPL') {
    return {
      success: true,
      symbol,
      period: '30j',
      totalTransactions: 10,
      buys: 7,
      sells: 3,
      netBuys: 4,
      buyVolume: 185000,
      sellVolume: 100000,
      netFlow: 85000,
      sentiment: 'bullish',
      confidence: 0.75,
      indicator: '✅ Insiders ACCUMULATING - Bullish Signal',
      topExecutives: [
        {
          name: 'Tim Cook',
          title: 'Chief Executive Officer',
          buys: 3,
          sells: 0,
          buyVolume: 125000,
          sellVolume: 0
        },
        {
          name: 'Luca Maestri',
          title: 'Chief Financial Officer',
          buys: 2,
          sells: 0,
          buyVolume: 60000,
          sellVolume: 0
        },
        {
          name: 'Susan Wagner',
          title: 'Board Director',
          buys: 1,
          sells: 1,
          buyVolume: 0,
          sellVolume: 100000
        }
      ],
      source: 'mock'
    };
  }

  // Obtenir insiders suspects (selling tout)
  async getSuspiciousInsiders(symbol = 'AAPL', threshold = 5) {
    const transactions = await this.getInsiderTransactions(symbol, 50);

    if (!transactions.success) {
      return [];
    }

    const insiderStats = {};

    transactions.data.forEach(t => {
      if (!insiderStats[t.insiderName]) {
        insiderStats[t.insiderName] = {
          name: t.insiderName,
          title: t.title,
          sells: 0,
          buys: 0,
          lastAction: t.transactionType
        };
      }

      if (!t.isPositive) {
        insiderStats[t.insiderName].sells++;
      } else {
        insiderStats[t.insiderName].buys++;
      }
    });

    return Object.values(insiderStats)
      .filter(insider => insider.sells >= threshold && insider.sells > insider.buys)
      .sort((a, b) => b.sells - a.sells);
  }
}
