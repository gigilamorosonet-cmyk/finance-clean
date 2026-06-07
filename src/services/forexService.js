export class ForexService {
  constructor(apiKey = null) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://api.frankfurter.app';
  }

  // Taux de change Frankfurter (GRATUIT)
  async getExchangeRates(from = 'EUR', to = ['USD', 'GBP', 'JPY', 'CNY', 'CHF', 'CAD', 'AUD']) {
    try {
      const params = new URLSearchParams({
        from,
        to: to.join(',')
      });

      const response = await fetch(`${this.baseUrl}/latest?${params}`);
      if (!response.ok) throw new Error(`API Error: ${response.status}`);

      const data = await response.json();
      return {
        success: true,
        base: data.base,
        date: data.date,
        rates: data.rates
      };
    } catch (error) {
      console.warn('Exchange rates API failed, using mock data:', error);
      return this.getMockExchangeRates();
    }
  }

  // Taux directeurs (données mockées)
  getInterestRates() {
    return {
      success: true,
      data: {
        BCE: {
          name: 'Banque Centrale Européenne',
          rate: 4.25,
          currency: 'EUR',
          lastUpdate: new Date().toISOString(),
          trend: 'stable',
          description: 'Taux directeur de la BCE pour la zone euro'
        },
        FED: {
          name: 'Federal Reserve (USA)',
          rate: 5.50,
          currency: 'USD',
          lastUpdate: new Date().toISOString(),
          trend: 'stable',
          description: 'Taux des fonds fédéraux'
        },
        BOJ: {
          name: 'Bank of Japan',
          rate: -0.10,
          currency: 'JPY',
          lastUpdate: new Date().toISOString(),
          trend: 'up',
          description: 'Taux de base de la BoJ'
        },
        PBC: {
          name: 'People\'s Bank of China',
          rate: 3.85,
          currency: 'CNY',
          lastUpdate: new Date().toISOString(),
          trend: 'down',
          description: 'Taux de prêt préférentiel'
        },
        BOE: {
          name: 'Bank of England',
          rate: 5.25,
          currency: 'GBP',
          lastUpdate: new Date().toISOString(),
          trend: 'stable',
          description: 'Taux directeur du Royaume-Uni'
        }
      }
    };
  }

  // Coût de la vie par pays (indice 100 = New York)
  getCostOfLiving() {
    return {
      success: true,
      data: {
        'FR': {
          name: 'France',
          city: 'Paris',
          index: 85,
          monthlyBudget: 3200,
          currency: 'EUR',
          breakdown: {
            'Logement': 45,
            'Alimentation': 20,
            'Transport': 15,
            'Loisirs': 12,
            'Santé': 8
          }
        },
        'US': {
          name: 'États-Unis',
          city: 'New York',
          index: 100,
          monthlyBudget: 4000,
          currency: 'USD',
          breakdown: {
            'Logement': 42,
            'Alimentation': 18,
            'Transport': 18,
            'Loisirs': 14,
            'Santé': 8
          }
        },
        'DE': {
          name: 'Allemagne',
          city: 'Berlin',
          index: 78,
          monthlyBudget: 3100,
          currency: 'EUR',
          breakdown: {
            'Logement': 40,
            'Alimentation': 20,
            'Transport': 16,
            'Loisirs': 16,
            'Santé': 8
          }
        },
        'JP': {
          name: 'Japon',
          city: 'Tokyo',
          index: 92,
          monthlyBudget: 3650,
          currency: 'JPY',
          breakdown: {
            'Logement': 38,
            'Alimentation': 22,
            'Transport': 14,
            'Loisirs': 18,
            'Santé': 8
          }
        },
        'CN': {
          name: 'Chine',
          city: 'Shanghai',
          index: 65,
          monthlyBudget: 2500,
          currency: 'CNY',
          breakdown: {
            'Logement': 35,
            'Alimentation': 25,
            'Transport': 15,
            'Loisirs': 18,
            'Santé': 7
          }
        },
        'GB': {
          name: 'Royaume-Uni',
          city: 'Londres',
          index: 95,
          monthlyBudget: 3800,
          currency: 'GBP',
          breakdown: {
            'Logement': 48,
            'Alimentation': 18,
            'Transport': 16,
            'Loisirs': 12,
            'Santé': 6
          }
        },
        'CA': {
          name: 'Canada',
          city: 'Toronto',
          index: 88,
          monthlyBudget: 3500,
          currency: 'CAD',
          breakdown: {
            'Logement': 42,
            'Alimentation': 19,
            'Transport': 17,
            'Loisirs': 14,
            'Santé': 8
          }
        },
        'AU': {
          name: 'Australie',
          city: 'Sydney',
          index: 86,
          monthlyBudget: 3450,
          currency: 'AUD',
          breakdown: {
            'Logement': 44,
            'Alimentation': 19,
            'Transport': 16,
            'Loisirs': 14,
            'Santé': 7
          }
        }
      }
    };
  }

  // Flux commerciaux import/export
  getTradeFlows() {
    return {
      success: true,
      data: {
        'FR': {
          country: 'France',
          exports: 580,
          imports: 620,
          tradeBalance: -40,
          mainExports: ['Vin & Spiritueux', 'Aéronautique', 'Pharmacie', 'Luxe', 'Énergie'],
          mainImports: ['Pétrole', 'Électronique', 'Métaux', 'Machines', 'Textile'],
          topPartners: ['Allemagne', 'Italie', 'Belgique', 'Espagne', 'USA'],
          growthRate: 2.1
        },
        'US': {
          country: 'États-Unis',
          exports: 2150,
          imports: 3580,
          tradeBalance: -1430,
          mainExports: ['Énergie', 'Électronique', 'Pharmacie', 'Machines', 'Produits alimentaires'],
          mainImports: ['Électronique', 'Vêtements', 'Pétrole', 'Véhicules', 'Acier'],
          topPartners: ['Mexique', 'Chine', 'Canada', 'Japon', 'Allemagne'],
          growthRate: 1.8
        },
        'DE': {
          country: 'Allemagne',
          exports: 1890,
          imports: 1450,
          tradeBalance: 440,
          mainExports: ['Véhicules', 'Machines', 'Chimie', 'Électronique', 'Plastiques'],
          mainImports: ['Pétrole', 'Électronique', 'Métaux', 'Produits chimiques', 'Énergie'],
          topPartners: ['USA', 'France', 'Pays-Bas', 'Italie', 'Chine'],
          growthRate: 2.5
        },
        'JP': {
          country: 'Japon',
          exports: 920,
          imports: 850,
          tradeBalance: 70,
          mainExports: ['Véhicules', 'Électronique', 'Machines', 'Chimie', 'Acier'],
          mainImports: ['Énergie', 'Métaux', 'Pétrole', 'Électronique', 'Produits alimentaires'],
          topPartners: ['Chine', 'USA', 'Corée du Sud', 'Australie', 'Thaïlande'],
          growthRate: 1.2
        },
        'CN': {
          country: 'Chine',
          exports: 3200,
          imports: 2800,
          tradeBalance: 400,
          mainExports: ['Électronique', 'Textiles', 'Machines', 'Jouets', 'Meubles'],
          mainImports: ['Pétrole', 'Minerais', 'Électronique', 'Plastiques', 'Métaux'],
          topPartners: ['USA', 'UE', 'ASEAN', 'Japon', 'Corée du Sud'],
          growthRate: 3.8
        }
      }
    };
  }

  // Mock data fallback
  getMockExchangeRates() {
    return {
      success: true,
      base: 'EUR',
      date: new Date().toISOString().split('T')[0],
      rates: {
        USD: 1.10,
        GBP: 0.85,
        JPY: 159.50,
        CNY: 7.95,
        CHF: 0.95,
        CAD: 1.48,
        AUD: 1.68
      }
    };
  }
}
