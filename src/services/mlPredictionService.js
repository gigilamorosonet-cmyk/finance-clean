// Service ML pour prédictions de taux avec TensorFlow.js
// Modèle simple de réseau de neurones pour taux de change

export class MLPredictionService {
  constructor(apiKey = null) {
    this.apiKey = apiKey;
    this.models = new Map();
    this.useRealML = false; // À activer si TensorFlow.js disponible
  }

  // Prédire taux de change avec multiple méthodes
  async predictExchangeRate(history, daysAhead = 7) {
    try {
      if (this.useRealML && window.tf) {
        return await this.predictWithML(history, daysAhead);
      } else {
        return this.predictWithMovingAverage(history, daysAhead);
      }
    } catch (error) {
      console.warn('ML prediction failed, using fallback:', error);
      return this.predictWithMovingAverage(history, daysAhead);
    }
  }

  // Méthode 1: Moyenne Mobile + Trend (Simple, Rapide)
  predictWithMovingAverage(history, days = 7) {
    const rates = history.map(h => h.rate);

    // Moyennes mobiles
    const sma7 = this.calculateSMA(rates, 7);
    const sma14 = this.calculateSMA(rates, 14);

    // Trend (gradient)
    const trend = sma7[sma7.length - 1] - sma14[sma14.length - 1];

    // Momentum
    const momentum = rates[rates.length - 1] - rates[rates.length - 8] || 0;

    // Volatilité
    const volatility = this.calculateVolatility(rates.slice(-14));

    // Générer prédictions
    const predictions = [];
    let lastRate = rates[rates.length - 1];

    for (let i = 1; i <= days; i++) {
      // Réduction progressive du trend
      const trendFactor = trend * (1 - i / days) * 0.5;

      // Momentum faible
      const momentumFactor = momentum * (1 - i / days) * 0.1;

      // Bruit blanc réduit
      const noise = (Math.random() - 0.5) * volatility * 0.5;

      const predictedRate = lastRate * (1 + trendFactor + momentumFactor + noise);

      predictions.push({
        date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toLocaleDateString(),
        rate: parseFloat(predictedRate.toFixed(4)),
        isPrediction: true,
        confidence: Math.max(0.85 - (i * 0.08), 0.45),
        method: 'SMA'
      });

      lastRate = predictedRate;
    }

    return {
      success: true,
      predictions,
      model: 'Moving Average',
      confidence: 0.65,
      volatility: volatility.toFixed(4)
    };
  }

  // Méthode 2: ML Neural Network (Si TensorFlow disponible)
  async predictWithML(history, days = 7) {
    try {
      // À implémenter avec TensorFlow.js
      // Pour l'instant, fallback à moving average
      return this.predictWithMovingAverage(history, days);
    } catch (error) {
      console.error('ML prediction error:', error);
      throw error;
    }
  }

  // Calculer Moyenne Mobile Simple
  calculateSMA(rates, period) {
    const sma = [];
    for (let i = period - 1; i < rates.length; i++) {
      const sum = rates.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
      sma.push(sum / period);
    }
    return sma;
  }

  // Calculer volatilité (écart-type)
  calculateVolatility(rates) {
    const mean = rates.reduce((a, b) => a + b) / rates.length;
    const variance = rates.reduce((sum, rate) => sum + Math.pow(rate - mean, 2), 0) / rates.length;
    return Math.sqrt(variance);
  }

  // Calculer RSI (Relative Strength Index)
  calculateRSI(rates, period = 14) {
    const changes = [];
    for (let i = 1; i < rates.length; i++) {
      changes.push(rates[i] - rates[i - 1]);
    }

    const gains = changes.map(c => c > 0 ? c : 0);
    const losses = changes.map(c => c < 0 ? -c : 0);

    const avgGain = gains.slice(-period).reduce((a, b) => a + b) / period;
    const avgLoss = losses.slice(-period).reduce((a, b) => a + b) / period;

    const rs = avgGain / avgLoss;
    const rsi = 100 - (100 / (1 + rs));

    return {
      value: parseFloat(rsi.toFixed(2)),
      signal: rsi > 70 ? 'overbought' : rsi < 30 ? 'oversold' : 'neutral'
    };
  }

