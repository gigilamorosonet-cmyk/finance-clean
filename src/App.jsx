import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { Markets } from './components/Markets';
import './index.css';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const renderPage = () => {
    switch (currentPage) {
      case 'markets':
        return <Markets />;
      case 'dashboard':
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="particles-bg min-h-screen" style={{ backgroundColor: '#050510' }}>
      <Sidebar isOpen={sidebarOpen} onToggle={setSidebarOpen} />
      <main
        className="p-8 transition-all duration-300"
        style={{ marginLeft: sidebarOpen ? '260px' : '80px' }}
      >
        <div className="max-w-7xl mx-auto">
          {renderPage()}
        </div>
      </main>
    </div>
  );
}

export default App;
