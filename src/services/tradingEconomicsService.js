// Service pour intégrer Trading Economics API
// Documentation: https://tradingeconomics.com/api/

export class TradingEconomicsService {
  constructor(apiKey = null) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://api.tradingeconomics.com';
    this.useRealAPI = !!apiKey;
  }

  // Historique 30 jours de taux de change
  async getExchangeRateHistory(pair = 'EUR/USD', days = 30) {
    if (this.useRealAPI && this.apiKey) {
      try {
        const response = await fetch(
          `${this.baseUrl}/markets/currencies/${pair}?c=${this.apiKey}`
        );
        if (!response.ok) throw new Error(`API Error: ${response.status}`);
        const data = await response.json();
        return {
          success: true,
          data: this.parseExchangeHistory(data),
          source: 'real'
        };
      } catch (error) {
        console.warn('Trading Economics API failed:', error);
        return this.getMockExchangeHistory(pair, days);
      }
    }
    return this.getMockExchangeHistory(pair, days);
  }

  // Indicateurs économiques par pays
  async getCountryIndicators(country = 'France') {
    if (this.useRealAPI && this.apiKey) {
      try {
        const response = await fetch(
          `${this.baseUrl}/country/${country}?c=${this.apiKey}`
        );
        if (!response.ok) throw new Error(`API Error: ${response.status}`);
        const data = await response.json();
        return {
          success: true,
          data: data,
          source: 'real'
        };
      } catch (error) {
        console.warn('Trading Economics country API failed:', error);
        return this.getMockCountryIndicators(country);
      }
    }
    return this.getMockCountryIndicators(country);
  }

  // Prédictions de taux (basées sur historiques)
  async getExchangeRateForecast(pair = 'EUR/USD', days = 30) {
    const history = await this.getExchangeRateHistory(pair, days);
    if (history.success) {
      return {
        success: true,
        pair,
        forecast: this.forecastExchangeRate(history.data, days),
        confidence: 0.65
      };
    }
    return this.getMockForecast(pair);
  }

  // Parse réponse Trading Economics
  parseExchangeHistory(data) {
    // Structure dépend de la vraie API
    // Ici on suppose un array de {date, value}
    if (Array.isArray(data)) {
      return data.map(item => ({
        date: new Date(item.Date || item.date).toLocaleDateString(),
        rate: parseFloat(item.Last || item.value || item.rate),
        open: parseFloat(item.Open || item.open),
        high: parseFloat(item.High || item.high),
        low: parseFloat(item.Low || item.low),
        close: parseFloat(item.Close || item.close)
      }));
    }
    return this.getMockExchangeHistory('EUR/USD', 30).data;
  }

  // Calcul prédiction simple (moyenne mobile + trend)
  forecastExchangeRate(history, days = 7) {
    if (!history || history.length === 0) return [];

    const forecast = [];
    const lastRate = history[history.length - 1].rate;

    // Calculer trend
    const recentRates = history.slice(-7).map(h => h.rate);
    const avgRecent = recentRates.reduce((a, b) => a + b) / recentRates.length;
    const trend = (lastRate - avgRecent) / avgRecent;

    // Générer prédictions avec variation aléatoire douce
    for (let i = 1; i <= days; i++) {
      const baseChange = trend * (i / days);
      const noise = (Math.random() - 0.5) * 0.002;
      const predictedRate = lastRate * (1 + baseChange + noise);

      forecast.push({
        date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toLocaleDateString(),
        rate: parseFloat(predictedRate.toFixed(4)),
        isPrediction: true,
        confidence: Math.max(0.95 - i * 0.05, 0.5)
      });
    }

    return forecast;
  }

  // Mock data - Historique 30 jours EUR/USD
  getMockExchangeHistory(pair = 'EUR/USD', days = 30) {
    const history = [];
    const now = Date.now();
    let baseRate = pair === 'EUR/USD' ? 1.10 :
                  pair === 'GBP/USD' ? 1.27 :
                  pair === 'USD/JPY' ? 159.50 :
                  pair === 'USD/CNY' ? 7.25 : 1.0;

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now - i * 24 * 60 * 60 * 1000);
      const variation = (Math.random() - 0.5) * 0.01; // ±0.5%
      const rate = baseRate * (1 + variation);

      history.push({
        date: date.toLocaleDateString('en-US'),
        rate: parseFloat(rate.toFixed(4)),
        open: parseFloat((rate * 0.998).toFixed(4)),
        high: parseFloat((rate * 1.005).toFixed(4)),
        low: parseFloat((rate * 0.995).toFixed(4)),
        close: parseFloat((rate * 1.002).toFixed(4)),
        volume: Math.floor(Math.random() * 5000000000) + 1000000000
      });

      baseRate = rate; // Pour continuité
    }

    return {
      success: true,
      data: history,
      source: 'mock'
    };
  }

  // Mock data - Indicateurs économiques
  getMockCountryIndicators(country = 'France') {
    const indicators = {
      'France': {
        country: 'France',
        gdp: { value: 2.7, unit: 'T', currency: 'USD' },
        inflation: { value: 2.1, unit: '%' },
        unemployment: { value: 7.4, unit: '%' },
        interestRate: { value: 4.25, unit: '%' },
        tradeBalance: { value: -45, unit: 'B USD' },
        consumerConfidence: { value: -15, unit: 'index' }
      },
      'United States': {
        country: 'United States',
        gdp: { value: 28.0, unit: 'T', currency: 'USD' },
        inflation: { value: 3.2, unit: '%' },
        unemployment: { value: 4.0, unit: '%' },
        interestRate: { value: 5.50, unit: '%' },
        tradeBalance: { value: -75, unit: 'B USD' },
        consumerConfidence: { value: 104.7, unit: 'index' }
      },
      'Germany': {
        country: 'Germany',
        gdp: { value: 4.1, unit: 'T', currency: 'USD' },
        inflation: { value: 2.6, unit: '%' },
        unemployment: { value: 5.9, unit: '%' },
        interestRate: { value: 4.25, unit: '%' },
        tradeBalance: { value: 95, unit: 'B USD' },
        consumerConfidence: { value: -25, unit: 'index' }
      },
      'Japan': {
        country: 'Japan',
        gdp: { value: 4.2, unit: 'T', currency: 'USD' },
        inflation: { value: 2.5, unit: '%' },
        unemployment: { value: 2.5, unit: '%' },
        interestRate: { value: -0.10, unit: '%' },
        tradeBalance: { value: 35, unit: 'B USD' },
        consumerConfidence: { value: 42.5, unit: 'index' }
      },
      'China': {
        country: 'China',
        gdp: { value: 17.8, unit: 'T', currency: 'USD' },
        inflation: { value: 0.8, unit: '%' },
        unemployment: { value: 5.2, unit: '%' },
        interestRate: { value: 3.85, unit: '%' },
        tradeBalance: { value: 420, unit: 'B USD' },
        consumerConfidence: { value: 73.1, unit: 'index' }
      }
    };

    return {
      success: true,
      data: indicators[country] || indicators['France'],
      source: 'mock'
    };
  }

  // Mock data - Prédictions
  getMockForecast(pair = 'EUR/USD') {
    const forecast = [];
    const baseRate = pair === 'EUR/USD' ? 1.10 : 1.0;

    for (let i = 1; i <= 30; i++) {
      const variation = Math.sin(i / 10) * 0.02; // Tendance douce
      const noise = (Math.random() - 0.5) * 0.002;

      forecast.push({
        date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toLocaleDateString('en-US'),
        rate: parseFloat((baseRate * (1 + variation + noise)).toFixed(4)),
        isPrediction: true,
        confidence: Math.max(0.95 - i * 0.025, 0.5)
      });
    }

    return {
      success: true,
      pair,
      forecast,
      confidence: 0.65,
      source: 'mock'
    };
  }
}