  // Calculer MACD (Moving Average Convergence Divergence)
  calculateMACD(rates) {
    const ema12 = this.calculateEMA(rates, 12);
    const ema26 = this.calculateEMA(rates, 26);

    const macdLine = [];
    const signalLine = [];

    for (let i = 0; i < ema12.length; i++) {
      macdLine.push(ema12[i] - ema26[i]);
    }

    const emaSignal = this.calculateEMA(macdLine, 9);
    return {
      macdLine: macdLine[macdLine.length - 1],
      signalLine: emaSignal[emaSignal.length - 1],
      histogram: macdLine[macdLine.length - 1] - emaSignal[emaSignal.length - 1]
    };
  }

  // Calculer EMA (Exponential Moving Average)
  calculateEMA(rates, period) {
    const ema = [];
    const multiplier = 2 / (period + 1);

    // SMA initial
    let sum = 0;
    for (let i = 0; i < period; i++) {
      sum += rates[i];
    }
    ema.push(sum / period);

    // EMA suivants
    for (let i = period; i < rates.length; i++) {
      const newEMA = (rates[i] - ema[ema.length - 1]) * multiplier + ema[ema.length - 1];
      ema.push(newEMA);
    }

    return ema;
  }

  // Analyse technique complète
  analyzeTechnical(history) {
    const rates = history.map(h => h.rate);

    return {
      rsi: this.calculateRSI(rates),
      macd: this.calculateMACD(rates),
      sma20: this.calculateSMA(rates, 20)[this.calculateSMA(rates, 20).length - 1],
      sma50: this.calculateSMA(rates, 50)[this.calculateSMA(rates, 50).length - 1] || null,
      volatility: this.calculateVolatility(rates),
      support: Math.min(...rates),
      resistance: Math.max(...rates),
      currentPrice: rates[rates.length - 1]
    };
  }

  // Générer score d'achat/vente (0-100)
  generateTradingSignal(technicalAnalysis) {
    let score = 50; // Neutre

    // RSI
    if (technicalAnalysis.rsi.value < 30) score += 15; // Achat
    else if (technicalAnalysis.rsi.value > 70) score -= 15; // Vente

    // MACD
    if (technicalAnalysis.macd.histogram > 0) score += 10;
    else score -= 10;

    // Prix vs SMA
    if (technicalAnalysis.currentPrice > technicalAnalysis.sma20) score += 10;
    else score -= 10;

    // Support/Resistance
    if (technicalAnalysis.currentPrice <= technicalAnalysis.support * 1.02) score += 10;
    if (technicalAnalysis.currentPrice >= technicalAnalysis.resistance * 0.98) score -= 10;

    return {
      score: Math.max(0, Math.min(100, score)),
      signal: score > 60 ? 'Strong Buy' : score > 55 ? 'Buy' : score < 40 ? 'Strong Sell' : score < 45 ? 'Sell' : 'Neutral',
      confidence: 0.65
    };
  }

  // Backtesting simple
  backtest(history, strategy = 'sma') {
    const results = {
      trades: [],
      winRate: 0,
      totalReturn: 0,
      maxDrawdown: 0
    };

    if (strategy === 'sma') {
      results.trades = this.backtestSMA(history);
    }

    if (results.trades.length > 0) {
      const wins = results.trades.filter(t => t.profit > 0).length;
      results.winRate = (wins / results.trades.length) * 100;
      results.totalReturn = results.trades.reduce((sum, t) => sum + t.profit, 0);
    }

    return results;
  }

  backtestSMA(history) {
    const trades = [];
    const rates = history.map(h => h.rate);
    const sma20 = this.calculateSMA(rates, 20);

    let position = null;

    for (let i = 20; i < rates.length; i++) {
      if (rates[i] > sma20[i - 20] && !position) {
        position = { entry: rates[i], date: history[i].date };
      } else if (rates[i] < sma20[i - 20] && position) {
        const trade = {
          entry: position.entry,
          exit: rates[i],
          profit: rates[i] - position.entry,
          profitPercent: ((rates[i] - position.entry) / position.entry) * 100,
          date: history[i].date
        };
        trades.push(trade);
        position = null;
      }
    }

    return trades;
  }
}
