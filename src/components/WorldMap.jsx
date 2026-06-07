import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { MapPin, TrendingUp, TrendingDown } from 'lucide-react';

export function WorldMap({ onCountrySelect }) {
  const [hoveredCountry, setHoveredCountry] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState(null);

  const countries = [
    // Europe
    { code: 'FR', name: 'France', x: 520, y: 280, region: 'Europe', gdp: 2.7, status: 'stable' },
    { code: 'DE', name: 'Allemagne', x: 570, y: 260, region: 'Europe', gdp: 4.1, status: 'stable' },
    { code: 'GB', name: 'UK', x: 480, y: 270, region: 'Europe', gdp: 3.3, status: 'stable' },
    { code: 'IT', name: 'Italie', x: 580, y: 310, region: 'Europe', gdp: 2.0, status: 'stable' },
    { code: 'ES', name: 'Espagne', x: 470, y: 310, region: 'Europe', gdp: 1.4, status: 'growth' },

    // Americas
    { code: 'US', name: 'USA', x: 280, y: 300, region: 'Americas', gdp: 28.0, status: 'growth' },
    { code: 'CA', name: 'Canada', x: 260, y: 200, region: 'Americas', gdp: 2.1, status: 'stable' },
    { code: 'MX', name: 'Mexique', x: 240, y: 340, region: 'Americas', gdp: 1.3, status: 'growth' },
    { code: 'BR', name: 'Brésil', x: 380, y: 450, region: 'Americas', gdp: 1.8, status: 'stable' },

    // Asia
    { code: 'JP', name: 'Japon', x: 800, y: 320, region: 'Asia', gdp: 4.2, status: 'stable' },
    { code: 'CN', name: 'Chine', x: 760, y: 340, region: 'Asia', gdp: 17.8, status: 'growth' },
    { code: 'IN', name: 'Inde', x: 680, y: 380, region: 'Asia', gdp: 3.7, status: 'growth' },
    { code: 'SG', name: 'Singapour', x: 750, y: 430, region: 'Asia', gdp: 0.7, status: 'growth' },
    { code: 'SK', name: 'Corée', x: 820, y: 320, region: 'Asia', gdp: 1.8, status: 'stable' },

    // Middle East & Africa
    { code: 'SA', name: 'Arabie Saoudite', x: 620, y: 380, region: 'ME/Africa', gdp: 1.1, status: 'warning' },
    { code: 'AE', name: 'UAE', x: 640, y: 390, region: 'ME/Africa', gdp: 0.5, status: 'growth' },
    { code: 'ZA', name: 'Afrique du Sud', x: 620, y: 520, region: 'ME/Africa', gdp: 0.4, status: 'stable' },

    // Oceania
    { code: 'AU', name: 'Australie', x: 850, y: 500, region: 'Oceania', gdp: 1.4, status: 'stable' },
  ];

  const conflictZones = [
    { name: 'Ukraine', x: 620, y: 240, severity: 'critical', color: '#ef4444' },
    { name: 'Moyen-Orient', x: 640, y: 360, severity: 'high', color: '#f97316' },
    { name: 'Mer de Chine', x: 800, y: 380, severity: 'high', color: '#f97316' },
    { name: 'Sahel', x: 560, y: 420, severity: 'moderate', color: '#eab308' },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'growth':
        return '#22c55e';
      case 'stable':
        return '#06b6d4';
      case 'warning':
        return '#f97316';
      case 'crisis':
        return '#ef4444';
      default:
        return '#a0aec0';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="card-scifi">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="text-cyan-1" />
            Carte Géopolitique Mondiale
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative w-full bg-gradient-to-b from-blue-950/20 to-blue-900/20 rounded-lg p-4 border border-blue-500/20">
            <svg viewBox="0 0 960 600" className="w-full h-auto" style={{ minHeight: '500px' }}>
              {/* Mer */}
              <rect width="960" height="600" fill="rgba(30, 58, 138, 0.3)" />

              {/* Zones de conflit */}
              {conflictZones.map((zone, idx) => (
                <g key={`conflict-${idx}`}>
                  {/* Pulse animation */}
                  <circle
                    cx={zone.x}
                    cy={zone.y}
                    r="15"
                    fill="none"
                    stroke={zone.color}
                    strokeWidth="2"
                    opacity="0.3"
                    style={{
                      animation: `pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite`
                    }}
                  />
                  <circle
                    cx={zone.x}
                    cy={zone.y}
                    r="8"
                    fill={zone.color}
                    opacity="0.8"
                    style={{ cursor: 'pointer' }}
                    onMouseEnter={() => setHoveredCountry(zone.name)}
                    onMouseLeave={() => setHoveredCountry(null)}
                    onClick={() => setSelectedRegion(zone.name)}
                  />
                </g>
              ))}

              {/* Pays */}
              {countries.map((country) => (
                <g key={country.code}>
                  <circle
                    cx={country.x}
                    cy={country.y}
                    r="6"
                    fill={getStatusColor(country.status)}
                    opacity={hoveredCountry === country.code ? 1 : 0.6}
                    style={{
                      cursor: 'pointer',
                      transition: 'all 200ms',
                      filter: hoveredCountry === country.code ? 'drop-shadow(0 0 10px ' + getStatusColor(country.status) + ')' : 'none'
                    }}
                    onMouseEnter={() => setHoveredCountry(country.code)}
                    onMouseLeave={() => setHoveredCountry(null)}
                    onClick={() => onCountrySelect?.(country.code)}
                  />

                  {/* Tooltip au hover */}
                  {hoveredCountry === country.code && (
                    <text
                      x={country.x}
                      y={country.y - 15}
                      textAnchor="middle"
                      fill="#06b6d4"
                      fontSize="11"
                      fontWeight="bold"
                      className="pointer-events-none"
                      style={{ textShadow: '0 0 5px rgba(6, 182, 212, 0.8)' }}
                    >
                      {country.name}
                    </text>
                  )}
                </g>
              ))}

              {/* Légende de statut */}
              <g transform="translate(20, 560)">
                <circle cx="0" cy="0" r="3" fill="#22c55e" />
                <text x="10" y="4" fontSize="10" fill="#a0aec0">Croissance</text>

                <circle cx="90" cy="0" r="3" fill="#06b6d4" />
                <text x="100" y="4" fontSize="10" fill="#a0aec0">Stable</text>

                <circle cx="160" cy="0" r="3" fill="#f97316" />
                <text x="170" y="4" fontSize="10" fill="#a0aec0">Attention</text>

                <circle cx="260" cy="0" r="3" fill="#ef4444" />
                <text x="270" y="4" fontSize="10" fill="#a0aec0">Critique</text>
              </g>
            </svg>
          </div>

          {/* Légende interactive */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
            {countries.slice(0, 8).map((country) => (
              <button
                key={country.code}
                onClick={() => onCountrySelect?.(country.code)}
                className="p-3 rounded-lg bg-background/50 border border-border/30 hover:border-cyan-1/50 hover:bg-cyan-1/5 transition-all cursor-pointer text-left text-sm"
              >
                <p className="font-semibold text-cyan-1">{country.name}</p>
                <p className="text-xs text-muted-foreground">PIB: ${country.gdp}T</p>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Info Zone Conflit */}
      {selectedRegion && (
        <Card className="card-scifi border-red-500/30 bg-red-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-500">
              ⚠️ Zone de Conflit: {selectedRegion}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 bg-background/50 rounded border border-red-500/20">
              <p className="text-sm text-muted-foreground">Impact sur les matières premières</p>
              <p className="font-semibold text-red-400 mt-1">+5 à +25% de volatilité</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-2 bg-background/50 rounded text-xs">
                <p className="text-muted-foreground">Affecte</p>
                <p className="font-semibold">Pétrole, Gaz, Métaux</p>
              </div>
              <div className="p-2 bg-background/50 rounded text-xs">
                <p className="text-muted-foreground">Tendance</p>
                <p className="font-semibold">À surveiller</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Style for pulse animation */}
      <style>{`
        @keyframes pulse {
          0%, 100% { r: 15; opacity: 0.3; }
          50% { r: 25; opacity: 0; }
        }
      `}</style>
    </div>
  );
}
