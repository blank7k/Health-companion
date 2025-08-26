import React, { useState } from 'react';
import { MessageSquare, Users, Activity, FileText, Search, Settings, Bell } from 'lucide-react';
import ChatInterface from './components/ChatInterface';
import PatientDashboard from './components/PatientDashboard';
import Navigation from './components/Navigation';

function App() {
  const [activeTab, setActiveTab] = useState<'chat' | 'patients' | 'analytics'>('chat');

  const navItems = [
    { id: 'chat', label: 'AI Assistant', icon: MessageSquare },
    { id: 'patients', label: 'Patient Data', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: Activity },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Activity className="w-8 h-8 text-blue-600" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <h1 className="text-2xl font-bold text-slate-800">DischargeAI</h1>
              </div>
              <span className="text-sm text-slate-500 bg-gradient-to-r from-blue-50 to-green-50 px-3 py-1 rounded-full border border-blue-200">
                Hospital Discharge Assistant
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-1 text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>6 Active Patients</span>
                </div>
                <div className="flex items-center space-x-1 text-blue-600">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>2 Ready for Discharge</span>
                </div>
              </div>
              <div className="relative">
                <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search patients..."
                  className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              <button className="relative p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
              </button>
              <button className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Navigation Sidebar */}
        <Navigation 
          items={navItems} 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
        />

        {/* Main Content */}
        <main className="flex-1 overflow-hidden">
          {activeTab === 'chat' && <ChatInterface />}
          {activeTab === 'patients' && <PatientDashboard />}
          {activeTab === 'analytics' && (
            <div className="p-6 h-full flex items-center justify-center">
              <div className="text-center">
                <Activity className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-600 mb-2">Analytics Dashboard</h3>
                <p className="text-slate-500">Advanced discharge analytics and insights coming soon</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;