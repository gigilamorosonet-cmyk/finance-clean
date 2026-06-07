import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { WorldMap } from './WorldMap';
import { ForexAndRates } from './ForexAndRates';
import { TradeFlows } from './TradeFlows';
import { CostOfLiving } from './CostOfLiving';
import { Globe, Zap } from 'lucide-react';

export function GlobalAnalysis() {
  const [selectedCountry, setSelectedCountry] = useState('FR');
  const [activeTab, setActiveTab] = useState('map');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-1 to-gold-1 flex items-center justify-center">
          <Globe className="text-background" size={24} />
        </div>
        <div>
          <h1 className="text-4xl font-bold">Analyse Géopolitique Mondiale</h1>
          <p className="text-muted-foreground">Taux de change, zones de conflit, flux commerciaux & coût de la vie</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="card-scifi">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Pays Analysés</p>
            <p className="text-2xl font-bold text-cyan-1">30+</p>
          </CardContent>
        </Card>
        <Card className="card-scifi">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Taux Directeurs</p>
            <p className="text-2xl font-bold text-gold-1">5</p>
          </CardContent>
        </Card>
        <Card className="card-scifi">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Zones de Conflit</p>
            <p className="text-2xl font-bold text-red-500">4</p>
          </CardContent>
        </Card>
        <Card className="card-scifi">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Données Réelles</p>
            <p className="text-2xl font-bold text-green-500">Temps Réel</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-background/50 border border-border/30">
          <TabsTrigger value="map">
            <Globe size={16} className="mr-2" />
            Carte Mondiale
          </TabsTrigger>
          <TabsTrigger value="forex">
            <Zap size={16} className="mr-2" />
            Taux & Intérêts
          </TabsTrigger>
          <TabsTrigger value="trade">
            <span className="mr-2">📦</span>
            Commerce
          </TabsTrigger>
          <TabsTrigger value="living">
            <span className="mr-2">💰</span>
            Coût de Vie
          </TabsTrigger>
        </TabsList>

        {/* Carte Mondiale */}
        <TabsContent value="map" className="space-y-4">
          <WorldMap onCountrySelect={setSelectedCountry} />

          {/* Info sélection */}
          <Card className="card-scifi bg-cyan-1/5 border-cyan-1/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="text-cyan-1" />
                Pays Sélectionné: {selectedCountry}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Cliquez sur un pays pour voir plus de détails dans les autres onglets.
                Les zones de conflit sont affichées en rouge/orange sur la carte.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Taux de Change & Intérêts */}
        <TabsContent value="forex" className="space-y-4">
          <ForexAndRates selectedCountry={selectedCountry} />
        </TabsContent>

        {/* Flux Commerciaux */}
        <TabsContent value="trade" className="space-y-4">
          <TradeFlows selectedCountry={selectedCountry} />
        </TabsContent>

        {/* Coût de la Vie */}
        <TabsContent value="living" className="space-y-4">
          <CostOfLiving selectedCountry={selectedCountry} />
        </TabsContent>
      </Tabs>

      {/* Info & Insights */}
      <Card className="card-scifi border-gold-1/30 bg-gold-1/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gold-1">
            💡 Insights Investisseur
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="font-semibold text-gold-1 mb-1">📊 Taux Directeurs</p>
              <p className="text-muted-foreground text-xs">
                Plus le taux est élevé, meilleur rendement sur les économies et obligations. Influence aussi les prix des actions.
              </p>
            </div>
            <div>
              <p className="font-semibold text-gold-1 mb-1">🌍 Zones de Conflit</p>
              <p className="text-muted-foreground text-xs">
                Affectent les matières premières (pétrole, métaux). Une escalade = hausse des prix et volatilité.
              </p>
            </div>
            <div>
              <p className="font-semibold text-gold-1 mb-1">💼 Flux Commerciaux</p>
              <p className="text-muted-foreground text-xs">
                Un déficit commercial peut affaiblir la devise locale. Un excédent peut la renforcer.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Sources */}
      <Card className="card-scifi border-cyan-1/20">
        <CardHeader>
          <CardTitle className="text-sm">Sources des Données</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>📈 <strong>Taux de Change:</strong> Frankfurter API (libre d'accès)</li>
            <li>🏦 <strong>Taux Directeurs:</strong> Données banques centrales (BCE, FED, BoJ, PBC, BoE)</li>
            <li>📦 <strong>Flux Commerciaux:</strong> Données OMC & statistiques nationales</li>
            <li>💰 <strong>Coût de la Vie:</strong> Numbeo & données EIU</li>
            <li>⚠️ <strong>Zones de Conflit:</strong> Suivi géopolitique en temps réel</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
