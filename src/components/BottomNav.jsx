import { Home, TrendingUp, BarChart3, DollarSign, Newspaper } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import './BottomNav.css';

export function BottomNav() {
  const { t } = useTranslation();

  const items = [
    { icon: Home, label: t('home'), href: '#' },
    { icon: TrendingUp, label: t('markets'), href: '#markets' },
    { icon: BarChart3, label: t('portfolio'), href: '#portfolio' },
    { icon: DollarSign, label: t('budget'), href: '#budget' },
    { icon: Newspaper, label: t('news'), href: '#news' },
  ];

  return (
    <nav className="bottom-nav fixed bottom-0 left-0 right-0 glass-effect border-t border-border z-40 md:hidden">
      <div className="flex items-center justify-around h-16">
        {items.map((item, idx) => {
          const Icon = item.icon;
          return (
            <a
              key={idx}
              href={item.href}
              className="flex flex-col items-center justify-center gap-1 px-3 py-2 text-muted-foreground hover:text-cyan-1 transition-colors"
            >
              <Icon size={24} />
              <span className="text-xs">{item.label}</span>
            </a>
          );
        })}
      </div>
    </nav>
  );
}
