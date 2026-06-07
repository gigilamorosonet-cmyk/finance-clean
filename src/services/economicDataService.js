export class EconomicDataService {
  constructor(anthropicKey) {
    this.anthropicKey = anthropicKey;
  }

  async getCountryEconomicData(countryName, countryCode) {
    if (!this.anthropicKey) {
      return this.getMockData(countryName, countryCode);
    }

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.anthropicKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 1024,
          messages: [
            {
              role: 'user',
              content: `Fournis des données économiques actualisées pour ${countryName} au format JSON UNIQUEMENT (pas de texte):
{
  "country": "${countryName}",
  "imports": "montant en milliards USD",
  "exports": "montant en milliards USD",
  "politicalStability": "score de 0-100",
  "budgetDeficit": "pourcentage du PIB",
  "tradeBalance": "montant en milliards USD",
  "gdp": "montant en milliards USD",
  "gdpGrowth": "pourcentage annuel",
  "inflation": "pourcentage",
  "unemploymentRate": "pourcentage",
  "debtToGDP": "pourcentage",
  "currencyExchangeRate": "par rapport à USD"
}

Retourne UNIQUEMENT le JSON, sans explications.`
            }
          ]
        })
      });

      if (response.ok) {
        const data = await response.json();
        const content = data.content[0].text;
        return JSON.parse(content);
      }
    } catch (error) {
      console.error('Error fetching from Anthropic:', error);
    }

    return this.getMockData(countryName, countryCode);
  }

  getMockData(countryName, countryCode) {
    const mockDatabase = {
      'US': {
        country: 'États-Unis',
        imports: '2850',
        exports: '2110',
        politicalStability: 72,
        budgetDeficit: 5.8,
        tradeBalance: -740,
        gdp: 27360,
        gdpGrowth: 2.5,
        inflation: 3.2,
        unemploymentRate: 3.9,
        debtToGDP: 123,
        currencyExchangeRate: '1.00',
        conflictZones: 'Proche-Orient, Océan Indien'
      },
      'FR': {
        country: 'France',
        imports: '668',
        exports: '579',
        politicalStability: 78,
        budgetDeficit: 4.9,
        tradeBalance: -89,
        gdp: 2780,
        gdpGrowth: 0.9,
        inflation: 2.1,
        unemploymentRate: 7.1,
        debtToGDP: 110,
        currencyExchangeRate: '0.92',
        conflictZones: 'Sahel, Méditerranée'
      },
      'CN': {
        country: 'Chine',
        imports: '2368',
        exports: '3597',
        politicalStability: 65,
        budgetDeficit: 3.2,
        tradeBalance: 1229,
        gdp: 17734,
        gdpGrowth: 5.2,
        inflation: 0.8,
        unemploymentRate: 5.2,
        debtToGDP: 77,
        currencyExchangeRate: '7.08',
        conflictZones: 'Mer de Chine, Taïwan'
      },
      'DE': {
        country: 'Allemagne',
        imports: '1102',
        exports: '1591',
        politicalStability: 79,
        budgetDeficit: 1.1,
        tradeBalance: 489,
        gdp: 4080,
        gdpGrowth: 0.3,
        inflation: 2.2,
        unemploymentRate: 2.6,
        debtToGDP: 60,
        currencyExchangeRate: '0.92',
        conflictZones: 'Aucune directe'
      },
      'GB': {
        country: 'Royaume-Uni',
        imports: '735',
        exports: '598',
        politicalStability: 71,
        budgetDeficit: 6.3,
        tradeBalance: -137,
        gdp: 3330,
        gdpGrowth: 0.5,
        inflation: 2.0,
        unemploymentRate: 4.0,
        debtToGDP: 101,
        currencyExchangeRate: '0.79',
        conflictZones: 'Proche-Orient'
      },
      'JP': {
        country: 'Japon',
        imports: '837',
        exports: '843',
        politicalStability: 77,
        budgetDeficit: 4.5,
        tradeBalance: 6,
        gdp: 4230,
        gdpGrowth: 2.1,
        inflation: 2.8,
        unemploymentRate: 2.5,
        debtToGDP: 264,
        currencyExchangeRate: '150.5',
        conflictZones: 'Corée du Nord, Mer de Chine'
      },
      'IN': {
        country: 'Inde',
        imports: '656',
        exports: '453',
        politicalStability: 62,
        budgetDeficit: 5.6,
        tradeBalance: -203,
        gdp: 3736,
        gdpGrowth: 6.2,
        inflation: 4.8,
        unemploymentRate: 3.2,
        debtToGDP: 84,
        currencyExchangeRate: '83.1',
        conflictZones: 'Cachemire, Frontière Pakistan'
      },
      'BR': {
        country: 'Brésil',
        imports: '358',
        exports: '301',
        politicalStability: 55,
        budgetDeficit: 8.5,
        tradeBalance: -57,
        gdp: 2117,
        gdpGrowth: 2.9,
        inflation: 4.2,
        unemploymentRate: 7.8,
        debtToGDP: 77,
        currencyExchangeRate: '4.97',
        conflictZones: 'Amazonie (crimes organisés)'
      }
    };

    return mockDatabase[countryCode] || {
      country: countryName,
      imports: '---',
      exports: '---',
      politicalStability: 50,
      budgetDeficit: 0,
      tradeBalance: 0,
      gdp: '---',
      gdpGrowth: 0,
      inflation: 0,
      unemploymentRate: 0,
      debtToGDP: 0,
      currencyExchangeRate: '---',
      conflictZones: 'Données non disponibles'
    };
  }
}
