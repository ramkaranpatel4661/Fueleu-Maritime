import { useState } from 'react';
import RoutesTab from './tabs/RoutesTab';
import CompareTab from './tabs/CompareTab';
import BankingTab from './tabs/BankingTab';
import PoolingTab from './tabs/PoolingTab';

type Tab = 'routes' | 'compare' | 'banking' | 'pooling';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('routes');

  const tabs: { id: Tab; label: string }[] = [
    { id: 'routes', label: 'Routes' },
    { id: 'compare', label: 'Compare' },
    { id: 'banking', label: 'Banking' },
    { id: 'pooling', label: 'Pooling' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">
            FuelEU Maritime Compliance Platform
          </h1>
        </div>
      </header>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  py-4 px-1 border-b-2 font-medium text-sm
                  ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                {tab.label}
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

