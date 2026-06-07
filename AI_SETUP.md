# Guide Configuration IA & API - FinVue

## 🚀 Nouvelles Fonctionnalités IA

### 1. **Analyse de Marché IA** 🤖
- Analyses intelligentes de portefeuille
- Recommandations de trading
- Optimisation fiscale automatique
- **API**: Anthropic Claude

### 2. **Données de Marché Réelles** 📊
- Actions (Stocks)
- Crypto-monnaies
- Forex
- Taux économiques par pays
- **APIs**: Finnhub, Alpha Vantage, CoinGecko

### 3. **Calculateur d'Intérêt Composé** 💰
- Simulation de croissance
- Projections année par année
- Graphiques interactifs
- Sélection de fréquence (annuel, mensuel, quotidien)

### 4. **Carte Interactive des Zones de Conflit** 🌍
- Localisation des conflits géopolitiques
- Impact sur matières premières
- Analyse des prix
- Opportunités d'investissement

### 5. **Sélecteur de Pays** 🏙️
- Indicateurs économiques par pays
- Données localisées
- Marchés locaux prioritaires

---

## 🔑 Configuration des APIs

### A) **Anthropic API** (IA - Claude)

#### Pour quoi?
- Analyse intelligente des portefeuilles
- Générations de signaux de trading
- Analyse d'impact géopolitique
- Recommandations d'investissement

