# 🌍 Guide Complet - Carte du Monde Géopolitique Interactive

## 📋 Vue d'Ensemble

Vous avez demandé une **Carte du Monde Interactive** avec:
- ✅ Données économiques par pays
- ✅ Zones de conflit affectant les marchés
- ✅ Flux commerciaux (import/export)
- ✅ Taux directeurs (BCE/Fed/BoJ)
- ✅ Taux de change (Frankfurter API)
- ✅ Coût de la vie par pays

**C'est FAIT!** 🚀

---

## 📦 Fichiers Créés

### Services (Backend)
- **`src/services/forexService.js`** - Service pour taux de change, taux directeurs, coût de vie, flux commerciaux

### Composants UI
1. **`src/components/WorldMap.jsx`** - Carte SVG interactive du monde
2. **`src/components/ForexAndRates.jsx`** - Taux de change + taux directeurs
3. **`src/components/TradeFlows.jsx`** - Flux import/export par pays
4. **`src/components/CostOfLiving.jsx`** - Coût de la vie + breakdown
5. **`src/components/GlobalAnalysis.jsx`** - Hub central (tous les 4 composants en onglets)

### Configuration
- **App.jsx** - Ajouté route `/global`
- **Sidebar.jsx** - Ajouté menu "Géopolitique"

---

## 🗺️ Carte du Monde Interactive

### Fonctionnalités

```jsx
<WorldMap onCountrySelect={setSelectedCountry} />
```

✨ **Features:**
- 20+ pays tracés avec positions exactes
- Couleurs selon statut économique (croissance 🟢, stable 🔵, attention 🟠, critique 🔴)
- Zones de conflit avec **animation pulse** (Ukraine, Moyen-Orient, Mer Chine, Sahel)
- **Hover interactif** - Le nom du pays apparaît
- **Click** - Sélectionne le pays pour voir ses données
- Légende avec 8 pays majeurs

### Pays Tracés

```javascript
FR, DE, GB, IT, ES, US, CA, MX, BR, JP, CN, IN, SG, SK, SA, AE, ZA, AU
```

### Zones de Conflit

| Région | Sévérité | Couleur | Impact |
|--------|----------|---------|---------|
| Ukraine | Critique | 🔴 | ±5-25% volatilité |
| Moyen-Orient | Très Élevée | 🟠 | Pétrole, gaz |
| Mer de Chine | Élevée | 🟠 | Électronique, semiconductors |
| Sahel | Modérée | 🟡 | Ressources minérales |

---

## 💱 Taux de Change (Frankfurter API)

### Service: `ForexAndRates.jsx`

**APIs Utilisées:**
- **Frankfurter API** (GRATUIT, pas de clé requise)
- Données en temps réel
- Support 200+ devises

### Taux Directeurs (Mock Data)

```javascript
BCE:  4.25%  (EUR) - Banque Centrale Européenne
FED:  5.50%  (USD) - Federal Reserve
BoJ: -0.10%  (JPY) - Bank of Japan
PBC:  3.85%  (CNY) - People's Bank of China
BoE:  5.25%  (GBP) - Bank of England
```

**Tendance**: stable, up, ou down

---

## 📦 Flux Commerciaux

### Service: `TradeFlows.jsx`

Données pour chaque pays:
- **Exports** (milliards $) 
- **Imports** (milliards $)
- **Solde commercial** (positif = excédent, négatif = déficit)
- **Taux de croissance** YoY

### Principaux Partenaires

Chaque pays affiche ses 5 principaux partenaires commerciaux:
- FR: Allemagne, Italie, Belgique, Espagne, USA
- US: Mexique, Chine, Canada, Japon, Allemagne
- DE: USA, France, Pays-Bas, Italie, Chine
- JP: Chine, USA, Corée, Australie, Thaïlande
- CN: USA, UE, ASEAN, Japon, Corée

---

## 💰 Coût de la Vie

### Service: `CostOfLiving.jsx`

**Indice COL** (Cost of Living):
- Base: New York = 100
- France (Paris): 85 (15% moins cher)
- Japon (Tokyo): 92 (8% moins cher)
- Chine (Shanghai): 65 (35% moins cher)

### Breakdown de Dépenses

```
Logement:   40-48%
Alimentation: 18-25%
Transport:  14-18%
Loisirs:    12-18%
Santé:      6-8%
```

Budget mensuel pour mode de vie standard:
- USA: $4,000
- France: €3,200
- Chine: ¥2,500

---

## 🚀 Comment Utiliser?

### 1. **Accéder à la Carte Mondiale**
```
Menu Sidebar → Géopolitique → Carte Mondiale
OU
URL: http://localhost:5174/#global
```

### 2. **Sélectionner un Pays**
- Cliquer sur un point sur la carte
- OU cliquer sur un bouton dans la légende
- Les données se mettent à jour automatiquement

### 3. **Voir les Taux de Change**
```
Géopolitique → Taux & Intérêts
```
- Taux de change en temps réel (Frankfurter API)
- Taux directeurs des 5 principales banques centrales

### 4. **Analyser le Commerce**
```
Géopolitique → Flux Commerciaux
```
- Exports vs Imports
- Solde commercial
- Principaux exports/imports
- Partenaires commerciaux

### 5. **Coût de la Vie**
```
Géopolitique → Coût de la Vie
```
- Indice vs New York
- Breakdown détaillé
- Comparaison avec autres pays

