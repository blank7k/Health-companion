import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

interface NavigationProps {
  items: NavItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ items, activeTab, onTabChange }) => {
  return (
    <nav className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col relative">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent"></div>
      <div className="p-4 relative z-10">
        <div className="space-y-2">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-500/20 to-blue-600/20 text-blue-300 shadow-lg shadow-blue-500/20 border border-blue-500/30 backdrop-blur-sm'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white hover:shadow-lg hover:shadow-blue-500/10'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-blue-400 drop-shadow-lg' : 'text-gray-500'}`} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
      
      {/* Status Panel */}
      <div className="mt-auto p-4 border-t border-gray-800 relative z-10">
        <div className="bg-gradient-to-r from-blue-500/10 to-blue-600/10 border border-blue-500/30 rounded-lg p-3 backdrop-blur-sm shadow-lg">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-blue-300">System Status</span>
          </div>
          <p className="text-xs text-white">All services operational</p>
          <p className="text-xs text-gray-400 mt-1">Last updated: 2 min ago</p>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;