#### Obtenir votre clé:
1. Allez sur [console.anthropic.com](https://console.anthropic.com)
2. Créez un compte gratuit
3. Allez à **API Keys**
4. Créez une nouvelle clé
5. Copiez la clé (commence par `sk-ant-...`)

#### Configuration:
```bash
# Dans .env.local
VITE_ANTHROPIC_KEY=sk-ant-votre-clé-ici
```

#### Tarification:
- **Gratuit**: 5$ de credits de démarrage
- **Pay-as-you-go**: À partir de $0.25 pour 1M tokens d'entrée
- **Claude 3 Haiku**: Le plus abordable pour cette app

---

### B) **Finnhub API** (Données Marché - RECOMMANDÉ)

#### Pour quoi?
- Prix réels des actions
- Données Forex
- Cotations en temps réel
- Données historiques

#### Obtenir votre clé:
1. Allez sur [finnhub.io](https://finnhub.io)
2. Créez un compte gratuit
3. Allez à **Account → API**
4. Copiez votre **API Key**

#### Configuration:
```bash
# Dans .env.local
VITE_FINNHUB_KEY=votre-clé-finnhub
```

#### Avantages:
- ✅ Latence ultra-faible
- ✅ Taux gratuit: 60 requêtes/minute
- ✅ Meilleur pour les données temps réel

---

### C) **Alpha Vantage API** (Données Marché - Fallback)

#### Pour quoi?
- Prix historiques des actions
- Données économiques
- Moyennes mobiles
- Volatilité

#### Obtenir votre clé:
1. Allez sur [alphavantage.co](https://www.alphavantage.co)
2. Cliquez sur **GET FREE API KEY**
3. Entrez votre email
4. Recevez la clé par email

#### Configuration:
```bash
# Dans .env.local
VITE_ALPHA_VANTAGE_KEY=votre-clé-alpha-vantage
```

#### Limitations:
- Taux gratuit: 5 requêtes/minute
- Délai: 1 seconde entre requêtes
- Pour fallback si Finnhub indisponible

---

### D) **CoinGecko API** (Crypto - GRATUIT)

#### Pour quoi?
- Prix crypto réels
- Capitalisations boursières
- Volumes d'échange
- Pas de clé requise!

#### Configuration:
```bash
# Dans .env.local - OPTIONNEL
# API publique, pas de clé nécessaire
```

#### Avantages:
- 🆓 **Complètement gratuit**
- ✅ Aucune authentification
- ✅ Excellente couverture crypto

---

## 📝 Guide Complet d'Installation

### Étape 1: Créer .env.local

```bash
# Supabase (pour authentification)
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY

# Marché - Finnhub (RECOMMANDÉ)
VITE_FINNHUB_KEY=YOUR_FINNHUB_KEY

# Marché - Fallback
VITE_ALPHA_VANTAGE_KEY=YOUR_ALPHA_VANTAGE_KEY

# IA - Claude
VITE_ANTHROPIC_KEY=sk-ant-YOUR_KEY

# Crypto (gratuit, pas de clé)
VITE_COINGECKO_KEY=

# Feature Flags
VITE_ENABLE_REAL_DATA=true
VITE_ENABLE_AI_ANALYSIS=true
```

### Étape 2: Installation des dépendances

```bash
npm install
```

### Étape 3: Démarrer le serveur

```bash
npm run dev
```

### Étape 4: Accéder aux nouvelles fonctionnalités

1. Connectez-vous/inscrivez-vous
2. Menu **IA & Outils** dans la sidebar gauche
3. 4 onglets disponibles:
   - 📊 **Marché Réel** - Données actualisées
   - 🤖 **IA & Signaux** - Analyse intelligente
   - 💰 **Intérêts Composés** - Calculatrice
   - 🌍 **Conflits Géo** - Zones de risque

---

## 🎯 Utilisation

### Analyse de Marché IA

1. Accédez à **IA & Outils → IA & Signaux**
2. Cliquez sur **Générer**
3. Recevez:
   - Niveau de risque du portefeuille
   - Score de diversification
   - Recommandations personnalisées
   - Stratégies de fiscalité

### Données de Marché Réelles

1. Accédez à **IA & Outils → Marché Réel**
2. Sélectionnez votre pays
3. Voyez les indicateurs économiques:
   - PIB, croissance, inflation
   - Taux chômage, devise
   - Marchés principaux

### Intérêt Composé

1. **Entrez** le capital initial
2. **Définissez** le taux annuel
3. **Réglez** la durée
4. **Choisissez** la fréquence
5. **Voyez** projections année par année

### Carte des Conflits

1. Cliquez sur une zone rouge/orange/jaune
2. Voyez:
   - Matières premières affectées
   - Impact sur les prix
   - Opportunités d'investissement
   - Timeline et probabilité

---

## 📊 Coûts Mensuels Estimés

### Scénario Budget (Faible usage)
- Finnhub: **$0** (gratuit)
- Alpha Vantage: **$0** (gratuit)
- Anthropic: **$0-5** (5 analyses/jour)
- CoinGecko: **$0** (gratuit)
- **Total: $0-5/mois**

### Scénario Standard (Usage modéré)
- Finnhub: **$0** (gratuit)
- Anthropic: **$10-20** (50-100 analyses/jour)
- **Total: $10-20/mois**

### Scénario Pro (Usage intensif)
- Finnhub: **$200+** (API payante)
- Anthropic: **$50-100** (1000+ analyses/jour)
- **Total: $250-300/mois**

---

## 🔄 Fallback & Mode Démo

Si vous n'avez pas de clés API:

✅ L'app fonctionne toujours!
- Mode démo avec données mockées
- Interface complète accessible
- Calculateur d'intérêt composé 100% fonctionnel
- Carte interactive disponible

Quand vous ajoutez une clé API, les données en temps réel remplacent les données démo automatiquement.

---

## 🐛 Dépannage

### "Supabase not configured"
- Vérifiez VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY dans .env.local

### "API Error: 401"
- Vérifiez que votre clé API est correcte
- Vérifiez que la clé n'est pas expirée
- Vérifiez les permissions dans le dashboard API

### Données mockées au lieu de réelles
- Ajouter VITE_FINNHUB_KEY dans .env.local
- Redémarrer le serveur (`npm run dev`)
- Attendre 2-3 secondes pour le chargement

### L'IA ne génère pas d'analyses
- Ajouter VITE_ANTHROPIC_KEY
- Vérifier la clé commence par `sk-ant-`
- Vérifier les quotas sur console.anthropic.com

---

## 🚀 Prochaines Étapes

1. ✅ Configurer Anthropic Key
2. ✅ Configurer Finnhub Key
3. ✅ Tester analyses IA
4. ✅ Sélectionner votre pays
5. ✅ Utiliser calculateur composé
6. ⏳ Ajouter vos vraies positions
7. ⏳ Recevoir recommandations IA

---

## 📞 Support

- **Anthropic**: support@anthropic.com
- **Finnhub**: support@finnhub.io
- **Alpha Vantage**: Documentation complète en ligne
- **FinVue**: gigilamoroso.net@gmail.com

---

**Version**: 2.0.0 avec IA & APIs
**Mise à jour**: 2026-06-07
