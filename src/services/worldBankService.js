// Service pour intégrer World Bank API
// Documentation: https://data.worldbank.org/developers

export class WorldBankService {
  constructor(apiKey = null) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://api.worldbank.org/v2';
    this.useRealAPI = true; // World Bank est gratuit, pas de clé requise!
  }

  // Indicateurs économiques (30 ans d'historique)
  async getIndicatorHistory(countryCode = 'FRA', indicator = 'NY.GDP.MKTP.CD') {
    try {
      if (this.useRealAPI) {
        const response = await fetch(
          `${this.baseUrl}/country/${countryCode}/indicator/${indicator}?format=json&per_page=100`
        );

        if (!response.ok) throw new Error(`API Error: ${response.status}`);
        const data = await response.json();

        if (data[1]) {
          return {
            success: true,
            data: this.parseWorldBankData(data[1]),
            source: 'real',
            indicator: indicator
          };
        }
      }
    } catch (error) {
      console.warn('World Bank API failed:', error);
    }

    return this.getMockIndicatorHistory(countryCode, indicator);
  }

  // Tous les indicateurs pour un pays
  async getCountryData(countryCode = 'FRA') {
    const indicators = {
      'NY.GDP.MKTP.CD': 'GDP (courant USD)',
      'NY.GDP.MKTP.KD': 'GDP (constant 2015 USD)',
      'NY.GDP.PCAP.CD': 'GDP per capita (courant USD)',
      'FP.CPI.TOTL.ZG': 'Inflation, prix à la consommation (%)',
      'NE.EXP.GNFS.CD': 'Exportations (USD)',
      'NE.IMP.GNFS.CD': 'Importations (USD)',
      'SL.UEM.TOTL.ZS': 'Taux de chômage (%)',
      'SP.URB.TOTL.IN.ZS': 'Taux d\'urbanisation',
      'NY.ADJ.RNEW.GN.ZS': 'Rente des ressources renouvelables'
    };

    const allData = {};

    for (const [indicator, label] of Object.entries(indicators)) {
      try {
        const history = await this.getIndicatorHistory(countryCode, indicator);
        allData[indicator] = {
          label,
          ...history
        };
      } catch (error) {
        console.warn(`Failed to fetch ${label}:`, error);
      }
    }

    return allData;
  }

  // Récupère données simplifiées pour la carte
  async getSimpleCountryData(countryCode) {
    try {
      const exports = await this.getLatestValue(countryCode, 'NE.EXP.GNFS.CD');
      const imports = await this.getLatestValue(countryCode, 'NE.IMP.GNFS.CD');
      const inflation = await this.getLatestValue(countryCode, 'FP.CPI.TOTL.ZG');
      const unemployment = await this.getLatestValue(countryCode, 'SL.UEM.TOTL.ZS');
      const gdp = await this.getLatestValue(countryCode, 'NY.GDP.MKTP.CD');

      return {
        exports: exports ? (exports / 1e9).toFixed(1) : null,
        imports: imports ? (imports / 1e9).toFixed(1) : null,
        inflation: inflation ? inflation.toFixed(2) : null,
        unemployment: unemployment ? unemployment.toFixed(2) : null,
        gdp: gdp ? (gdp / 1e9).toFixed(1) : null
      };
    } catch (error) {
      console.error('Error getting simple country data:', error);
      return null;
    }
  }

  // Récupère la valeur la plus récente d'un indicateur
  async getLatestValue(countryCode, indicator) {
    try {
      const response = await fetch(
        `https://api.worldbank.org/v2/country/${countryCode}/indicator/${indicator}?format=json&per_page=1`
      );

      if (!response.ok) return null;
      const data = await response.json();

      if (data[1] && data[1][0] && data[1][0].value) {
        return parseFloat(data[1][0].value);
      }
    } catch (error) {
      console.error(`Error fetching ${indicator}:`, error);
    }
    return null;
  }

  // Parse réponse World Bank
  parseWorldBankData(items) {
    return items
      .filter(item => item.date && item.value)
      .map(item => ({
        year: item.date,
        value: parseFloat(item.value),
        countryCode: item.countryCode,
        countryName: item.country?.value || 'Unknown'
      }))
      .reverse(); // Du plus ancien au plus récent
  }

  // Croissance annuelle (YoY)
  calculateGrowthRate(history) {
    if (!history || history.length < 2) return null;

    const recent = history[history.length - 1].value;
    const previous = history[history.length - 2].value;

    if (!recent || !previous) return null;

    return {
      current: recent,
      previous: previous,
      growth: ((recent - previous) / previous) * 100,
      trend: recent > previous ? 'up' : 'down'
    };
  }

  // Comparaison entre pays
  async compareCountries(countries = ['FRA', 'DEU', 'GBR'], indicator = 'NY.GDP.MKTP.CD') {
    const comparison = {};

    for (const country of countries) {
      const data = await this.getIndicatorHistory(country, indicator);
      comparison[country] = data;
    }

    return comparison;
  }

  // Mock data - Historique GDP France (exemple)
  getMockIndicatorHistory(countryCode = 'FRA', indicator = 'NY.GDP.MKTP.CD') {
    const mockData = {
      'FRA': {
        'NY.GDP.MKTP.CD': [
          { year: '1990', value: 1427.0 },
          { year: '1995', value: 1554.0 },
          { year: '2000', value: 1331.0 },
          { year: '2005', value: 2128.0 },
          { year: '2010', value: 2638.0 },
          { year: '2015', value: 2418.0 },
          { year: '2018', value: 2778.0 },
          { year: '2020', value: 2603.0 },
          { year: '2021', value: 2938.0 },
          { year: '2022', value: 2779.0 },
          { year: '2023', value: 2918.0 }
        ],
        'FP.CPI.TOTL': [
          { year: '2010', value: 65.2 },
          { year: '2015', value: 71.4 },
          { year: '2018', value: 76.8 },
          { year: '2020', value: 78.1 },
          { year: '2021', value: 81.5 },
          { year: '2022', value: 87.3 },
          { year: '2023', value: 89.2 }
        ]
      },
      'DEU': {
        'NY.GDP.MKTP.CD': [
          { year: '2010', value: 3417.0 },
          { year: '2015', value: 3363.0 },
          { year: '2018', value: 4080.0 },
          { year: '2020', value: 3846.0 },
          { year: '2021', value: 4079.0 },
          { year: '2022', value: 4031.0 },
          { year: '2023', value: 4301.0 }
        ]
      },
      'USA': {
        'NY.GDP.MKTP.CD': [
          { year: '2010', value: 10065.0 },
          { year: '2015', value: 13093.0 },
          { year: '2018', value: 20594.0 },
          { year: '2020', value: 20938.0 },
          { year: '2021', value: 23315.0 },
          { year: '2022', value: 25744.0 },
          { year: '2023', value: 27360.0 }
        ]
      },
      'JPN': {
        'NY.GDP.MKTP.CD': [
          { year: '2010', value: 5959.0 },
          { year: '2015', value: 4123.0 },
          { year: '2018', value: 5082.0 },
          { year: '2020', value: 5065.0 },
          { year: '2021', value: 5109.0 },
          { year: '2022', value: 4233.0 },
          { year: '2023', value: 4231.0 }
        ]
      },
      'CHN': {
        'NY.GDP.MKTP.CD': [
          { year: '2010', value: 6101.0 },
          { year: '2015', value: 11065.0 },
          { year: '2018', value: 13608.0 },
          { year: '2020', value: 14727.0 },
          { year: '2021', value: 17734.0 },
          { year: '2022', value: 18100.0 },
          { year: '2023', value: 17795.0 }
        ]
      }
    };

    const countryData = mockData[countryCode] || mockData['FRA'];
    const indicatorData = countryData[indicator] || countryData['NY.GDP.MKTP.CD'];

    return {
      success: true,
      data: indicatorData.map(item => ({
        year: item.year,
        value: item.value,
        countryCode: countryCode,
        countryName: this.getCountryName(countryCode)
      })),
      source: 'mock',
      indicator: indicator
    };
  }

  // Noms de pays
  getCountryName(code) {
    const names = {
      'FRA': 'France',
      'DEU': 'Germany',
      'GBR': 'United Kingdom',
      'ITA': 'Italy',
      'ESP': 'Spain',
      'USA': 'United States',
      'CAN': 'Canada',
      'MEX': 'Mexico',
      'BRA': 'Brazil',
      'JPN': 'Japan',
      'CHN': 'China',
      'IND': 'India',
      'AUS': 'Australia',
      'KOR': 'South Korea',
      'SGP': 'Singapore'
    };
    return names[code] || code;
  }
}
