import { useState } from 'react';
import RoutesTab from './tabs/RoutesTab';
import CompareTab from './tabs/CompareTab';
import BankingTab from './tabs/BankingTab';
import PoolingTab from './tabs/PoolingTab';

type Tab = 'routes' | 'compare' | 'banking' | 'pooling';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('routes');

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'routes', label: 'Routes', icon: '🚢' },
    { id: 'compare', label: 'Compare', icon: '📊' },
    { id: 'banking', label: 'Banking', icon: '💰' },
    { id: 'pooling', label: 'Pooling', icon: '🤝' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg shadow-lg border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-2 rounded-lg shadow-md">
                <span className="text-2xl">⚓</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  FuelEU Maritime
                </h1>
                <p className="text-sm text-gray-500 font-medium">Compliance Platform</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-2 px-4 py-2 bg-green-50 rounded-lg border border-green-200">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-green-700">System Operational</span>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="bg-white/60 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 overflow-hidden">
          <nav className="flex space-x-1 p-1 bg-gray-50/50">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium text-sm transition-all duration-200
                  ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md transform scale-105'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }
                `}
              >
                <span className="text-lg">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="py-6">
          {activeTab === 'routes' && <RoutesTab />}
          {activeTab === 'compare' && <CompareTab />}
          {activeTab === 'banking' && <BankingTab />}
          {activeTab === 'pooling' && <PoolingTab />}
        </div>
      </div>
    </div>
  );
}

