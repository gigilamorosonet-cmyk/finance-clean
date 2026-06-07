import { createContext, useContext, useState } from 'react';

const TabsContext = createContext();

export function Tabs({ children, value, onValueChange, className = '' }) {
  const [activeTab, setActiveTab] = useState(value || '');

  const handleTabChange = (tabValue) => {
    setActiveTab(tabValue);
    onValueChange?.(tabValue);
  };

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab: handleTabChange }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({ children, className = '' }) {
  return (
    <div
      className={`flex border-b border-border/30 gap-0 overflow-x-auto ${className}`}
      role="tablist"
    >
      {children}
    </div>
  );
}

export function TabsTrigger({ children, value, className = '' }) {
  const { activeTab, setActiveTab } = useContext(TabsContext);
  const isActive = activeTab === value;

  return (
    <button
      onClick={() => setActiveTab(value)}
      className={`
        px-4 py-3 font-medium text-sm whitespace-nowrap transition-all
        border-b-2 border-transparent
        ${
          isActive
            ? 'text-cyan-1 border-b-2 border-cyan-1'
            : 'text-muted-foreground hover:text-foreground hover:border-b-2 hover:border-cyan-1/50'
        }
        ${className}
      `}
      role="tab"
      aria-selected={isActive}
    >
      {children}
    </button>
  );
}

export function TabsContent({ children, value, className = '' }) {
  const { activeTab } = useContext(TabsContext);

  if (activeTab !== value) {
    return null;
  }

  return (
    <div className={`mt-4 animate-in ${className}`} role="tabpanel">
      {children}
    </div>
  );
}
