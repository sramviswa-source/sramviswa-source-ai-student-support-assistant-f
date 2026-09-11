import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ChatView from './components/ChatView';
import ChatInput from './components/ChatInput';
import KnowledgeBaseView from './components/KnowledgeBaseView';
import ToolsView from './components/ToolsView';
import AboutView from './components/AboutView';
import MemoryModal from './components/MemoryModal';
import { 
  checkBackendHealth, 
  sendChatMessage, 
  getSessionMemory, 
  resetSessionMemory 
} from './api';

export default function App() {
  const [currentView, setCurrentView] = useState('chat');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => 'student-session-' + Math.random().toString(36).substring(2, 9));
  const [activeMemory, setActiveMemory] = useState({
    student_name: null,
    department: null,
    year: null,
    semester: null,
    subjects: [],
    study_preferences: {}
  });
  const [backendConnected, setBackendConnected] = useState(false);
  const [isMemoryModalOpen, setIsMemoryModalOpen] = useState(false);

  // Check health and load initial memory
  useEffect(() => {
    async function init() {
      const health = await checkBackendHealth();
      if (health) {
        setBackendConnected(true);
      }
      try {
        const mem = await getSessionMemory(sessionId);
        if (mem && mem.memory) {
          setActiveMemory(mem.memory);
        }
      } catch (e) {
        console.warn('Could not load session memory', e);
      }
    }
    init();

    // Periodic heartbeat every 15s
    const timer = setInterval(async () => {
      const h = await checkBackendHealth();
      setBackendConnected(!!h);
    }, 15000);
    return () => clearInterval(timer);
  }, [sessionId]);

  const handleSendMessage = async (text) => {
    if (!text.trim() || isLoading) return;

    const userTurn = {
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userTurn]);
    setIsLoading(true);

    try {
      const data = await sendChatMessage(text, sessionId);
      const assistantTurn = {
        role: 'assistant',
        content: data.response,
        intent: data.intent,
        sources: data.sources || [],
        tool_result: data.tool_result || null,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, assistantTurn]);
      if (data.active_memory) {
        setActiveMemory(data.active_memory);
      }
      setBackendConnected(true);
    } catch (err) {
      console.error('Chat error:', err);
      const errorTurn = {
        role: 'assistant',
        content: `Error connecting to assistant: ${err.message}. Please verify the backend server is running.`,
        intent: 'error',
        sources: [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorTurn]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
  };

  const handleResetMemory = async () => {
    try {
      const res = await resetSessionMemory(sessionId);
      if (res && res.memory) {
        setActiveMemory(res.memory);
      }
      // Add system message into chat if in chat view
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: '🔄 **Conversational memory has been reset.** All previously remembered student details and interaction context have been cleared.',
          intent: 'memory_reset',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err) {
      console.error('Error resetting memory:', err);
    }
  };

  const handleSelectPrompt = (promptText) => {
    handleSendMessage(promptText);
  };

  const handleAskAboutDoc = (query) => {
    setCurrentView('chat');
    handleSendMessage(query);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#f8fafc' }}>
      {/* Header */}
      <Header
        activeMemory={activeMemory}
        onResetMemory={handleResetMemory}
        onOpenMemoryModal={() => setIsMemoryModalOpen(true)}
        backendConnected={backendConnected}
      />

      {/* Main Workspace Layout */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Sidebar */}
        <Sidebar
          currentView={currentView}
          onSelectView={setCurrentView}
          onNewChat={handleNewChat}
          onSelectPrompt={handleSelectPrompt}
          activeMemory={activeMemory}
        />

        {/* View Routing */}
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>
          {currentView === 'chat' && (
            <>
              <ChatView
                messages={messages}
                isLoading={isLoading}
                onSendPrompt={handleSendMessage}
                onViewDoc={(docName) => {
                  setCurrentView('kb');
                }}
              />
              <ChatInput
                onSendMessage={handleSendMessage}
                isLoading={isLoading}
              />
            </>
          )}

          {currentView === 'kb' && (
            <KnowledgeBaseView
              onSelectDocForChat={handleAskAboutDoc}
            />
          )}

          {currentView === 'tools' && (
            <ToolsView
              activeMemory={activeMemory}
            />
          )}

          {currentView === 'about' && (
            <AboutView />
          )}
        </main>
      </div>

      {/* Memory Inspector Modal */}
      <MemoryModal
        isOpen={isMemoryModalOpen}
        onClose={() => setIsMemoryModalOpen(false)}
        activeMemory={activeMemory}
        onResetMemory={handleResetMemory}
      />
    </div>
  );
}
