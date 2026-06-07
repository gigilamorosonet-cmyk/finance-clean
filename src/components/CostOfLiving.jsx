import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { ForexService } from '@/services/forexService';
import { Home, Utensils, DollarSign, Zap } from 'lucide-react';

export function CostOfLiving({ selectedCountry }) {
  const [costData, setCostData] = useState(null);
  const [comparisonCountries, setComparisonCountries] = useState([]);
  const forexService = new ForexService();

  useEffect(() => {
    const allCosts = forexService.getCostOfLiving();
    const selected = allCosts.data[selectedCountry];
    setCostData(selected);

    // Charger d'autres pays pour comparaison
    const others = Object.values(allCosts.data).slice(0, 5);
    setComparisonCountries(others);
  }, [selectedCountry]);

  if (!costData) {
    return <div className="text-center py-8 text-muted-foreground">Chargement...</div>;
  }

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Logement':
        return <Home size={16} className="text-blue-400" />;
      case 'Alimentation':
        return <Utensils size={16} className="text-green-400" />;
      case 'Transport':
        return <Zap size={16} className="text-yellow-400" />;
      case 'Santé':
        return <DollarSign size={16} className="text-red-400" />;
      default:
        return <DollarSign size={16} className="text-cyan-1" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête avec info principale */}
      <Card className="card-scifi bg-gradient-to-r from-cyan-1/5 to-gold-1/5">
        <CardHeader>
          <CardTitle>💰 Coût de la Vie - {costData.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-background/50 border border-cyan-1/30">
              <p className="text-sm text-muted-foreground mb-1">Ville</p>
              <p className="text-2xl font-bold text-cyan-1">{costData.city}</p>
              <p className="text-xs text-muted-foreground mt-1">Basé sur les données urbaines</p>
            </div>

            <div className="p-4 rounded-lg bg-background/50 border border-gold-1/30">
              <p className="text-sm text-muted-foreground mb-1">Indice COL</p>
              <p className="text-2xl font-bold text-gold-1">{costData.index}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {costData.index > 100 ? 'Plus cher que NYC' : costData.index < 100 ? 'Moins cher que NYC' : 'Égal à NYC'}
              </p>
            </div>

            <div className="p-4 rounded-lg bg-background/50 border border-green-500/30">
              <p className="text-sm text-muted-foreground mb-1">Budget Mensuel</p>
              <p className="text-2xl font-bold text-green-500">
                {costData.monthlyBudget.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground mt-1">{costData.currency} pour mode de vie standard</p>
            </div>
          </div>

          {/* Barre comparative d'indice */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold">Position vs. New York (100)</p>
              <p className="text-sm text-cyan-1 font-bold">{costData.index}</p>
            </div>
            <div className="h-3 bg-background rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-1 to-gold-1"
                style={{ width: `${costData.index}%` }}
              />
            </div>
            <div className="flex justify-between mt-1 text-xs text-muted-foreground">
              <span>Moins cher (0)</span>
              <span>NYC (100)</span>
              <span>Plus cher (150+)</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Breakdown des dépenses */}
      <Card className="card-scifi">
        <CardHeader>
          <CardTitle>📊 Répartition des Dépenses Mensuelles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(costData.breakdown).map(([category, percentage]) => (
              <div key={category}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(category)}
                    <span className="text-sm font-semibold">{category}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-cyan-1">{percentage}%</p>
                    <p className="text-xs text-muted-foreground">
                      ≈ {costData.currency} {Math.round((costData.monthlyBudget * percentage) / 100)}
                    </p>
                  </div>
                </div>
                <div className="h-2 bg-background rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-1 to-gold-1"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Note explicative */}
          <div className="mt-6 p-3 bg-cyan-1/5 border border-cyan-1/20 rounded-lg text-sm text-muted-foreground">
            <p className="text-xs">
              📌 <strong>Note:</strong> Le logement est généralement la plus grande dépense. Ces estimations représentent un mode de vie standard pour une personne seule en zone urbaine.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Comparaison avec d'autres pays */}
      <Card className="card-scifi">
        <CardHeader>
          <CardTitle>🌍 Comparaison Mondiale</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {comparisonCountries.map((country) => (
              <div
                key={country.name}
                className="p-3 rounded-lg bg-background/50 border border-border/30"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-sm">{country.name}</p>
                    <p className="text-xs text-muted-foreground">{country.city}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-3">
                      {/* Indice visuel */}
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <div
                            key={i}
                            className={`w-2 h-5 rounded ${
                              (i + 1) <= Math.round(country.index / 30)
                                ? 'bg-cyan-1'
                                : 'bg-border/30'
                            }`}
                          />
                        ))}
                      </div>
                      <span className={`text-sm font-bold ${
                        country.index === costData.index ? 'text-gold-1' :
                        country.index > costData.index ? 'text-red-500' :
                        'text-green-500'
                      }`}>
                        {country.index}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-2 h-1.5 bg-background rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      country.index === costData.index ? 'bg-gold-1' :
                      country.index > costData.index ? 'bg-red-500' :
                      'bg-green-500'
                    }`}
                    style={{ width: `${country.index}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Conseils pratiques */}
      <Card className="card-scifi border-gold-1/30 bg-gold-1/5">
        <CardHeader>
          <CardTitle className="text-gold-1">💡 Conseils pour Réduire le COL</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex gap-2">
            <span className="text-gold-1 font-bold">•</span>
            <p className="text-sm text-muted-foreground">Chercher un logement dans les quartiers moins touristiques</p>
          </div>
          <div className="flex gap-2">
            <span className="text-gold-1 font-bold">•</span>
            <p className="text-sm text-muted-foreground">Utiliser les transports en commun plutôt que les taxis</p>
          </div>
          <div className="flex gap-2">
            <span className="text-gold-1 font-bold">•</span>
            <p className="text-sm text-muted-foreground">Cuisiner à la maison au lieu de manger au restaurant</p>
          </div>
          <div className="flex gap-2">
            <span className="text-gold-1 font-bold">•</span>
            <p className="text-sm text-muted-foreground">Profiter des marché locaux pour l'alimentation</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
