import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // Menu
      home: 'Home',
      markets: 'Markets',
      portfolio: 'Portfolio',
      budget: 'Budget',
      news: 'News',
      settings: 'Settings',

      // Auth
      login: 'Login',
      register: 'Register',
      logout: 'Logout',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      forgotPassword: 'Forgot Password?',
      noAccount: 'Don\'t have an account?',
      haveAccount: 'Already have an account?',

      // Plans
      plans: 'Plans',
      discovery: 'Discovery',
      starter: 'Starter',
      pro: 'Pro',
      elite: 'Elite',
      perMonth: 'per month',
      subscribe: 'Subscribe',
      features: 'Features',

      // Common
      version: 'v1.0.0',
      language: 'Language',
      profile: 'Profile',
      dashboard: 'Dashboard',
    }
  },
  fr: {
    translation: {
      // Menu
      home: 'Accueil',
      markets: 'Marchés',
      portfolio: 'Portefeuille',
      budget: 'Budget',
      news: 'Actualités',
      settings: 'Paramètres',

      // Auth
      login: 'Connexion',
      register: 'Inscription',
      logout: 'Déconnexion',
      email: 'Email',
      password: 'Mot de passe',
      confirmPassword: 'Confirmez le mot de passe',
      forgotPassword: 'Mot de passe oublié?',
      noAccount: 'Pas encore de compte?',
      haveAccount: 'Vous avez déjà un compte?',

      // Plans
      plans: 'Forfaits',
      discovery: 'Découverte',
      starter: 'Starter',
      pro: 'Pro',
      elite: 'Élite',
      perMonth: 'par mois',
      subscribe: 'S\'abonner',
      features: 'Fonctionnalités',

      // Common
      version: 'v1.0.0',
      language: 'Langue',
      profile: 'Profil',
      dashboard: 'Tableau de bord',
    }
  }
};

if (!i18n.isInitialized) {
  i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: localStorage.getItem('language') || 'fr',
      interpolation: {
        escapeValue: false
      }
    });
}

export default i18n;
