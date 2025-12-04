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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-2xl bg-slate-950/80 border-b border-slate-700/50 shadow-2xl">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-tr from-blue-600 to-cyan-400 p-3 rounded-2xl shadow-lg shadow-blue-500/30">
              <span className="text-2xl">⚓</span>
            </div>

            <div>
              <h1 className="text-3xl font-black bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent">
                FuelEU Maritime
              </h1>
              <p className="text-sm text-slate-400 font-medium">Compliance Platform Dashboard</p>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-3 px-5 py-3 bg-gradient-to-r from-emerald-900/40 to-emerald-800/40 border border-emerald-600/50 rounded-xl shadow-lg backdrop-blur">
            <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-semibold text-emerald-300">System Operational</span>
          </div>
        </div>
      </header>

      {/* Tabs Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 shadow-2xl rounded-3xl p-6">
          <nav className="flex bg-slate-900/50 rounded-2xl p-2 space-x-2">
            {tabs.map((tab) => {
              const active = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-xl transition-all duration-300 text-sm font-bold
                    ${active
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/50 scale-105'
                      : 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-200'
                    }
                  `}
                >
                  <span className="text-lg">{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="py-8 animate-fadeIn">
          {activeTab === 'routes' && <RoutesTab />}
          {activeTab === 'compare' && <CompareTab />}
          {activeTab === 'banking' && <BankingTab />}
          {activeTab === 'pooling' && <PoolingTab />}
        </div>
      </div>
    </div>
  );
}
