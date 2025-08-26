import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Clock, CheckCircle } from 'lucide-react';
import { mockChatResponses } from '../data/mockData.ts';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  status?: 'sending' | 'sent';
}

// Function to call your backend API to send email
async function sendDischargeEmail(staffName: string): Promise<string> {
  try {
    const res = await fetch('http://localhost:5000/send-discharge-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ staffName }),
    });

    if (res.status === 200) {
      const data = await res.json();
      return `✅ Email sent to ${data.message}`;
    } else if (res.status === 204) {
      return '⚠️ No discharges today.';
    } else if (res.status === 404) {
      return '❌ Staff not found.';
    } else {
      return '❌ Something went wrong.';
    }
  } catch (error) {
    console.error(error);
    return '⚠️ Could not connect to server.';
  }
}

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content:
        "Hello! I'm your hospital discharge assistant. I can help you with patient discharge coordination, documentation, and workflow management. What would you like to know?",
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
    },
  ]);

  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
      status: 'sending',
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Update user message status to sent
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === userMessage.id ? { ...msg, status: 'sent' } : msg
        )
      );
    }, 500);

    // Simulate AI response
    setTimeout(async () => {
      const response = await getAIResponse(inputValue);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const getAIResponse = async (input: string): Promise<string> => {
    const lowerInput = input.toLowerCase();

    // **New: Detect email sending command**
    // if (lowerInput.includes('send email') || lowerInput.includes('email')) {
    //   // Optimistic message
    //   setMessages((prev) => [
    //     ...prev,
    //     {
    //       id: (Date.now() + 2).toString(),
    //       type: 'assistant',
    //       content: '📤 Sending discharge email to ...',
    //       timestamp: new Date(),
    //     },
    //   ]);

    //   const emailResult = await sendDischargeEmail('Sahil');
    //   return emailResult;
    // }
    
    if (lowerInput.includes('send email') || lowerInput.includes('email')) {
  // Extract staff name from input (simple version)
  // e.g., "Send email to rohit"
  const match = input.match(/to (\w+)/i);
  const staffName = match ? match[1] : null;

  if (!staffName) {
    return '❌ Please specify the staff name to send the email.';
  }

  // Show optimistic message
  setMessages((prev) => [
    ...prev,
    {
      id: (Date.now() + 2).toString(),
      type: 'assistant',
      content: `📤 Sending discharge email to ${staffName}...`,
      timestamp: new Date(),
    },
  ]);

  const emailResult = await sendDischargeEmail(staffName);
  return emailResult;
}


    // Existing NLP-like responses
    if (lowerInput.includes('ready') && (lowerInput.includes('discharge') || lowerInput.includes('patient'))) {
      return mockChatResponses['patient readiness,readiness status,ready patients'];
    }
    if (lowerInput.includes('pending') && (lowerInput.includes('discharge') || lowerInput.includes('patient'))) {
      return mockChatResponses['pending discharges,pending discharge,show pending'];
    }
    if (lowerInput.includes('delay') || lowerInput.includes('delayed')) {
      return mockChatResponses['delays,discharge delays,delayed discharges'];
    }
    if (lowerInput.includes('transport') || lowerInput.includes('pickup') || lowerInput.includes('ride')) {
      return mockChatResponses['transportation,transport coordination,pickup'];
    }
    if (lowerInput.includes('medication') || lowerInput.includes('med') || lowerInput.includes('drug')) {
      return mockChatResponses['medication,medications,med reconciliation'];
    }
    if (lowerInput.includes('document') || lowerInput.includes('paperwork') || lowerInput.includes('form')) {
      return mockChatResponses['documentation,paperwork,discharge papers'];
    }
    if (lowerInput.includes('room') || lowerInput.includes('bed')) {
      return mockChatResponses['room,bed management,bed availability'];
    }
    if (lowerInput.includes('family') || lowerInput.includes('contact') || lowerInput.includes('call')) {
      return mockChatResponses['family,contact,notification'];
    }

    // Patient-specific queries
    if (lowerInput.includes('margaret') || lowerInput.includes('johnson')) {
      return `**Margaret Johnson (Room A-204)** - Discharge Status: READY

✅ **All discharge criteria met**
- Physician orders: Complete
- Medications reconciled: 4 medications reviewed
- Patient education: Completed
- Transportation: Daughter pickup confirmed at 2:00 PM
- Follow-up: Primary care scheduled for next week

**Ready for immediate discharge** - No barriers identified.`;
    }

    if (lowerInput.includes('robert') || lowerInput.includes('martinez')) {
      return `**Robert Martinez (Room B-112)** - Discharge Status: PENDING

⏳ **Pending Items:**
- Transportation coordination needed (family scheduling conflict)
- PT evaluation summary missing

✅ **Completed:**
- Hip replacement surgery recovery on track
- Pain management plan established
- Discharge medications prepared

**Action needed:** Contact backup transport services and obtain PT summary.`;
    }

    if ((lowerInput.includes('patient') || lowerInput.includes('all')) &&
        (lowerInput.includes('list') || lowerInput.includes('show') || lowerInput.includes('data'))) {
      return `**Current Patient Census - Discharge Status:**

🟢 **Ready for Discharge (2):**
• Margaret Johnson (A-204) - Pneumonia recovery
• William Thompson (C-205) - Diabetes management

🟡 **Pending Discharge (2):**
• Robert Martinez (B-112) - Hip replacement, transport needed
• Dorothy Wilson (B-208) - Fall injury, equipment pending

🔴 **Delayed Discharge (2):**
• Linda Davis (A-301) - Cardiac monitoring, clearance needed
• Charles Brown (A-105) - Post-surgical, insurance issues

**Total: 6 patients** | **Average LOS: 4.2 days**`;
    }

    if (lowerInput.includes('today') || lowerInput.includes('now') || lowerInput.includes('current')) {
      return `**Today's Discharge Summary (${new Date().toLocaleDateString()}):**

📊 **Metrics:**
• Scheduled discharges: 6 patients
• Completed: 0 (day in progress)
• Ready to go: 2 patients
• Average delay: 2.5 hours

⚡ **Immediate Actions Needed:**
• Contact Martinez family for transport backup
• Follow up on Davis cardiology clearance
• Expedite Brown insurance authorization

🎯 **Goal:** Complete 4 discharges by 5 PM`;
    }

    if (lowerInput.includes('help') || lowerInput.length < 10) {
      return `I'm your AI discharge coordinator! I can help with:

📋 **Patient Information:**
• "Show me ready patients" 
• "Patient status for [name]"
• "Today's discharge schedule"

🚨 **Workflow Management:**
• "What delays do we have?"
• "Transportation status"
• "Pending documentation"

📊 **Analytics:**
• "Discharge metrics today"
• "Bed availability"
• "Average length of stay"

Just ask me naturally - I understand healthcare terminology!`;
    }

    return `I understand you're asking about "${input}". Let me help you with that.

Based on your query, here are some relevant insights:

📊 **Current Status:**
• 6 patients in discharge planning
• 2 ready for immediate discharge
• 4 with pending items or delays

💡 **Suggestions:**
Try asking: "Show ready patients", "What delays exist?", or "Patient status for [name]"

I'm designed to understand natural healthcare language - feel free to ask specific questions about patients, workflows, or discharge coordination!`;
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const quickActions = [
    'Show me ready patients',
    'What delays do we have today?',
    'Transportation status update',
    'Patient census overview',
    'Bed availability status',
    'Medication reconciliation status'
  ];

  // The JSX below remains exactly as your original ChatInterface
  // (header, messages, typing animation, quick actions, input box)
  // No changes needed for layout.

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="p-4 border-b border-slate-200 bg-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-800 flex items-center">
              <Bot className="w-6 h-6 text-blue-600 mr-2" />
              AI Discharge Assistant
            </h2>
            <p className="text-sm text-slate-600 mt-1">Ask me anything about patient discharge coordination</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>AI Online</span>
            </div>
            <div className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
              6 Patients Active
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex max-w-3xl ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                message.type === 'user' 
                  ? 'bg-blue-600 ml-3' 
                  : 'bg-green-100 mr-3'
              }`}>
                {message.type === 'user' ? (
                  <User className="w-4 h-4 text-white" />
                ) : (
                  <Bot className="w-4 h-4 text-green-600" />
                )}
              </div>
              
              <div className={`rounded-lg px-4 py-3 ${
                message.type === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-slate-200 text-slate-800'
              }`}>
                <div className="whitespace-pre-wrap">{message.content}</div>
                <div className={`flex items-center justify-end mt-2 text-xs ${
                  message.type === 'user' ? 'text-blue-200' : 'text-slate-500'
                }`}>
                  <Clock className="w-3 h-3 mr-1" />
                  {formatTime(message.timestamp)}
                  {message.type === 'user' && message.status === 'sent' && (
                    <CheckCircle className="w-3 h-3 ml-1 text-blue-200" />
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="flex">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 mr-3 flex items-center justify-center">
                <Bot className="w-4 h-4 text-green-600" />
              </div>
              <div className="bg-white border border-slate-200 rounded-lg px-4 py-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      <div className="px-4 py-2 bg-slate-50 border-t border-slate-200">
        <div className="text-xs text-slate-600 mb-2 font-medium">💡 Quick Actions:</div>
        <div className="flex flex-wrap gap-2">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={() => setInputValue(action)}
              className="px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-full text-slate-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 transition-all duration-200 hover:shadow-sm"
            >
              {action}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="p-4 border-t border-slate-200 bg-white">
        <div className="flex space-x-3">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask about patient discharge status, workflows, or coordination..."
            className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isTyping}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isTyping}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
