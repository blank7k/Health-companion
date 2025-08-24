import React, { useState } from "react";
import {
  MessageSquare,
  Users,
  Activity,
  FileText,
  Search,
  Settings,
  Bell,
} from "lucide-react";
import ChatInterface from "./components/ChatInterface";
import PatientDashboard from "./components/PatientDashboard";
import Navigation from "./components/Navigation";
import AnalysisSection from "./components/AnalysisSection";

function App() {
  const [activeTab, setActiveTab] = useState<"chat" | "patients" | "analytics">(
    "chat"
  );
  const [messages, setMessages] = useState([
    {
      id: "1",
      type: "assistant",
      content:
        "Hello! I'm your hospital discharge assistant. I can help you with patient discharge coordination, documentation, and workflow management. What would you like to know?",
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const navItems = [
    { id: "chat", label: "AI Assistant", icon: MessageSquare },
    { id: "patients", label: "Patient Data", icon: Users },
    { id: "analytics", label: "Analytics", icon: Activity },
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
                  <Activity className="w-8 h-8 text-blue-400 drop-shadow-lg" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-gray-900 shadow-lg animate-pulse"></div>
                </div>
                <h1 className="text-2xl font-bold text-white drop-shadow-lg">
                  DischargeAI
                </h1>
              </div>
              <span className="text-sm text-blue-300 bg-gradient-to-r from-blue-500/10 to-blue-600/10 px-3 py-1 rounded-full border border-blue-500/30 backdrop-blur-sm">
                Hospital Discharge Assistant
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
              <button className="relative p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/20">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-pulse shadow-lg shadow-blue-500/50"></span>
              </button>
              <button className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/20">
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
          {activeTab === "analytics" && <AnalysisSection />}
        </main>
      </div>
    </div>
  );
}

export default App;
