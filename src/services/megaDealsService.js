// Service pour tracker les méga deals et levées de fonds
// SoftBank, SpaceX, Anthropic, etc via News API

export class MegaDealsService {
  constructor(apiKey = null) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://newsapi.org/v2';
    this.useRealAPI = !!apiKey;
  }

  // Obtenir méga deals récents
  async getMegaDeals(limit = 50) {
    if (this.useRealAPI && this.apiKey) {
      try {
        // NewsAPI: Search for mega deals keywords
        const keywords = [
          'funding round',
          'Series',
          'investment',
          'acquisition',
          'merger',
          'IPO',
          'SPAC'
        ];

        const deals = [];

        for (const keyword of keywords.slice(0, 3)) {
          const response = await fetch(
            `${this.baseUrl}/everything?q=${keyword}+funding+investment&sortBy=publishedAt&language=en&pageSize=20&token=${this.apiKey}`
          );

          if (response.ok) {
            const data = await response.json();
            deals.push(...this.parseNewsDeals(data.articles || []));
          }
        }

        return {
          success: true,
          data: deals.slice(0, limit),
          source: 'real'
        };
      } catch (error) {
        console.warn('NewsAPI failed, using mock:', error);
        return this.getMockMegaDeals();
      }
    }
    return this.getMockMegaDeals();
  }

  // Parser news articles pour deals
  parseNewsDeals(articles) {
    return articles
      .map(article => {
        // Extraire informations du deal
        const text = (article.title + ' ' + article.description).toLowerCase();

        // Détecter type de deal
        let dealType = 'Unknown';
        if (text.includes('series')) {
          if (text.includes('series a')) dealType = 'Series A';
          else if (text.includes('series b')) dealType = 'Series B';
          else if (text.includes('series c')) dealType = 'Series C';
          else dealType = 'Series Round';
        } else if (text.includes('acquisition')) dealType = 'Acquisition';
        else if (text.includes('merger')) dealType = 'Merger';
        else if (text.includes('ipo')) dealType = 'IPO';
        else if (text.includes('spac')) dealType = 'SPAC';
        else if (text.includes('investment')) dealType = 'Investment';

        // Extraire valuation/amount
        const amountMatch = text.match(/\$(\d+(?:\.\d+)?)\s*(billion|million|trillion)/i);
        let amount = null;
        if (amountMatch) {
          amount = parseFloat(amountMatch[1]);
          if (amountMatch[2].toLowerCase() === 'billion') amount *= 1e9;
          else if (amountMatch[2].toLowerCase() === 'million') amount *= 1e6;
          else if (amountMatch[2].toLowerCase() === 'trillion') amount *= 1e12;
        }

        return {
          title: article.title,
          description: article.description,
          dealType,
          amount,
          date: new Date(article.publishedAt),
          source: article.source.name,
          url: article.url,
          imageUrl: article.urlToImage,
          sentiment: this.analyzeSentiment(text)
        };
      })
      .filter(deal => deal.amount && deal.amount > 0)
      .sort((a, b) => b.amount - a.amount);
  }

  // Analyser sentiment du deal
  analyzeSentiment(text) {
    const positiveWords = [
      'surge',
      'boom',
      'growth',
      'expansion',
      'record',
      'strong',
      'bullish'
    ];
    const negativeWords = [
      'decline',
      'loss',
      'crisis',
      'layoff',
      'bankrupt',
      'bearish',
      'crash'
    ];

    const positiveCount = positiveWords.filter(word => text.includes(word)).length;
    const negativeCount = negativeWords.filter(word => text.includes(word)).length;

    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  }

  // Obtenir deals par compagnie
  async getDealsByCompany(companyName, limit = 20) {
    const deals = await this.getMegaDeals(limit * 2);

    if (!deals.success) {
      return this.getMockCompanyDeals(companyName);
    }

    return deals.data.filter(deal =>
      deal.title.toLowerCase().includes(companyName.toLowerCase()) ||
      deal.description?.toLowerCase().includes(companyName.toLowerCase())
    );
  }

  // Tracker les fonds par secteur
  async getFundingBySector() {
    const deals = await this.getMegaDeals(100);

    if (!deals.success) {
      return this.getMockFundingBySector();
    }

    const sectors = {};

    deals.data.forEach(deal => {
      const sector = this.detectSector(deal.title + ' ' + deal.description);
      if (!sectors[sector]) {
        sectors[sector] = {
          sector,
          deals: [],
          totalFunding: 0,
          count: 0
        };
      }
      sectors[sector].deals.push(deal);
      sectors[sector].totalFunding += deal.amount || 0;
      sectors[sector].count++;
    });

    return Object.values(sectors)
      .sort((a, b) => b.totalFunding - a.totalFunding)
      .map(s => ({
        ...s,
        avgDeal: (s.totalFunding / s.count / 1e9).toFixed(2) + 'B'
      }));
  }

  // Déterminer le secteur
  detectSector(text) {
    const sectors = {
      'AI / Machine Learning': ['ai', 'artificial intelligence', 'machine learning', 'nlp', 'llm'],
      'Fintech': ['fintech', 'payment', 'crypto', 'blockchain', 'trading', 'bank'],
      'Healthcare': ['healthcare', 'biotech', 'pharma', 'medical', 'hospital'],
      'E-commerce': ['ecommerce', 'retail', 'shopping', 'marketplace', 'logistics'],
      'Space Tech': ['space', 'spacex', 'satellite', 'rocket', 'launch'],
      'Energy': ['energy', 'solar', 'wind', 'electric', 'renewable'],
      'Mobility': ['auto', 'vehicle', 'car', 'ev', 'electric vehicle', 'autonomous'],
      'SaaS': ['saas', 'software', 'cloud', 'platform', 'enterprise'],
      'Social Media': ['social', 'media', 'platform', 'network', 'twitter', 'meta']
    };

    const lowerText = text.toLowerCase();

    for (const [sector, keywords] of Object.entries(sectors)) {
      if (keywords.some(keyword => lowerText.includes(keyword))) {
        return sector;
      }
    }

    return 'Other';
  }

  // Mock data - Méga deals
  getMockMegaDeals() {
    return {
      success: true,
      data: [
        {
          title: 'Anthropic Raises $5 Billion in Funding Round',
          description: 'AI startup Anthropic secures Series funding, valuation reaches $20B',
          dealType: 'Series Funding',
          amount: 5e9,
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          source: 'TechCrunch',
          sentiment: 'positive',
          sector: 'AI / Machine Learning'
        },
        {
          title: 'SoftBank Invests $2.5B in AI Infrastructure',
          description: 'SoftBank Vision Fund commits massive capital to AI data centers',
          dealType: 'Investment',
          amount: 2.5e9,
          date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          source: 'Reuters',
          sentiment: 'positive',
          sector: 'AI / Machine Learning'
        },
        {
          title: 'SpaceX Completes $2B Series Funding',
          description: 'SpaceX raises $2B at $180B valuation for Starship development',
          dealType: 'Series Funding',
          amount: 2e9,
          date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          source: 'Bloomberg',
          sentiment: 'positive',
          sector: 'Space Tech'
        },
        {
          title: 'Stripe Acquires Payment Platform for $1.1B',
          description: 'Stripe expands with major acquisition in payment processing',
          dealType: 'Acquisition',
          amount: 1.1e9,
          date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
          source: 'Forbes',
          sentiment: 'positive',
          sector: 'Fintech'
        },
        {
          title: 'Elon Musk-Backed Neuralink Closes $150M Series Funding',
          description: 'Neuralink secures funding for neural interface technology',
          dealType: 'Series Funding',
          amount: 150e6,
          date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
          source: 'TechCrunch',
          sentiment: 'positive',
          sector: 'Healthcare'
        },
        {
          title: 'Microsoft Invests $10B in OpenAI Partnership',
          description: 'Microsoft commits $10B to OpenAI for AI model development',
          dealType: 'Investment',
          amount: 10e9,
          date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
          source: 'Reuters',
          sentiment: 'positive',
          sector: 'AI / Machine Learning'
        },
        {
          title: 'Tesla Raises $3B Through Secondary Offering',
          description: 'Tesla completes capital raise for factory expansion',
          dealType: 'Capital Raise',
          amount: 3e9,
          date: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
          source: 'CNBC',
          sentiment: 'positive',
          sector: 'Mobility'
        },
        {
          title: 'Databricks Raises $1.5B Series Round at $43B Valuation',
          description: 'Data platform unicorn Databricks hits new valuation milestone',
          dealType: 'Series Funding',
          amount: 1.5e9,
          date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          source: 'TechCrunch',
          sentiment: 'positive',
          sector: 'SaaS'
        }
      ],
      source: 'mock'
    };
  }

  // Mock data - Deals par compagnie
  getMockCompanyDeals(companyName) {
    return {
      success: true,
      company: companyName,
      deals: [
        {
          title: `${companyName} Closes Series B Funding`,
          dealType: 'Series B',
          amount: 500e6,
          date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          sentiment: 'positive'
        },
        {
          title: `${companyName} Expands Operations With New Investment`,
          dealType: 'Investment',
          amount: 200e6,
          date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
          sentiment: 'positive'
        }
      ]
    };
  }

  // Mock data - Funding par secteur
  getMockFundingBySector() {
    return [
      {
        sector: 'AI / Machine Learning',
        count: 45,
        totalFunding: 52e9,
        avgDeal: '1.16B',
        deals: []
      },
      {
        sector: 'Fintech',
        count: 38,
        totalFunding: 28e9,
        avgDeal: '0.74B',
        deals: []
      },
      {
        sector: 'Space Tech',
        count: 12,
        totalFunding: 15e9,
        avgDeal: '1.25B',
        deals: []
      },
      {
        sector: 'Healthcare',
        count: 42,
        totalFunding: 18e9,
        avgDeal: '0.43B',
        deals: []
      },
      {
        sector: 'SaaS',
        count: 55,
        totalFunding: 22e9,
        avgDeal: '0.40B',
        deals: []
      }
    ];
  }

  // Obtenir hot trends (secteurs chauds)
  async getHotTrends() {
    const sectors = await this.getFundingBySector();

    return {
      topSectors: sectors.slice(0, 5).map(s => ({
        sector: s.sector,
        deals: s.count,
        totalFunding: (s.totalFunding / 1e9).toFixed(1) + 'B',
        trend: s.totalFunding > 30e9 ? '🔥 Hot' : '📈 Warm'
      })),
      trend: 'AI dominates with $52B in funding',
      velocity: 'Accelerating'
    };
  }
}
