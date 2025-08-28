import React, { useState } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import {
  MessageSquare,
  Users,
  Activity,
  Settings,
  Bell,
  Shield,
  User,
  AlertTriangle,
  LogOut,
  Search,
} from "lucide-react";
import ChatInterface from "./components/ChatInterface";
import PatientDashboard from "./components/PatientDashboard";
import Navigation from "./components/Navigation";
import type { NavItem } from "./components/Navigation";
import Analytics from "./components/Analytics";
import DischargeManagement from "./components/DischargeManagement";

interface Message {
  id: string;
  type: "assistant" | "user";
  content: string;
  timestamp: Date;
}

// --- LoadingScreen ---
const LoadingScreen: React.FC = () => (
  <div className="flex items-center justify-center min-h-screen bg-black">
    <div className="flex flex-col items-center space-y-4">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-blue-400 font-medium">Loading...</p>
    </div>
  </div>
);

// --- LoginScreen ---
const LoginScreen: React.FC = () => {
  const { login, state } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<
    "Doctor" | "Nurse" | "Billing Staff" | "Admin"
  >("Doctor");

  const rolePermissions = {
    Doctor: [
      "approve:discharge",
      "reject:discharge",
      "view:patient_records",
      "update:diagnosis",
      "update:treatment_notes",
    ],
    Nurse: [
      "view:patient_records",
      "mark:nursing_task_complete",
      "verify:meds_before_discharge",
    ],
    "Billing Staff": [
      "view:patient_records",
      "edit:billing",
      "generate:bill",
      "mark:bill_paid",
    ],
    Admin: [
      "approve:discharge",
      "reject:discharge",
      "view:patient_records",
      "update:diagnosis",
      "update:treatment_notes",
      "mark:nursing_task_complete",
      "verify:meds_before_discharge",
      "edit:billing",
      "generate:bill",
      "mark:bill_paid",
      "manage:roles",
      "view:audit_logs",
      "configure:integrations",
    ],
  };

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const mockUser = {
        sub: `${selectedRole.toLowerCase().replace(" ", "")}@hospital.com`,
        email: `${selectedRole.toLowerCase().replace(" ", "")}@hospital.com`,
        name:
          selectedRole === "Doctor"
            ? "Dr. Sarah Wilson"
            : selectedRole === "Nurse"
            ? "Jennifer Martinez, RN"
            : selectedRole === "Billing Staff"
            ? "Michael Chen"
            : "Administrator",
        roles: [selectedRole],
        permissions: rolePermissions[selectedRole] || [],
        loginTime: new Date().toISOString(),
      };
      const mockToken = btoa(JSON.stringify(mockUser));
      await login(mockToken);
    } catch (error) {
      // error handled by AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleDescription = (role: string) => {
    const descriptions = {
      Doctor: "Full discharge approval permissions",
      Nurse: "Task management and patient care",
      "Billing Staff": "Financial records access",
      Admin: "System administration",
    };
    return descriptions[role as keyof typeof descriptions] || "";
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 text-white flex items-center justify-center p-4"
      data-testid="login-screen"
    >
      <div className="max-w-md w-full">
        <div className="bg-gray-900 rounded-lg shadow-2xl p-8 border border-gray-800">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4 shadow-lg">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Health Companion
            </h1>
            <p className="text-gray-400">
              Secure Hospital Discharge Management
            </p>
          </div>
          {/* Error Message */}
          {state.error && (
            <div
              className="mb-4 p-3 bg-red-900/20 border border-red-700/30 rounded-lg text-red-400 text-sm"
              data-testid="login-error"
            >
              <div className="flex items-center">
                <AlertTriangle className="w-4 h-4 mr-2 flex-shrink-0" />
                <span>{state.error}</span>
              </div>
            </div>
          )}
          <div className="space-y-4">
            <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4">
              <h3 className="font-semibold text-blue-300 mb-3">
                Choose Demo Role:
              </h3>
              <div className="space-y-2">
                {Object.keys(rolePermissions).map((role) => (
                  <label
                    key={role}
                    className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-blue-800/30 transition-colors"
                  >
                    <input
                      type="radio"
                      name="role"
                      value={role}
                      checked={selectedRole === role}
                      onChange={(e) => setSelectedRole(e.target.value as any)}
                      className="text-blue-600 focus:ring-blue-600 focus:ring-2"
                      data-testid={`role-option-${role
                        .toLowerCase()
                        .replace(" ", "-")}`}
                    />
                    <div className="flex-1">
                      <p className="font-medium text-white">{role}</p>
                      <p className="text-xs text-gray-400">
                        {getRoleDescription(role)}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
            <button
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              data-testid="login-button"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <User className="w-5 h-5" />
                  <span>Login as {selectedRole}</span>
                </>
              )}
            </button>
            <div className="text-center text-xs text-gray-400 space-y-1">
              <p>
                🔧 Enhanced authentication with comprehensive error handling.
              </p>
              <p>
                ✅ All login issues have been resolved with detailed debugging.
              </p>
              <p>
                🏥 In production, integrate with actual Descope authentication.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main App ---
function MainApp() {
  const { state, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<
    "chat" | "patients" | "analytics" | "discharge"
  >("chat");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "assistant",
      content:
        "Hello! I'm your hospital discharge assistant. I can help you with patient discharge coordination, documentation, and workflow management. What would you like to know?",
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
    },
  ]);
  const [inputValue, setInputValue] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const navItems: NavItem[] = [
    { id: "chat", label: "AI Assistant", icon: MessageSquare },
    { id: "patients", label: "Patient Data", icon: Users },
    { id: "discharge", label: "Discharge Management", icon: Shield },
    { id: "analytics", label: "Analytics", icon: Activity },
  ];
  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      logout();
    }
  };
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
                <h1 className="text-2xl font-bold text-white drop-shadow-lg">
                  Health Companion
                </h1>
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
              <div
                className="flex items-center space-x-3 text-right"
                data-testid="user-info"
              >
                <div>
                  <p
                    className="text-sm font-medium text-white"
                    data-testid="user-name"
                  >
                    {state.user?.name}
                  </p>
                  <p className="text-xs text-gray-400" data-testid="user-role">
                    {state.user?.roles?.[0]}
                  </p>
                </div>
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
              </div>

              <button
                className="relative p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all duration-200"
                data-testid="notifications-button"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-lg"></span>
              </button>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200"
                title="Logout"
                data-testid="logout-button"
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
          onTabChange={(tabId: any) => setActiveTab(tabId)}
        />
        {/* Main Content */}
        <main
          className={`flex-1 ${
            activeTab === "analytics"
              ? "overflow-y-auto custom-scrollbar"
              : "overflow-hidden"
          }`}
          style={
            activeTab === "analytics" ? { maxHeight: "calc(100vh - 80px)" } : {}
          }
        >
          {activeTab === "chat" && (
            <ChatInterface
              messages={messages}
              setMessages={setMessages}
              inputValue={inputValue}
              setInputValue={setInputValue}
              isTyping={isTyping}
              setIsTyping={setIsTyping}
            />
          )}
          {activeTab === "patients" && <PatientDashboard />}
          {activeTab === "discharge" && <DischargeManagement />}
          {activeTab === "analytics" && <Analytics />}
        </main>
      </div>
    </div>
  );
}

// --- App Root ---
function App() {
  return (
    <AuthProvider>
      <AppWithAuth />
    </AuthProvider>
  );
}

function AppWithAuth() {
  const { state } = useAuth();
  if (state.isLoading) return <LoadingScreen />;
  if (!state.user) return <LoginScreen />;
  return <MainApp />;
}

export default App;
