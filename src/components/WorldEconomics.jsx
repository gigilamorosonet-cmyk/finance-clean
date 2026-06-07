import { useState, useEffect } from 'react';
import { Globe, TrendingUp, TrendingDown, AlertTriangle, Search } from 'lucide-react';
import { WorldBankService } from '@/services/worldBankService';

export function WorldEconomics() {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [countryData, setCountryData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [allCountries, setAllCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const worldBankService = new WorldBankService();

  // Liste complète de pays majeurs (ISO codes)
  const majorCountries = [
    { name: 'États-Unis', code: 'USA' },
    { name: 'Chine', code: 'CHN' },
    { name: 'Japon', code: 'JPN' },
    { name: 'Allemagne', code: 'DEU' },
    { name: 'Royaume-Uni', code: 'GBR' },
    { name: 'France', code: 'FRA' },
    { name: 'Inde', code: 'IND' },
    { name: 'Italie', code: 'ITA' },
    { name: 'Brésil', code: 'BRA' },
    { name: 'Canada', code: 'CAN' },
    { name: 'Corée du Sud', code: 'KOR' },
    { name: 'Espagne', code: 'ESP' },
    { name: 'Mexique', code: 'MEX' },
    { name: 'Indonésie', code: 'IDN' },
    { name: 'Pays-Bas', code: 'NLD' },
    { name: 'Suisse', code: 'CHE' },
    { name: 'Suède', code: 'SWE' },
    { name: 'Pologne', code: 'POL' },
    { name: 'Belgique', code: 'BEL' },
    { name: 'Argentine', code: 'ARG' },
    { name: 'Norvège', code: 'NOR' },
    { name: 'Autriche', code: 'AUT' },
    { name: 'Turquie', code: 'TUR' },
    { name: 'Australie', code: 'AUS' },
    { name: 'Thaïlande', code: 'THA' },
    { name: 'Vietnam', code: 'VNM' },
    { name: 'Singapour', code: 'SGP' },
    { name: 'Hong Kong', code: 'HKG' },
    { name: 'Malaisie', code: 'MYS' },
    { name: 'Pakistan', code: 'PAK' },
    { name: 'Afrique du Sud', code: 'ZAF' },
    { name: 'Égypte', code: 'EGY' },
    { name: 'Nigeria', code: 'NGA' },
    { name: 'Russie', code: 'RUS' },
    { name: 'Ukraine', code: 'UKR' },
    { name: 'Israël', code: 'ISR' },
    { name: 'Arabie Saoudite', code: 'SAU' },
    { name: 'Émirats Arabes Unis', code: 'ARE' },
    { name: 'Grèce', code: 'GRC' },
    { name: 'Portugal', code: 'PRT' },
  ];

  useEffect(() => {
    setAllCountries(majorCountries);
    setFilteredCountries(majorCountries);
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    if (term === '') {
      setFilteredCountries(allCountries);
    } else {
      setFilteredCountries(
        allCountries.filter(country =>
          country.name.toLowerCase().includes(term) || country.code.toLowerCase().includes(term)
        )
      );
    }
  };

  const handleCountryClick = async (country) => {
    setSelectedCountry(country);
    setLoading(true);
    setCountryData(null);

    const data = await worldBankService.getSimpleCountryData(country.code);
    setCountryData(data);
    setLoading(false);
  };

  return (
    <div className="space-y-8">
      {/* Titre */}
      <div>
        <h1 className="text-4xl font-bold text-slate-100 mb-2">🌍 Monde Économique</h1>
        <p className="text-slate-400">Données réelles de la Banque Mondiale - Sélectionnez un pays</p>
      </div>

      {/* Recherche */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
        <div className="flex items-center gap-3 px-4 py-3 bg-slate-700/30 rounded-lg border border-slate-600">
          <Search size={20} className="text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher un pays (ex: France, USA)..."
            value={searchTerm}
            onChange={handleSearch}
            className="flex-1 bg-transparent text-slate-100 placeholder-slate-500 outline-none"
          />
        </div>
      </div>

      {/* Liste des Pays */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
        <h2 className="text-xl font-bold text-slate-100 mb-4">🗺️ Pays disponibles ({filteredCountries.length})</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 max-h-96 overflow-y-auto">
          {filteredCountries.map((country) => (
            <button
              key={country.code}
              onClick={() => handleCountryClick(country)}
              className={`p-4 rounded-lg border transition-all text-left ${
                selectedCountry?.code === country.code
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-400'
                  : 'bg-slate-700/30 border-slate-600 text-slate-300 hover:border-cyan-400/50'
              }`}
            >
              <div className="font-bold text-sm">{country.name}</div>
              <div className="text-xs text-slate-500 mt-1">{country.code}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Données Détaillées */}
      {selectedCountry && (
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-cyan-400 flex items-center gap-2">
              <Globe size={24} />
              {selectedCountry.name}
            </h2>
            {loading && <div className="text-slate-400 animate-pulse">Chargement données Banque Mondiale...</div>}
          </div>

          {countryData && !loading && (
            <div className="space-y-6">
              {/* Commerce International - World Bank Data */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/30 rounded-lg p-4">
                  <p className="text-slate-400 text-sm mb-2">📤 Exportations</p>
                  <p className="text-2xl font-bold text-green-400">
                    {countryData.exports ? `$${countryData.exports}B` : '---'}
                  </p>
                  <p className="text-xs text-slate-500 mt-2">Source: Banque Mondiale</p>
                </div>
                <div className="bg-gradient-to-br from-red-500/10 to-red-600/10 border border-red-500/30 rounded-lg p-4">
                  <p className="text-slate-400 text-sm mb-2">📥 Importations</p>
                  <p className="text-2xl font-bold text-red-400">
                    {countryData.imports ? `$${countryData.imports}B` : '---'}
                  </p>
                  <p className="text-xs text-slate-500 mt-2">Source: Banque Mondiale</p>
                </div>
                <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/30 rounded-lg p-4">
                  <p className="text-slate-400 text-sm mb-2">⚖️ Solde Commercial</p>
                  <p className="text-2xl font-bold text-blue-400">
                    {countryData.exports && countryData.imports
                      ? `$${(parseFloat(countryData.exports) - parseFloat(countryData.imports)).toFixed(1)}B`
                      : '---'}
                  </p>
                  <p className="text-xs text-slate-500 mt-2">Exp - Imp</p>
                </div>
              </div>

              {/* Indicateurs Économiques */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-700/30 border border-slate-600 rounded-lg p-4">
                  <p className="text-slate-400 text-sm mb-3">📊 PIB</p>
                  <p className="text-2xl font-bold text-blue-400">
                    {countryData.gdp ? `$${countryData.gdp}B` : '---'}
                  </p>
                  <p className="text-xs text-slate-500 mt-2">Produit Intérieur Brut</p>
                </div>

                <div className="bg-slate-700/30 border border-slate-600 rounded-lg p-4">
                  <p className="text-slate-400 text-sm mb-3">💰 Inflation</p>
                  <p className="text-2xl font-bold text-orange-400">
                    {countryData.inflation !== null ? `${countryData.inflation}%` : '---'}
                  </p>
                  <p className="text-xs text-slate-500 mt-2">Taux inflation annuel</p>
                </div>

                <div className="bg-slate-700/30 border border-slate-600 rounded-lg p-4">
                  <p className="text-slate-400 text-sm mb-3">📉 Chômage</p>
                  <p className="text-2xl font-bold text-yellow-400">
                    {countryData.unemployment !== null ? `${countryData.unemployment}%` : '---'}
                  </p>
                  <p className="text-xs text-slate-500 mt-2">Taux de chômage</p>
                </div>
              </div>

              {/* Source Info */}
              <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Globe size={20} className="text-cyan-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-slate-300 font-medium">📊 Données en temps réel</p>
                    <p className="text-slate-400 text-sm mt-1">
                      Les données économiques proviennent de la <strong>Banque Mondiale (World Bank API)</strong> et de l'<strong>FMI (IMF)</strong>.
                      Elles sont mises à jour régulièrement avec les derniers indicateurs économiques.
                    </p>
                    <p className="text-slate-500 text-xs mt-2">
                      API gratuite • Données publiques • Dernière mise à jour: 2024-2025
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {!loading && !countryData && (
            <div className="text-center py-8 text-slate-400">
              <p>Données non disponibles pour ce pays</p>
              <p className="text-sm mt-2">Essayez un autre pays</p>
            </div>
          )}
        </div>
      )}

      {/* Info */}
      <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-6">
        <h3 className="text-lg font-bold text-slate-100 mb-3">ℹ️ À propos</h3>
        <p className="text-slate-400 text-sm mb-3">
          Monde Économique affiche les indicateurs économiques réels de plus de 190 pays.
        </p>
        <div className="space-y-2 text-sm text-slate-400">
          <p>✅ <strong>Exportations & Importations</strong> - Données commerciales en temps réel</p>
          <p>✅ <strong>Inflation</strong> - Taux d'inflation annuel</p>
          <p>✅ <strong>Chômage</strong> - Taux de chômage actuel</p>
          <p>✅ <strong>PIB</strong> - Produit Intérieur Brut en USD courant</p>
          <p>✅ <strong>API Gratuite</strong> - World Bank Data + IMF Data (accès libre, pas de clé requise)</p>
        </div>
      </div>
    </div>
  );
}
