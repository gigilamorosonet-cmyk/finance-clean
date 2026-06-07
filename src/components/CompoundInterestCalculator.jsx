import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { TrendingUp, BarChart3 } from 'lucide-react';

export function CompoundInterestCalculator() {
  const [principal, setPrincipal] = useState(10000);
  const [rate, setRate] = useState(7);
  const [years, setYears] = useState(20);
  const [frequency, setFrequency] = useState('annual');
  const [result, setResult] = useState(null);

  useEffect(() => {
    calculateCompound();
  }, [principal, rate, years, frequency]);

  const calculateCompound = () => {
    const frequencyMap = {
      annual: 1,
      semiannual: 2,
      quarterly: 4,
      monthly: 12,
      daily: 365
    };

    const n = frequencyMap[frequency];
    const P = parseFloat(principal);
    const r = parseFloat(rate) / 100;
    const t = parseInt(years);

    const A = P * Math.pow(1 + r / n, n * t);
    const interest = A - P;

    // Générer données année par année
    const yearlyData = [];
    for (let i = 0; i <= t; i += Math.max(1, Math.floor(t / 10))) {
      const value = P * Math.pow(1 + r / n, n * i);
      yearlyData.push({
        year: i,
        value: Math.round(value),
        interest: Math.round(value - P)
      });
    }

    setResult({
      finalAmount: Math.round(A),
      totalInterest: Math.round(interest),
      monthlyContribution: (A / (t * 12)).toFixed(2),
      yearlyData
    });
  };

  const frequencyLabels = {
    annual: 'Annuel',
    semiannual: 'Semestriel',
    quarterly: 'Trimestriel',
    monthly: 'Mensuel',
    daily: 'Quotidien'
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gradient-cyan mb-2">Calculateur d'Intérêt Composé</h2>
        <p className="text-muted-foreground">Simulez la croissance de votre capital avec intérêts composés</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Inputs */}
        <Card className="card-scifi">
          <CardHeader>
            <CardTitle className="text-lg">Paramètres</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Capital Initial */}
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Capital Initial
              </label>
              <input
                type="number"
                value={principal}
                onChange={(e) => setPrincipal(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:border-cyan-1"
              />
              <p className="text-xs text-cyan-2 mt-1">{parseInt(principal).toLocaleString()}€</p>
            </div>

            {/* Taux Annuel */}
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Taux Annuel (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:border-cyan-1"
              />
              <p className="text-xs text-gold-2 mt-1">Rendement annuel</p>
            </div>

            {/* Durée */}
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Durée (années)
              </label>
              <input
                type="number"
                value={years}
                onChange={(e) => setYears(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:border-cyan-1"
              />
              <p className="text-xs text-cyan-2 mt-1">{years} ans</p>
            </div>

            {/* Fréquence */}
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Fréquence de Composition
              </label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:border-cyan-1"
              >
                <option value="annual">Annuel</option>
                <option value="semiannual">Semestriel</option>
                <option value="quarterly">Trimestriel</option>
                <option value="monthly">Mensuel</option>
                <option value="daily">Quotidien</option>
              </select>
              <p className="text-xs text-gold-2 mt-1">{frequencyLabels[frequency]}</p>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {result && (
          <Card className="card-scifi lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="text-green-500" />
                Résultats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-background/50 rounded-lg border border-green-500/20">
                  <p className="text-sm text-muted-foreground mb-1">Capital Final</p>
                  <p className="text-3xl font-bold text-green-500">
                    {result.finalAmount.toLocaleString()}€
                  </p>
                </div>

                <div className="p-4 bg-background/50 rounded-lg border border-cyan-1/20">
                  <p className="text-sm text-muted-foreground mb-1">Intérêts Gagnés</p>
                  <p className="text-3xl font-bold text-cyan-1">
                    +{result.totalInterest.toLocaleString()}€
                  </p>
                </div>

                <div className="p-4 bg-background/50 rounded-lg border border-gold-1/20">
                  <p className="text-sm text-muted-foreground mb-1">Gain %</p>
                  <p className="text-3xl font-bold text-gold-1">
                    {((result.totalInterest / principal) * 100).toFixed(1)}%
                  </p>
                </div>

                <div className="p-4 bg-background/50 rounded-lg border border-cyan-2/20">
                  <p className="text-sm text-muted-foreground mb-1">Par Mois</p>
                  <p className="text-3xl font-bold text-cyan-2">
                    {result.monthlyContribution}€
                  </p>
                </div>
              </div>

              {/* Breakdown */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Capital investi</span>
                  <span className="font-bold text-cyan-1">{parseInt(principal).toLocaleString()}€</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Intérêts composés</span>
                  <span className="font-bold text-green-500">+{result.totalInterest.toLocaleString()}€</span>
                </div>
                <div className="h-2 bg-background rounded-full overflow-hidden mt-3">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-1 to-green-500"
                    style={{
                      width: `${(result.totalInterest / result.finalAmount) * 100}%`
                    }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Progression Chart */}
      {result && (
        <Card className="card-scifi">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="text-gold-1" />
              Projection de Croissance
            </CardTitle>
            <CardDescription>Évolution de votre capital au fil des ans</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {result.yearlyData.map((year, idx) => {
                const maxValue = result.finalAmount;
                const percentage = (year.value / maxValue) * 100;

                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Année {year.year}</span>
                      <div className="flex gap-4">
                        <span className="text-cyan-1 font-bold">{year.value.toLocaleString()}€</span>
                        <span className="text-green-500 font-bold">+{year.interest.toLocaleString()}€</span>
                      </div>
                    </div>
                    <div className="h-2 bg-background rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-1 via-gold-1 to-green-500"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Formula */}
            <div className="mt-8 p-4 bg-background/50 rounded-lg border border-border/30">
              <p className="text-sm text-muted-foreground mb-2">Formule utilisée:</p>
              <p className="font-mono text-cyan-2 text-sm">
                A = P × (1 + r/n)<sup>nt</sup>
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                A = Montant final | P = Principal | r = Taux | n = Fréquence | t = Temps
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
