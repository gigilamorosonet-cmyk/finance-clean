import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { AlertTriangle, TrendingDown, Zap } from 'lucide-react';

export function ConflictMap() {
  const [selectedRegion, setSelectedRegion] = useState(null);

  const conflicts = [
    {
      id: 'ukraine',
      name: 'Ukraine',
      severity: 'Élevée',
      status: 'Actif',
      color: 'from-red-600 to-red-700',
      coordinates: { x: 60, y: 25 },
      affectedCommodities: ['Blé', 'Maïs', 'Fertilisants', 'Pétrole', 'Gaz'],
      impact: {
        priceChange: '+15-25%',
        timeline: 'Immédiat (1-3 mois)',
        probability: 'Très Probable'
      },
      detail: 'Blocage des exportations céréalières, perturbation marché énergétique européen',
      investments: ['Futures blé', 'Pétrole WTI', 'Gaz naturel', 'Agriculteurs alternatifs']
    },
    {
      id: 'middleeast',
      name: 'Moyen-Orient',
      severity: 'Très Élevée',
      status: 'Critique',
      color: 'from-orange-600 to-red-600',
      coordinates: { x: 65, y: 45 },
      affectedCommodities: ['Pétrole', 'Gaz', 'Métaux rares', 'Phosphate'],
      impact: {
        priceChange: '+20-40%',
        timeline: 'Court terme (1-6 mois)',
        probability: 'Hautement Probable'
      },
      detail: 'Perturbation majeure du marché énergétique mondial, 25% du pétrole passe par le Détroit d\'Ormuz',
      investments: ['Pétrole Brent', 'Énergies renouvelables', 'Uranium', 'Métaux rares']
    },
    {
      id: 'southchinasea',
      name: 'Mer de Chine du Sud',
      severity: 'Élevée',
      status: 'Tension',
      color: 'from-yellow-600 to-orange-600',
      coordinates: { x: 80, y: 50 },
      affectedCommodities: ['Électronique', 'Semiconducteurs', 'Lithium', 'Rare Earths'],
      impact: {
        priceChange: '+10-20%',
        timeline: 'Moyen terme (3-12 mois)',
        probability: 'Probable'
      },
      detail: '30% du commerce maritime passe ici. Tensions commerciales sino-américaines croissantes',
      investments: ['Semiconducteurs alternatifs', 'Batteries', 'Supply chain résilience', 'Lithium']
    },
    {
      id: 'africa',
      name: 'Afrique (Sahel)',
      severity: 'Modérée',
      status: 'Chronique',
      color: 'from-yellow-500 to-yellow-600',
      coordinates: { x: 45, y: 50 },
      affectedCommodities: ['Or', 'Cobalt', 'Uranium', 'Coltan'],
      impact: {
        priceChange: '+5-15%',
        timeline: 'Long terme (6-24 mois)',
        probability: 'Modérée'
      },
      detail: 'Instabilité politique affectant extraction de minéraux critiques pour la transition verte',
      investments: ['Or', 'Métaux de transition', 'ETF miniers', 'Cobalt']
    },
    {
      id: 'venezuela',
      name: 'Venezuela',
      severity: 'Modérée',
      status: 'Instable',
      color: 'from-orange-500 to-yellow-600',
      coordinates: { x: 25, y: 60 },
      affectedCommodities: ['Pétrole lourd', 'Or', 'Bauxite'],
      impact: {
        priceChange: '+5-12%',
        timeline: 'Moyen terme (3-12 mois)',
        probability: 'Probable'
      },
      detail: 'Crise politique continue, réduction de la production pétrolière mondiale',
      investments: ['Pétrole WTI', 'Energie alternatives', 'Or physique']
    }
  ];

  const selectedConflict = conflicts.find(c => c.id === selectedRegion);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gradient-cyan mb-2">Zones de Conflit & Matières Premières</h2>
        <p className="text-muted-foreground">Impact géopolitique sur les marchés mondiaux</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map */}
        <Card className="card-scifi lg:col-span-2">
          <CardHeader>
            <CardTitle>Carte Interactive</CardTitle>
            <CardDescription>Cliquez sur une région pour voir l'impact détaillé</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative w-full h-96 bg-gradient-to-br from-background to-background/50 rounded-lg border border-border/30 overflow-hidden">
              {/* SVG Map Background */}
              <svg className="w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                {/* Continents (simplified) */}
                <rect x="0" y="0" width="100" height="100" fill="#0a0a14" opacity="0.5" />

                {/* Grid */}
                <defs>
                  <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                    <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#06b6d4" strokeWidth="0.1" opacity="0.1" />
                  </pattern>
                </defs>
                <rect width="100" height="100" fill="url(#grid)" />

                {/* Zones de conflit */}
                {conflicts.map((conflict) => (
                  <g key={conflict.id}>
                    {/* Pulse effect */}
                    <circle
                      cx={conflict.coordinates.x}
                      cy={conflict.coordinates.y}
                      r="4"
                      fill={conflict.color.split(' ')[0].replace('from-', '')}
                      opacity="0.3"
                      className="animate-pulse"
                    />

                    {/* Main marker */}
                    <circle
                      cx={conflict.coordinates.x}
                      cy={conflict.coordinates.y}
                      r="2.5"
                      className={`bg-gradient-to-r ${conflict.color} cursor-pointer transition-all hover:r-3 stroke-2`}
                      fill={conflict.severity === 'Très Élevée' ? '#dc2626' : conflict.severity === 'Élevée' ? '#ea580c' : '#eab308'}
                      onClick={() => setSelectedRegion(conflict.id)}
                      style={{ cursor: 'pointer' }}
                    />

                    {/* Label */}
                    <text
                      x={conflict.coordinates.x}
                      y={conflict.coordinates.y - 3}
                      textAnchor="middle"
                      className="text-xs fill-cyan-2 font-bold pointer-events-none"
                      fontSize="2"
                    >
                      {conflict.name.split(' ')[0]}
                    </text>
                  </g>
                ))}
              </svg>

              {/* Overlay Legend */}
              <div className="absolute bottom-4 left-4 space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-600"></div>
                  <span className="text-muted-foreground">Très Élevée</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-orange-600"></div>
                  <span className="text-muted-foreground">Élevée</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                  <span className="text-muted-foreground">Modérée</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Regions List */}
        <Card className="card-scifi">
          <CardHeader>
            <CardTitle className="text-lg">Régions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {conflicts.map((conflict) => (
                <button
                  key={conflict.id}
                  onClick={() => setSelectedRegion(conflict.id)}
                  className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                    selectedRegion === conflict.id
                      ? 'border-cyan-1 bg-cyan-1/10'
                      : 'border-border/30 bg-background/50 hover:border-border'
                  }`}
                >
                  <div className="flex items-start justify-between mb-1">
                    <p className="font-bold text-sm">{conflict.name}</p>
                    <span className={`text-xs px-2 py-1 rounded font-bold ${
                      conflict.severity === 'Très Élevée' ? 'bg-red-500/20 text-red-400' :
                      conflict.severity === 'Élevée' ? 'bg-orange-500/20 text-orange-400' :
                      'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {conflict.severity}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{conflict.affectedCommodities.slice(0, 2).join(', ')}...</p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Impact */}
      {selectedConflict && (
        <Card className="card-scifi border-2 border-cyan-1/50">
          <CardHeader className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <AlertTriangle className={`flex-shrink-0 ${
                selectedConflict.severity === 'Très Élevée' ? 'text-red-500' :
                selectedConflict.severity === 'Élevée' ? 'text-orange-500' :
                'text-yellow-500'
              }`} size={24} />
              <div>
                <CardTitle>{selectedConflict.name}</CardTitle>
                <CardDescription>{selectedConflict.detail}</CardDescription>
              </div>
            </div>
            <span className={`text-sm px-3 py-1 rounded-lg font-bold ${
              selectedConflict.status === 'Critique' ? 'bg-red-500/20 text-red-400' :
              selectedConflict.status === 'Actif' ? 'bg-orange-500/20 text-orange-400' :
              'bg-yellow-500/20 text-yellow-400'
            }`}>
              {selectedConflict.status}
            </span>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Impact Analysis */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-background/50 rounded-lg border border-red-500/20">
                <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                  <TrendingDown size={16} className="text-red-500" />
                  Impact Prix
                </p>
                <p className="text-2xl font-bold text-red-500">{selectedConflict.impact.priceChange}</p>
              </div>
              <div className="p-4 bg-background/50 rounded-lg border border-cyan-1/20">
                <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                  <Zap size={16} className="text-cyan-1" />
                  Timeline
                </p>
                <p className="text-lg font-bold text-cyan-1">{selectedConflict.impact.timeline}</p>
              </div>
              <div className="p-4 bg-background/50 rounded-lg border border-gold-1/20">
                <p className="text-sm text-muted-foreground mb-1">Probabilité</p>
                <p className="text-lg font-bold text-gold-1">{selectedConflict.impact.probability}</p>
              </div>
            </div>

            {/* Affected Commodities */}
            <div>
              <h4 className="font-bold text-sm mb-3">Matières Premières Affectées</h4>
              <div className="flex flex-wrap gap-2">
                {selectedConflict.affectedCommodities.map((commodity, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-cyan-1/10 border border-cyan-1/30 rounded-lg text-sm text-cyan-2"
                  >
                    {commodity}
                  </span>
                ))}
              </div>
            </div>

            {/* Investment Opportunities */}
            <div>
              <h4 className="font-bold text-sm mb-3">Opportunités d'Investissement</h4>
              <div className="space-y-2">
                {selectedConflict.investments.map((investment, idx) => (
                  <div key={idx} className="p-2 bg-background/50 rounded border border-border/30 text-sm">
                    <p className="text-green-500 font-semibold">✓ {investment}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
