import { useState, useEffect } from 'react';
import { Globe } from 'lucide-react';

export function CountrySelector({ onCountryChange }) {
  const [selectedCountry, setSelectedCountry] = useState('FR');

  const countries = [
    { code: 'FR', name: 'France 🇫🇷', currency: 'EUR', market: 'CAC40' },
    { code: 'US', name: 'États-Unis 🇺🇸', currency: 'USD', market: 'S&P500' },
    { code: 'DE', name: 'Allemagne 🇩🇪', currency: 'EUR', market: 'DAX' },
    { code: 'JP', name: 'Japon 🇯🇵', currency: 'JPY', market: 'Nikkei' },
    { code: 'CN', name: 'Chine 🇨🇳', currency: 'CNY', market: 'SSE' },
    { code: 'GB', name: 'Royaume-Uni 🇬🇧', currency: 'GBP', market: 'FTSE100' },
    { code: 'CA', name: 'Canada 🇨🇦', currency: 'CAD', market: 'TSX' },
    { code: 'AU', name: 'Australie 🇦🇺', currency: 'AUD', market: 'ASX200' },
  ];

  const handleCountryChange = (code) => {
    setSelectedCountry(code);
    if (onCountryChange) {
      onCountryChange(code);
    }
    localStorage.setItem('selectedCountry', code);
  };

  useEffect(() => {
    const saved = localStorage.getItem('selectedCountry');
    if (saved) {
      setSelectedCountry(saved);
    }
  }, []);

  const selected = countries.find(c => c.code === selectedCountry);

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2 px-4 py-2 bg-background/50 rounded-lg border border-border/30">
        <Globe className="text-cyan-1" size={18} />
        <select
          value={selectedCountry}
          onChange={(e) => handleCountryChange(e.target.value)}
          className="bg-transparent border-none outline-none text-foreground font-medium cursor-pointer"
        >
          {countries.map(country => (
            <option key={country.code} value={country.code}>
              {country.name} • {country.currency}
            </option>
          ))}
        </select>
      </div>

      {selected && (
        <div className="hidden md:flex items-center gap-3">
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Marché principal</p>
            <p className="text-sm font-bold text-cyan-1">{selected.market}</p>
          </div>
        </div>
      )}
    </div>
  );
}
