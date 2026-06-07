import { Menu, Home, TrendingUp, BarChart3, DollarSign, Newspaper } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Sidebar({ isOpen = true, onToggle }) {

  const menuItems = [
    { id: 'home', label: 'Home', icon: Home, href: '#' },
    { id: 'markets', label: 'Markets', icon: TrendingUp, href: '#markets' },
    { id: 'portfolio', label: 'Portfolio', icon: BarChart3, href: '#portfolio' },
    { id: 'budget', label: 'Budget', icon: DollarSign, href: '#budget' },
    { id: 'news', label: 'News', icon: Newspaper, href: '#news' },
  ];

  return (
    <div
      className="fixed left-0 top-0 h-screen bg-sidebar border-r border-border transition-all duration-300 z-50"
      style={{ width: isOpen ? '260px' : '80px' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        {isOpen && <h1 className="text-xl font-bold text-gradient-cyan">FinVue</h1>}
        <button
          onClick={() => onToggle && onToggle(!isOpen)}
          className="p-2 hover:bg-card rounded-lg transition-colors icon-glow"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Menu Items */}
      <nav className="mt-8 space-y-2 px-3">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <a
              key={item.id}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg transition-all',
                'hover:bg-card text-muted-foreground hover:text-foreground',
                'hover:border-l-2 hover:border-cyan-1'
              )}
            >
              <Icon size={20} className="flex-shrink-0" />
              {isOpen && <span className="text-sm">{item.label}</span>}
            </a>
          );
        })}
      </nav>

      {/* Footer */}
      {isOpen && (
        <div className="absolute bottom-4 left-4 right-4 p-4 glass-effect rounded-lg">
          <p className="text-xs text-muted-foreground">FinVue Pro</p>
          <p className="text-xs font-semibold text-cyan-1">v1.0.0</p>
        </div>
      )}
    </div>
  );
}
