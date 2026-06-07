import { useState } from 'react';
import { Menu, Home, TrendingUp, BarChart3, DollarSign, Newspaper, ChevronDown, Settings, Globe, Brain, Map, Zap, Wallet } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

export function Sidebar({ isOpen = true, onToggle }) {
  const { t, i18n } = useTranslation();
  const [expandedMenu, setExpandedMenu] = useState(null);

  const menuItems = [
    {
      id: 'home',
      label: t('home'),
      icon: Home,
      href: '#',
      submenu: [
        { label: 'Dashboard', href: '#dashboard' },
        { label: 'Analytics', href: '#analytics' }
      ]
    },
    {
      id: 'markets',
      label: t('markets'),
      icon: TrendingUp,
      href: '#markets',
      submenu: [
        { label: 'Stocks', href: '#stocks' },
        { label: 'Crypto', href: '#crypto' },
        { label: 'Forex', href: '#forex' }
      ]
    },
    {
      id: 'portfolio',
      label: t('portfolio'),
      icon: BarChart3,
      href: '#portfolio',
      submenu: [
        { label: 'Assets', href: '#assets' },
        { label: 'Performance', href: '#performance' }
      ]
    },
    {
      id: 'budget',
      label: t('budget'),
      icon: DollarSign,
      href: '#budget',
      submenu: [
        { label: 'Income', href: '#income' },
        { label: 'Expenses', href: '#expenses' }
      ]
    },
    {
      id: 'news',
      label: t('news'),
      icon: Newspaper,
      href: '#news',
      submenu: [
        { label: 'Market News', href: '#market-news' },
        { label: 'Alerts', href: '#alerts' }
      ]
    },
    {
      id: 'advanced',
      label: 'IA & Outils',
      icon: Brain,
      href: '#advanced',
      submenu: [
        { label: 'Analyse IA', href: '#analysis' },
        { label: 'Données Réelles', href: '#market-data' },
        { label: 'Intérêts Composés', href: '#compound' },
        { label: 'Zones de Conflit', href: '#conflicts' }
      ]
    },
    {
      id: 'global',
      label: 'Géopolitique',
      icon: Map,
      href: '#global',
      submenu: [
        { label: 'Carte Mondiale', href: '#map' },
        { label: 'Taux & Intérêts', href: '#forex' },
        { label: 'Flux Commerciaux', href: '#trade' },
        { label: 'Coût de la Vie', href: '#living' }
      ]
    },
    {
      id: 'advanced-global',
      label: 'Vue Avancée',
      icon: Zap,
      href: '#advanced-global',
      submenu: [
        { label: 'Globe 3D', href: '#globe3d' },
        { label: 'Graphiques & ML', href: '#charts' },
        { label: 'Analyse Technique', href: '#analysis' },
        { label: 'Alertes Temps Réel', href: '#alerts' }
      ]
    },
    {
      id: 'investment',
      label: 'Investment',
      icon: Wallet,
      href: '#investment',
      submenu: [
        { label: '🐋 Whales Tracker', href: '#whales' },
        { label: '👔 Insiders', href: '#insiders' },
        { label: '🏦 Major Funds', href: '#funds' },
        { label: '🚀 Mega Deals', href: '#deals' }
      ]
    },
  ];

  const toggleLanguage = () => {
    const newLang = i18n.language === 'fr' ? 'en' : 'fr';
    i18n.changeLanguage(newLang);
    localStorage.setItem('language', newLang);
  };

  return (
    <div
      className="fixed left-0 top-0 h-screen bg-sidebar border-r border-border transition-all duration-300 z-50 overflow-y-auto"
      style={{ width: isOpen ? '260px' : '80px' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border sticky top-0 bg-sidebar">
        <div className="flex items-center gap-2">
          {isOpen && <h1 className="text-lg font-bold text-gradient-cyan">FinVue</h1>}
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-1 to-gold-1 flex items-center justify-center text-background font-bold text-sm">
            F
          </div>
        </div>
        <button
          onClick={() => onToggle && onToggle(!isOpen)}
          className="p-2 hover:bg-card rounded-lg transition-colors icon-glow"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Menu Items */}
      <nav className="mt-8 space-y-1 px-3">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isExpanded = expandedMenu === item.id;
          return (
            <div key={item.id}>
              <button
                onClick={() => setExpandedMenu(isExpanded ? null : item.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all',
                  'hover:bg-card text-muted-foreground hover:text-foreground',
                  'hover:border-l-2 hover:border-cyan-1'
                )}
              >
                <Icon size={20} className="flex-shrink-0" />
                {isOpen && (
                  <>
                    <span className="text-sm flex-1 text-left">{item.label}</span>
                    <ChevronDown
                      size={16}
                      className={cn(
                        'transition-transform',
                        isExpanded && 'rotate-180'
                      )}
                    />
                  </>
                )}
              </button>

              {/* Submenu */}
              {isOpen && isExpanded && item.submenu && (
                <div className="mt-1 ml-2 space-y-1 border-l border-border">
                  {item.submenu.map((subitem, idx) => (
                    <a
                      key={idx}
                      href={subitem.href}
                      className="flex items-center gap-3 px-3 py-2 text-xs text-muted-foreground hover:text-foreground hover:bg-card rounded-lg transition-all"
                    >
                      <div className="w-2 h-2 rounded-full bg-cyan-1"></div>
                      {subitem.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-3 space-y-2 border-t border-border bg-sidebar">
        {/* Language Toggle */}
        <button
          onClick={toggleLanguage}
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all',
            'hover:bg-card text-muted-foreground hover:text-foreground'
          )}
        >
          <Globe size={20} className="flex-shrink-0" />
          {isOpen && <span className="text-sm">{i18n.language === 'fr' ? 'EN' : 'FR'}</span>}
        </button>

        {/* Footer Info */}
        {isOpen && (
          <div className="p-3 glass-effect rounded-lg">
            <p className="text-xs text-muted-foreground">FinVue Pro</p>
            <p className="text-xs font-semibold text-cyan-1">{t('version')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
