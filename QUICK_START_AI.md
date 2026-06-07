# ⚡ Démarrage Rapide - FinVue IA 2.0

## 🚀 En 5 Minutes

### 1. Installer les dépendances
```bash
npm install
```

### 2. Créer .env.local
```bash
cp .env.example .env.local
```

### 3. Ajouter VOS clés API (optionnel)
```env
# Dans .env.local

# A) Claude IA (Recommandé)
VITE_ANTHROPIC_KEY=sk-ant-votre-clé

# B) Données Marché (une des deux)
VITE_FINNHUB_KEY=votre-clé
# OU
VITE_ALPHA_VANTAGE_KEY=votre-clé
```

### 4. Démarrer
```bash
npm run dev
```

### 5. Accéder aux nouvelles features
- Menu Sidebar → **IA & Outils**
- 4 onglets: Marché, IA, Intérêts, Conflits

---

## 📋 Checklist Rapide

- [ ] `npm install` ✅
- [ ] Créé `.env.local` ✅
- [ ] Ajouté clés API (optionnel) ✅
- [ ] `npm run dev` ✅
- [ ] Accédé à **IA & Outils** ✅

---

## 🔑 Obtenir les Clés API (5 min par clé)

### Claude IA (7€ gratuits)
1. [console.anthropic.com](https://console.anthropic.com)
2. Sign Up → Verify Email
3. API Keys → Create Key
4. Copier clé

### Finnhub (Gratuit, 60 req/min)
1. [finnhub.io](https://finnhub.io)
2. Sign Up
3. Account → API
4. Copier API Key

### Alpha Vantage (Gratuit, 5 req/min)
1. [alphavantage.co](https://www.alphavantage.co)
2. GET FREE API KEY
3. Email reçoit clé

---

## 🎯 Tester les Fonctionnalités

### ✅ Sans clés API
- Calculateur intérêts composés → Marche 100%
- Carte zones conflit → Marche 100%
- Données mockées → Réalistes

### ✅ Avec clés API
- Données réelles temps réel → Marche 100%
- Analyses IA Claude → Marche 100%
- Indicateurs pays → Marche 100%

---

## 📊 Exemples Rapides

### 💰 Calculer 20 ans d'épargne
```
Capital: 10,000€
Taux: 7% annuel
Fréquence: Mensuel
Durée: 20 ans
Résultat: 49,372€ ✅
```

### 🤖 Avoir une analyse IA
```
Menu → IA & Outils → IA & Signaux
Cliquer "Générer"
Attendre 5-10 secondes
Recevoir: Risque, Diversification, Recommandations
```

### 🌍 Voir impact conflits
```
Menu → IA & Outils → Conflits Géo
Cliquer sur région (Moyen-Orient, Ukraine, etc.)
Voir: Matières premières affectées
Voir: Impact prix estimé
Voir: Opportunités invest
```

---

## 🛠️ Architecture Simple

```
FinVue Dashboard
├── Sidebar Menu
│   └── IA & Outils (NOUVEAU!)
│       ├── Données Marché (API Finnhub)
│       ├── Analyse IA (API Claude)
│       ├── Calculateur (Formule math)
│       └── Carte Conflit (Base interne)
├── Services
│   ├── marketDataService.js (Finnhub, Alpha V, CoinGecko)
│   └── aiService.js (Claude API)
└── Composants
    ├── CompoundInterestCalculator
    ├── ConflictMap
    ├── CountrySelector
    └── AdvancedAnalysis
```

---

## 📱 Responsive
- ✅ Desktop: Full layout
- ✅ Tablet: Optimisé
- ✅ Mobile: Bottom nav

---

## 🔒 Sécurité
- Clés jamais exposées (stockées localement)
- Fallback mode démo si API fail
- Validation entrées utilisateur

---

## ❓ FAQ Rapide

**Q: J'ai pas de clés API?**
→ Tout fonctionne en démo! Données mockées réalistes.

**Q: Quelle clé est obligatoire?**
→ AUCUNE! Toutes optionnelles. Mode démo par défaut.

**Q: Peux-je tester sans redémarrer?**
→ Oui, ajouter clé à `.env.local` et recharger la page.

**Q: Quel est le coût?**
→ $0-5/mois (2-3 analyses IA/jour)

**Q: Les données sont réelles?**
→ Oui si clés API. Sinon mockées réalistes.

---

## 🎬 Prochain Pas

1. ✅ Tester sans clés → Mode démo
2. 🔑 Ajouter clés API → Mode réel
3. 📊 Charger vos positions → Analyses personnalisées
4. 🤖 Recevoir recommandations → Investir intelligemment

---

**Besoin d'aide?**
- Lire `AI_SETUP.md` pour détails complets
- Lire `NOUVELLES_FEATURES.md` pour toutes les features

---

## 📈 Voilà!

Vous avez maintenant:
- ✅ Dashboard complet
- ✅ Authentification Supabase
- ✅ Données de marché réelles (optionnel)
- ✅ Analyses IA Claude (optionnel)
- ✅ Calculateur financier
- ✅ Carte géopolitique
- ✅ Support multi-pays
- ✅ Mode démo/production

**Prêt? Allez-y! 🚀**

```bash
npm run dev
# → http://localhost:5174
# → Menu IA & Outils
```
