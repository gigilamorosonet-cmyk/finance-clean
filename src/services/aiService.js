// Service IA pour analyses intelligentes
// Utilise Anthropic API (ou OpenAI en fallback)

export class AIService {
  constructor(apiKey, model = 'claude-3-haiku') {
    this.apiKey = apiKey;
    this.model = model;
    this.baseUrl = 'https://api.anthropic.com/v1';
  }

  // Analyser un portefeuille avec IA
  async analyzePortfolio(positions, scenarioIA = null) {
    if (!this.apiKey) {
      return this.getMockAnalysis(positions);
    }

    const portfolio = positions.map(p => ({
      symbol: p.symbol,
      type: p.type,
      value: p.quantity * p.currentPrice,
      gain: (p.currentPrice - p.entryPrice) * p.quantity,
      gainPercent: ((p.currentPrice - p.entryPrice) / p.entryPrice) * 100
    }));

    const prompt = `Analyze this investment portfolio and provide:
1. Risk assessment
2. Diversification analysis
3. Rebalancing recommendations
4. Specific stock recommendations based on current market conditions
5. Tax optimization strategies

Portfolio:
${JSON.stringify(portfolio, null, 2)}

Provide response in JSON format with fields: riskLevel, diversificationScore, recommendations, taxOptimization`;

    try {
      const response = await fetch(`${this.baseUrl}/messages`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: this.model,
          max_tokens: 1024,
          messages: [{ role: 'user', content: prompt }]
        })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      const data = await response.json();
      const content = data.content[0].text;

      try {
        return JSON.parse(content);
      } catch {
        return this.parseLLMResponse(content);
      }
    } catch (error) {
      console.error('AI Analysis error:', error);
      return this.getMockAnalysis(positions);
    }
  }

  // Générer des signaux de trading
  async generateTradingSignals(assets, marketConditions = null) {
    if (!this.apiKey) {
      return this.getMockSignals();
    }

    const prompt = `Based on these assets and market conditions, generate trading signals:

Assets: ${JSON.stringify(assets)}
Market Conditions: ${marketConditions || 'Current market volatility'}

For each asset, provide:
- Signal (BUY/SELL/HOLD)
- Strength (0-10)
- Entry/Exit points
- Stop loss level
- Take profit levels
- Reasoning

Respond in JSON format`;

    try {
      const response = await fetch(`${this.baseUrl}/messages`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: this.model,
          max_tokens: 1024,
          messages: [{ role: 'user', content: prompt }]
        })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      const data = await response.json();
      const content = data.content[0].text;

      try {
        return JSON.parse(content);
      } catch {
        return this.getMockSignals();
      }
    } catch (error) {
      console.error('Trading signals error:', error);
      return this.getMockSignals();
    }
  }

  // Analyser impact des zones de conflit
  async analyzeConflictImpact(conflictRegion, affectedCommodities) {
    if (!this.apiKey) {
      return this.getMockConflictAnalysis(conflictRegion);
    }

    const prompt = `Analyze the geopolitical impact of the conflict in ${conflictRegion} on these commodities: ${affectedCommodities.join(', ')}

Provide:
1. Supply chain disruption assessment
2. Price impact (short/medium/long term)
3. Alternative supply sources
4. Investment opportunities/risks
5. Timeline for resolution

Format as JSON`;

    try {
      const response = await fetch(`${this.baseUrl}/messages`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: this.model,
          max_tokens: 1024,
          messages: [{ role: 'user', content: prompt }]
        })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      const data = await response.json();
      const content = data.content[0].text;

      try {
        return JSON.parse(content);
      } catch {
        return this.parseLLMResponse(content);
      }
    } catch (error) {
      console.error('Conflict impact error:', error);
      return this.getMockConflictAnalysis(conflictRegion);
    }
  }

  // Parser réponse LLM (si pas JSON)
  parseLLMResponse(text) {
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      console.error('Parse error:', e);
    }
    return null;
  }

  // Données mockées
  getMockAnalysis(positions) {
    return {
      riskLevel: 'Modéré',
      diversificationScore: 72,
      recommendations: [
        'Réduire l\'exposition Crypto à 35%',
        'Augmenter les positions en ETF stable',
        'Ajouter positions défensives (pharma, utilities)'
      ],
      taxOptimization: {
        strategy: 'Vendre les positions à pertes faibles pour compenser plus-values',
        potentialSavings: 2500
      }
    };
  }

  getMockSignals() {
    return [
      { asset: 'AAPL', signal: 'BUY', strength: 8.5, entry: 180, exitTarget: 200, stopLoss: 170 },
      { asset: 'ETH', signal: 'BUY', strength: 9.1, entry: 2100, exitTarget: 2400, stopLoss: 1900 },
      { asset: 'EUR/USD', signal: 'SELL', strength: 7.2, entry: 1.085, exitTarget: 1.070, stopLoss: 1.095 }
    ];
  }

  getMockConflictAnalysis(region) {
    return {
      region,
      impactLevel: 'Moyen',
      affectedCommodities: ['Pétrole', 'Gaz naturel', 'Blé', 'Métaux rares'],
      priceImpact: {
        shortTerm: '+8-12%',
        mediumTerm: '+5-8%',
        longTerm: '+2-4%'
      },
      opportunities: [
        'Investir dans énergies alternatives',
        'Positionner sur producteurs alternatifs',
        'Couverture via options commodities'
      ],
      timeline: '3-6 mois pour résolution partielle'
    };
  }
}

export default new AIService();