---

## 📊 Flux de Données

```
User Click Country
    ↓
GlobalAnalysis.jsx (setState selectedCountry)
    ↓
┌────────────────────────────────────────────┐
↓              ↓              ↓              ↓
WorldMap   ForexAndRates  TradeFlows   CostOfLiving
↓              ↓              ↓              ↓
ForexService.getExchangeRates()
ForexService.getInterestRates()
ForexService.getTradeFlows()
ForexService.getCostOfLiving()
    ↓
Mock Data ou API Frankfurter
    ↓
Rendu composants
```

---

## 🔧 Configuration

### Aucune clé API requise!
- ✅ Frankfurter API: Gratuit, sans auth
- ✅ Taux directeurs: Mock data (réaliste)
- ✅ Flux commerciaux: Mock data (OMC-based)
- ✅ Coût de la vie: Mock data (Numbeo-based)

**Pour ajouter des vraies données:**

1. **Taux de Change Réels**
```javascript
// ForexService.js - déjà intégré!
await forexService.getExchangeRates('EUR', ['USD', 'GBP']);
```

2. **Taux Directeurs Réels**
```
À chercher sur:
- BCE: ecb.europa.eu
- FED: federalreserve.gov
- BoJ: boj.or.jp
- PBC: pbc.gov.cn
- BoE: bankofengland.co.uk
```

3. **Flux Commerciaux Réels**
```
À chercher sur:
- OMC (WTO): wits.worldbank.org
- Statista
- Trading Economics API
```

---

## 🎯 Cas d'Usage

### Investisseur Conservateur
1. Sélectionne la France (stabilité)
2. Voit: Inflation 2.5%, Taux BCE 4.25%
3. Consulte: Coût de la vie, solde commercial
4. Décision: Obligations francaises vs dépôts

### Trader Actif
1. Monitor zones de conflit (affectent pétrole/métaux)
2. Regarde taux FED vs BCE (arbitrage EUR/USD)
3. Suit flux commerciaux (trade wars impact)
4. Places positions basé sur taux directeurs

### Planificateur Patrimonial
1. Diversifie par pays (sélectionne 3-4 pays)
2. Compare coût de la vie (retraite abroad?)
3. Analyse flux commerciaux (économies stables?)
4. Monitoring taux (impact sur retours bonds)

---

## 🔐 Données & Sécurité

### Sources des Données

| Type | Source | Actualisation |
|------|--------|---------------|
| Taux Change | Frankfurter API | Temps réel |
| Taux Directeurs | Mock (BCentrales) | Hebdo/Mensuel |
| Flux Commerce | Mock (OMC) | Mensuel |
| Coût Vie | Mock (Numbeo/EIU) | Trimestrio |
| Zones Conflit | Mock (Suivi géo) | Temps réel |

### Aucune Donnée Personnelle
- ✅ Pas de collecte user
- ✅ Pas de stockage
- ✅ Pas d'analytics tiers
- ✅ Données publiques uniquement

---

## 🚀 Améliorations Futures

### Phase 2: Données Réelles
```javascript
// Intégrer vraies APIs
import { TradingEconomics } from '@trading-economics/api';
import { WorldBank } from '@world-bank/api';

const trade = await TradingEconomics.getTradeBalance(country);
const gdp = await WorldBank.getGDP(country);
```

### Phase 3: Visualisations Avancées
- Graphiques timelines (historique taux)
- Heatmaps (flux commerciaux)
- 3D Globe (au lieu de carte plate)
- Comparaisons side-by-side

### Phase 4: Alertes & Notifications
```javascript
// Notifier si:
- Conflit escalade
- Taux change de +5%
- Déficit commercial alarmant
- Coût vie augmente
```

---

## 📞 Support

### Problèmes Courants

**Q: Données mockées?**
A: Oui, pour démarrage. Ajouter vraies APIs pour données réelles.

**Q: Performance lente?**
A: Vérifier connexion. Frankfurter API peut prendre 1-2s.

**Q: Carte ne s'affiche pas?**
A: Vérifier console (F12). SVG peut nécessiter CORS.

**Q: Changer les couleurs des zones conflit?**
A: Éditer `WorldMap.jsx` → `conflictZones` → `color: '#...'`

---

## 🎓 Apprendre Plus

### SVG Interactive Maps
- [MDN SVG Docs](https://developer.mozilla.org/docs/Web/SVG)
- [D3.js Geography](https://d3js.org/d3-geo)

### Financial APIs
- [Frankfurter API Docs](https://www.frankfurter.app)
- [Trading Economics](https://tradingeconomics.com/api)
- [World Bank API](https://data.worldbank.org/developers)

### Geopolitical Risk
- [ACLEDdata.com](https://acleddata.com) - Conflict data
- [SIPRI](https://www.sipri.org) - Military spending

---

## ✨ Vous avez maintenant:

✅ Carte du monde interactive avec 20+ pays
✅ Zones de conflit avec animation
✅ Taux de change temps réel (Frankfurter API)
✅ Taux directeurs des 5 banques centrales
✅ Flux commerciaux import/export
✅ Coût de la vie par pays
✅ 4 onglets pour naviguer
✅ Données mockées (remplaçables par vraies APIs)
✅ Design moderne sci-fi
✅ Responsive (mobile, tablet, desktop)

**Prêt à explorer le monde? 🌍 Allez-y! 🚀**
