import { useState } from 'react';
import { Zap, BarChart3, TrendingUp, Globe, Smartphone, Lock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import './Landing.css';

export function Landing() {
  const { t } = useTranslation();
  const [hoveredCard, setHoveredCard] = useState(null);

  const features = [
    {
      icon: <BarChart3 size={32} />,
      title: 'Analytics Avancée',
      description: 'Suivez vos investissements en temps réel avec des graphiques interactifs'
    },
    {
      icon: <TrendingUp size={32} />,
      title: 'Tendances Marché',
      description: 'Prédictions IA et alertes automatiques sur les opportunités'
    },
    {
      icon: <Globe size={32} />,
      title: 'Couverture Mondiale',
      description: 'Accès aux marchés mondiaux: stocks, crypto, forex et commodités'
    },
    {
      icon: <Smartphone size={32} />,
      title: 'Mobile Optimisé',
      description: 'Gérez vos portefeuilles où que vous soyez avec notre app native'
    },
    {
      icon: <Lock size={32} />,
      title: 'Sécurité Top Niveau',
      description: 'Chiffrement de bout en bout et conformité bancaire'
    },
    {
      icon: <Zap size={32} />,
      title: 'Performance Extrême',
      description: 'Latence ultra-faible pour le trading haute fréquence'
    }
  ];

  const stats = [
    { number: '500K+', label: 'Utilisateurs Actifs' },
    { number: '50B€', label: 'Actifs Gérés' },
    { number: '99.9%', label: 'Disponibilité' },
    { number: '24/7', label: 'Support Premium' }
  ];

  return (
    <div className="landing min-h-screen bg-background">
      {/* Hero Section */}
      <section className="hero-section relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <div className="landing-bg"></div>

        {/* Animated Hologram Elements */}
        <div className="hologram hologram-1"></div>
        <div className="hologram hologram-2"></div>
        <div className="hologram hologram-3"></div>
        <div className="hologram hologram-4"></div>

        {/* Floating Particles */}
        <div className="particles">
          {[...Array(50)].map((_, i) => (
            <div key={i} className={`particle particle-${i % 5}`}></div>
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <div className="animated-logo mb-8">
            <div className="logo-box">F</div>
          </div>

          <h1 className="text-6xl md:text-7xl font-bold mb-6 text-gradient-cyan animate-fade-in">
            FinVue
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground mb-4 animate-fade-in-delay">
            La plateforme d'investissement du futur
          </p>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-12 animate-fade-in-delay-2">
            Gérez vos investissements avec des outils alimentés par l'IA.
            Prédictions précises, analyses en temps réel, sécurité bancaire.
          </p>

          <div className="flex flex-col md:flex-row gap-4 justify-center mb-20 animate-fade-in-delay-3">
            <button className="px-8 py-4 bg-gradient-to-r from-cyan-1 to-cyan-2 text-background rounded-lg font-bold text-lg hover:shadow-lg hover:shadow-cyan-1/50 transition-all duration-300 transform hover:scale-105">
              Commencer Gratuitement
            </button>
            <button className="px-8 py-4 border-2 border-cyan-1 text-cyan-1 rounded-lg font-bold text-lg hover:bg-cyan-1/10 transition-all duration-300">
              Voir la Démo
            </button>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-b border-border py-12 animate-fade-in-delay-4">
            {stats.map((stat, idx) => (
              <div key={idx} className="stat-card">
                <div className="text-3xl font-bold text-gradient-cyan">{stat.number}</div>
                <div className="text-sm text-muted-foreground mt-2">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="text-cyan-1">⬇</div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section py-20 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl font-bold text-center mb-4 text-gradient-cyan">
            Fonctionnalités Révolutionnaires
          </h2>
          <p className="text-center text-muted-foreground mb-16 max-w-2xl mx-auto">
            Tous les outils que vous avez besoin pour maîtriser vos investissements
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="feature-card glass-effect rounded-lg p-8 border border-border hover:border-cyan-1 transition-all duration-300 cursor-pointer transform hover:-translate-y-2"
                onMouseEnter={() => setHoveredCard(idx)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className={`mb-6 text-cyan-1 transition-all duration-300 ${hoveredCard === idx ? 'scale-125 rotate-12' : ''}`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="pricing-section py-20 px-4 bg-card/30">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl font-bold text-center mb-16 text-gradient-cyan">
            Plans Flexibles & Accessibles
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Découverte', price: 'Gratuit', color: 'from-cyan-1/20 to-cyan-2/20' },
              { name: 'Starter', price: '4.99€', color: 'from-cyan-1/40 to-cyan-2/40' },
              { name: 'Pro', price: '14.99€', color: 'from-gold-1/30 to-gold-2/30', highlight: true },
              { name: 'Élite', price: '29.99€', color: 'from-gold-1/50 to-gold-2/50' }
            ].map((plan, idx) => (
              <div
                key={idx}
                className={`pricing-card glass-effect rounded-lg p-6 border-2 transition-all duration-300 ${
                  plan.highlight
                    ? 'border-gold-1 shadow-lg shadow-gold-1/30 scale-105'
                    : 'border-border hover:border-cyan-1'
                }`}
              >
                <h3 className="text-2xl font-bold text-gradient-cyan mb-2">{plan.name}</h3>
                <div className="text-3xl font-bold text-foreground mb-4">
                  {plan.price}
                  {plan.price !== 'Gratuit' && <span className="text-sm text-muted-foreground">/mois</span>}
                </div>
                <button className={`w-full py-2 rounded-lg font-bold transition-all duration-300 ${
                  plan.highlight
                    ? 'bg-gradient-to-r from-gold-1 to-gold-2 text-background hover:shadow-lg'
                    : 'bg-cyan-1 text-background hover:bg-cyan-2'
                }`}>
                  S'abonner
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section py-20 px-4 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center z-10 relative">
          <h2 className="text-5xl font-bold mb-6 text-gradient-cyan">
            Prêt à Investir Intelligemment?
          </h2>
          <p className="text-xl text-muted-foreground mb-10">
            Rejoignez des milliers d'investisseurs qui transforment leur portefeuille avec FinVue
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <button className="px-10 py-4 bg-cyan-1 text-background rounded-lg font-bold text-lg hover:shadow-lg hover:shadow-cyan-1/50 transition-all transform hover:scale-105">
              Créer un Compte Gratuitement
            </button>
            <button className="px-10 py-4 border-2 border-gold-1 text-gold-1 rounded-lg font-bold text-lg hover:bg-gold-1/10 transition-all">
              Contacter le Support
            </button>
          </div>
        </div>

        {/* Background Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-1/5 rounded-full blur-3xl -z-0"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold-1/5 rounded-full blur-3xl -z-0"></div>
      </section>
    </div>
  );
}
