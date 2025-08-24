import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Clock, CheckCircle } from "lucide-react";
import { aiService } from "../services/AIService";

interface Message {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
  status?: "sending" | "sent";
}

interface ChatInterfaceProps {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  inputValue: string;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  isTyping: boolean;
  setIsTyping: React.Dispatch<React.SetStateAction<boolean>>;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  setMessages,
  inputValue,
  setInputValue,
  isTyping,
  setIsTyping,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date(),
      status: "sending",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Update message status to sent
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === userMessage.id ? { ...msg, status: "sent" } : msg
        )
      );
    }, 500);

    // Get intelligent AI response
    setTimeout(async () => {
      const response = await getAIResponse(inputValue);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const getAIResponse = async (input: string): Promise<string> => {
    try {
      // Use the intelligent AI service instead of basic keyword matching
      const response = await aiService.processQuery(input);
      return response;
    } catch (error) {
      console.error("AI Service Error:", error);
      return `I apologize, but I encountered an error processing your request. Please try rephrasing your question or ask for help to see what I can assist you with.`;
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const quickActions = [
    "Show me ready patients",
    "What delays do we have today?",
    "Margaret Johnson status",
    "Patient census overview",
    "Discharge metrics today",
    "Transportation coordination status",
  ];

  // ✅ The return is correctly inside ChatInterface
  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-800 bg-gray-900 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-blue-600/5"></div>
        <div className="flex items-center justify-between relative z-10">
          <div>
            <h2 className="text-xl font-semibold text-white flex items-center">
              <Bot className="w-6 h-6 text-blue-400 mr-2 drop-shadow-lg" />
              AI Discharge Assistant
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              Intelligent AI assistant - understands natural language and
              patient data
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 text-xs text-blue-300 bg-blue-500/10 px-2 py-1 rounded-full border border-blue-500/30 backdrop-blur-sm">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span>AI Online</span>
            </div>
            <div className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded-full border border-gray-700">
              6 Patients Active
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-black">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.type === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`flex max-w-3xl ${
                message.type === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <div
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  message.type === "user"
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 ml-3 shadow-lg shadow-blue-500/30"
                    : "bg-gradient-to-r from-gray-700 to-gray-800 mr-3 shadow-lg"
                }`}
              >
                {message.type === "user" ? (
                  <User className="w-4 h-4 text-white" />
                ) : (
                  <Bot className="w-4 h-4 text-blue-400" />
                )}
              </div>

              <div
                className={`rounded-lg px-4 py-3 ${
                  message.type === "user"
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/20"
                    : "bg-gray-900 border border-gray-700 text-white shadow-lg backdrop-blur-sm"
                }`}
              >
                <div className="whitespace-pre-wrap">{message.content}</div>
                <div
                  className={`flex items-center justify-end mt-2 text-xs ${
                    message.type === "user" ? "text-blue-200" : "text-gray-400"
                  }`}
                >
                  <Clock className="w-3 h-3 mr-1" />
                  {formatTime(message.timestamp)}
                  {message.type === "user" && message.status === "sent" && (
                    <CheckCircle className="w-3 h-3 ml-1 text-blue-300" />
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="flex">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-gray-700 to-gray-800 mr-3 flex items-center justify-center shadow-lg">
                <Bot className="w-4 h-4 text-blue-400" />
              </div>
              <div className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 shadow-lg">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      <div className="px-4 py-2 bg-gray-900 border-t border-gray-800 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent"></div>
        <div className="text-xs text-blue-300 mb-2 font-medium relative z-10">
          💡 Quick Actions:
        </div>
        <div className="flex flex-wrap gap-2 relative z-10">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={() => setInputValue(action)}
              className="px-3 py-1.5 text-xs bg-gray-800 border border-gray-700 rounded-full text-gray-300 hover:bg-blue-500/10 hover:text-blue-300 hover:border-blue-500/50 transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/20"
            >
              {action}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-800 bg-gray-900 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-blue-600/5"></div>
        <div className="flex space-x-3 relative z-10">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Ask about patient discharge status, workflows, or coordination..."
            className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 focus:shadow-lg focus:shadow-blue-500/20"
            disabled={isTyping}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isTyping}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
