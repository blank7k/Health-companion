import React, { useState } from 'react';
import { MessageSquare, Users, Activity, FileText, Search, Settings, Bell, User, Shield, LogOut } from 'lucide-react';
import { AuthProvider, useAuth, useIsAuthenticated } from './contexts/AuthContext';
import ChatInterface from './components/ChatInterface';
import PatientDashboard from './components/PatientDashboard';
import DischargeManagement from './components/DischargeManagement';
import Navigation from './components/Navigation';

// Loading component
const LoadingScreen: React.FC = () => (
  <div className="min-h-screen bg-black text-white flex items-center justify-center">
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-4"></div>
      <p className="text-gray-300">Loading Health Companion...</p>
    </div>
  </div>
);

// Login component (Demo implementation)
const LoginScreen: React.FC = () => {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'Doctor' | 'Nurse' | 'Billing Staff' | 'Admin'>('Doctor');

  const rolePermissions = {
    'Doctor': ['approve:discharge', 'reject:discharge', 'view:patient_records', 'update:diagnosis', 'update:treatment_notes'],
    'Nurse': ['view:patient_records', 'mark:nursing_task_complete', 'verify:meds_before_discharge'],
    'Billing Staff': ['view:patient_records', 'edit:billing', 'generate:bill', 'mark:bill_paid'],
    'Admin': ['approve:discharge', 'reject:discharge', 'view:patient_records', 'update:diagnosis', 'update:treatment_notes', 'mark:nursing_task_complete', 'verify:meds_before_discharge', 'edit:billing', 'generate:bill', 'mark:bill_paid', 'manage:roles', 'view:audit_logs', 'configure:integrations']
  };

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      // Mock authentication for demo purposes
      // In production, this would integrate with Descope
      const mockUser = {
        sub: `${selectedRole.toLowerCase().replace(' ', '')}@hospital.com`,
        email: `${selectedRole.toLowerCase().replace(' ', '')}@hospital.com`,
        name: selectedRole === 'Doctor' ? 'Dr. Sarah Wilson' : 
              selectedRole === 'Nurse' ? 'Jennifer Martinez, RN' :
              selectedRole === 'Billing Staff' ? 'Michael Chen' : 'Administrator',
        roles: [selectedRole],
        permissions: rolePermissions[selectedRole]
      };

      // Create a mock JWT token for demo
      const mockToken = btoa(JSON.stringify(mockUser));
      
      // Simulate the auth callback
      await login(mockToken);
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-black to-blue-900 text-white flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="bg-gray-900 rounded-lg shadow-2xl p-8 border border-gray-700">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Health Companion</h1>
            <p className="text-gray-300">Secure Hospital Discharge Management</p>
          </div>

          <div className="space-y-4">
            <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4">
              <h3 className="font-semibold text-blue-300 mb-3">Choose Demo Role:</h3>
              <div className="space-y-2">
                {Object.keys(rolePermissions).map((role) => (
                  <label key={role} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="role"
                      value={role}
                      checked={selectedRole === role}
                      onChange={(e) => setSelectedRole(e.target.value as any)}
                      className="text-blue-600"
                    />
                    <div>
                      <p className="font-medium text-white">{role}</p>
                      <p className="text-xs text-gray-400">
                        {role === 'Doctor' && 'Full discharge approval permissions'}
                        {role === 'Nurse' && 'Task management and patient care'}
                        {role === 'Billing Staff' && 'Financial records access'}
                        {role === 'Admin' && 'System administration'}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <button
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <User className="w-5 h-5" />
                  <span>Login as {selectedRole}</span>
                </>
              )}
            </button>

            <div className="text-center text-xs text-gray-400">
              <p>This is a demo implementation.</p>
              <p>In production, integrate with actual Descope authentication.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main app content
const AppContent: React.FC = () => {
  const { state, logout } = useAuth();
  const isAuthenticated = useIsAuthenticated();
  const [activeTab, setActiveTab] = useState<'discharge' | 'chat' | 'patients' | 'analytics'>('discharge');

  if (state.isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  const handleLogout = async () => {
    if (confirm('Are you sure you want to logout?')) {
      await logout();
    }
  };

  const navItems = [
    { id: 'discharge', label: 'Discharge Management', icon: FileText },
    { id: 'chat', label: 'AI Assistant', icon: MessageSquare },
    { id: 'patients', label: 'Patient Data', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: Activity },
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="bg-gray-900 shadow-2xl border-b border-gray-800 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-blue-600/5"></div>
        <div className="px-6 py-4 relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Shield className="w-8 h-8 text-blue-400 drop-shadow-lg" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-gray-900 shadow-lg animate-pulse"></div>
                </div>
                <h1 className="text-2xl font-bold text-white drop-shadow-lg">Health Companion</h1>
              </div>
              <span className="text-sm text-blue-300 bg-gradient-to-r from-blue-500/10 to-blue-600/10 px-3 py-1 rounded-full border border-blue-500/30 backdrop-blur-sm">
                RBAC-Enabled Hospital System
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-1 text-blue-400">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span>6 Active Patients</span>
                </div>
                <div className="flex items-center space-x-1 text-white">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  <span>2 Ready for Discharge</span>
                </div>
              </div>
              
              {/* User Info */}
              <div className="flex items-center space-x-3 text-right">
                <div>
                  <p className="text-sm font-medium text-white">{state.user?.name}</p>
                  <p className="text-xs text-gray-400">{state.user?.role}</p>
                </div>
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
              </div>

              <div className="relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search patients..."
                  className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 focus:shadow-lg focus:shadow-blue-500/20"
                />
              </div>
              <button className="relative p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/20">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-pulse shadow-lg shadow-blue-500/50"></span>
              </button>
              <button 
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-red-500/20"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
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
          {activeTab === 'discharge' && <DischargeManagement />}
          {activeTab === 'chat' && <ChatInterface />}
          {activeTab === 'patients' && <PatientDashboard />}
          {activeTab === 'analytics' && (
            <div className="p-6 h-full flex items-center justify-center bg-black">
              <div className="text-center">
                <Activity className="w-16 h-16 text-blue-400 mx-auto mb-4 drop-shadow-lg" />
                <h3 className="text-xl font-semibold text-white mb-2">Analytics Dashboard</h3>
                <p className="text-gray-400">Advanced discharge analytics and insights coming soon</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;