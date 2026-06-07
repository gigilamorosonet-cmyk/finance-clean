# FinVue - Configuration et Fonctionnalités

## 🚀 Fonctionnalités Implémentées

### 1. **Sidebar Fixe 260px**
- Logo FinVue avec gradient cyan-doré
- Menu avec 5 éléments principaux (Home, Markets, Portfolio, Budget, News)
- **Sous-menus déroulants** pour chaque élément
- Animation smooth des chevrons au déploiement
- Bouton toggle pour réduire/agrandir (80px en mode réduit)
- Sticky header pour le logo et le toggle

### 2. **Design Futuriste**
- **Couleurs**:
  - Fond: #050510 (noir profond)
  - Accents Cyan: #06b6d4 (primaire)
  - Accents Doré: #f59e0b (secondaire)
  - Soutien: #22d3ee (cyan clair), #fbbf24 (doré clair)
- Effets glassmorphism sur les cartes
- Animations de particules et gradients
- Hologrammes flottants

### 3. **Système de Langue (i18n)**
- **Support**: Français (FR) et Anglais (EN)
- Bouton toggle en bas de la sidebar
- Persistance dans localStorage
- Traductions complètes pour:
  - Menu items
  - Auth (login/register)
  - Plans de tarification
  - Interface générale

### 4. **Navigation Mobile**
- **Bottom Navigation** visible uniquement en mobile (< 768px)
- 5 onglets: Home, Markets, Portfolio, Budget, News
- Padding automatique pour le corps (pb-24)
- Glass-effect avec backdrop blur
- Masqué automatiquement sur desktop

### 5. **Authentification Supabase**
- **Écran Auth Modal**:
  - Login et Register (toggle entre les deux)
  - Validation des emails
  - Confirmation de mot de passe pour l'inscription
  - Gestion des erreurs
  - Intégration Supabase complète

- **Fonctionnement**:
  - Affiche la Landing Page si non-authentifié
  - Modal Auth par-dessus la Landing
  - Redirection vers le Dashboard après login
  - Détection automatique de la session

### 6. **Page de Présentation (Landing)**
- **Hero Section**:
  - Hologrammes flottants animés
  - Particules dynamiques
  - Logo animé avec gradient
  - CTA buttons (Commencer gratuitement, Voir la démo)

- **Statistiques**:
  - 500K+ Utilisateurs Actifs
  - 50B€ Actifs Gérés
  - 99.9% Disponibilité
  - 24/7 Support Premium

- **Features Section** (6 cartes):
  - Analytics Avancée
  - Tendances Marché
  - Couverture Mondiale
  - Mobile Optimisé
  - Sécurité Top Niveau
  - Performance Extrême

- **Plans de Tarification**:
  - Découverte (Gratuit)
  - Starter (4.99€/mois)
  - Pro (14.99€/mois) - Highlighted
  - Élite (29.99€/mois)

### 7. **Plans/Forfaits**
- Page dédiée avec 4 tiers
- Listes de fonctionnalités avec checkmarks
- Boutons "S'abonner" stylisés
- Responsive design (1 col mobile, 2 cols tablet, 4 cols desktop)
- Hover effects avec elevation et glow

## 🛠️ Installation et Configuration

### 1. Installer les dépendances
```bash
npm install
```

### 2. Configurer Supabase

#### a) Créer un projet Supabase
1. Aller sur [supabase.com](https://supabase.com)
2. Créer un nouveau projet
3. Attendre l'initialisation

#### b) Récupérer les clés
1. Aller dans Project Settings → API
2. Copier:
   - `Project URL` → `VITE_SUPABASE_URL`
   - `anon public key` → `VITE_SUPABASE_ANON_KEY`

#### c) Configurer les variables d'environnement
Créer un fichier `.env.local`:
```bash
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY
```

### 3. Démarrer le serveur de développement
```bash
npm run dev
```

Accédez à `http://localhost:5174`

## 📱 Structure des Composants

```
src/
├── components/
│   ├── Landing.jsx          # Page de présentation
│   ├── Landing.css          # Styles Landing
│   ├── Sidebar.jsx          # Navigation sidebar
│   ├── BottomNav.jsx        # Navigation mobile
│   ├── Auth.jsx             # Modal authentification
│   ├── PricingPlans.jsx     # Page forfaits
│   ├── Dashboard.jsx        # Tableau de bord principal
│   ├── Markets.jsx          # Page marchés
│   └── ...
├── config/
│   ├── supabase.js          # Configuration Supabase
│   └── i18n.js              # Configuration i18next
├── App.jsx                  # Composant principal
└── main.jsx                 # Point d'entrée
```

## 🎨 Thème & Couleurs

| Couleur | Hex | Utilisation |
|---------|-----|-------------|
| Fond | #050510 | Background principal |
| Cyan Primaire | #06b6d4 | Boutons, accents |
| Cyan Clair | #22d3ee | Highlights |
| Doré | #f59e0b | Accents secondaires |
| Doré Clair | #fbbf24 | Highlights |
| Card | #0d0d1a | Containers |
| Border | #1a2332 | Bordures |

## 🚀 Points d'Entrée de l'App

1. **Non-Authentifié**: Affiche Landing Page + Auth Modal
2. **Authentifié**: Affiche Dashboard avec Sidebar + BottomNav
3. **Mobile**: Bottom Navigation remplace la Sidebar
4. **Desktop**: Sidebar + Contenu principal

## 🔧 Développement

### Pour ajouter une nouvelle langue:
Éditer `src/config/i18n.js`:
```javascript
const resources = {
  en: { translation: { ... } },
  fr: { translation: { ... } },
  es: { translation: { ... } }  // Nouvelle langue
};
```

### Pour ajouter une nouvelle route/page:
1. Créer le composant dans `src/components/`
2. Ajouter l'import dans `App.jsx`
3. Ajouter la case dans `renderPage()`
4. Ajouter l'élément au menu dans `Sidebar.jsx`

## 📝 Notes Importantes

- **Supabase optionnel**: L'app fonctionne sans Supabase (affiche un message)
- **i18n initialisé**: Utilise `I18nextProvider` dans `main.jsx`
- **Responsive**: Design mobile-first avec breakpoints Tailwind
- **Animations**: Smooth transitions sur tous les éléments interactifs

## 🔐 Sécurité

- Clés Supabase dans `.env.local` (jamais commitées)
- Pas de données sensibles en localStorage
- Validation des inputs dans les modales
- Session management via Supabase

## 📊 Performance

- Lazy loading des composants
- Images optimisées
- CSS animations GPU-accelerated
- Vite pour le bundling rapide

---

**Version**: 1.0.0
**Développé avec**: React 19, Vite, Tailwind CSS, Supabase, i18next
