import React from 'react';
import { 
  MessageSquarePlus, 
  Bot, 
  BookOpen, 
  Calculator, 
  Info, 
  HelpCircle,
  Sparkles,
  ChevronRight,
  UserCheck
} from 'lucide-react';

const SUGGESTED_QUESTIONS = [
  "What is the minimum attendance requirement?",
  "I attended 45 out of 50 classes. Calculate my attendance.",
  "I scored 78 out of 100. What is my percentage?",
  "What are the passing requirements?",
  "I am a CSE third-year student.",
  "Create a 7-day study plan for me.",
  "What are the examination rules?",
  "How do I apply for a Bonafide Certificate?"
];

export default function Sidebar({ 
  currentView, 
  onSelectView, 
  onNewChat, 
  onSelectPrompt,
  activeMemory 
}) {
  const navItems = [
    { id: 'chat', label: 'AI Chat Assistant', icon: Bot },
    { id: 'kb', label: 'Knowledge Base', icon: BookOpen },
    { id: 'tools', label: 'Academic Tools', icon: Calculator },
    { id: 'about', label: 'About & Architecture', icon: Info }
  ];

  return (
    <aside style={{
      width: '280px',
      backgroundColor: '#ffffff',
      borderRight: '1px solid #e2e8f0',
      display: 'flex',
      flexDirection: 'column',
      height: 'calc(100vh - 65px)',
      position: 'relative'
    }}>
      {/* New Chat Button */}
      <div style={{ padding: '1rem' }}>
        <button
          onClick={onNewChat}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            padding: '0.65rem 1rem',
            backgroundColor: '#2563eb',
            color: '#ffffff',
            border: 'none',
            borderRadius: '10px',
            fontWeight: 600,
            fontSize: '0.875rem',
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(37, 99, 235, 0.2)',
            transition: 'background-color 0.15s ease'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#1d4ed8'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#2563eb'; }}
        >
          <MessageSquarePlus size={18} />
          <span>New Chat</span>
        </button>
      </div>

      {/* Navigation Tabs */}
      <div style={{ padding: '0 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectView(item.id)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.6rem 0.85rem',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: isActive ? '#eff6ff' : 'transparent',
                color: isActive ? '#1e40af' : '#475569',
                fontWeight: isActive ? 600 : 500,
                fontSize: '0.85rem',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.backgroundColor = '#f8fafc';
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <Icon size={18} color={isActive ? '#2563eb' : '#64748b'} />
                <span>{item.label}</span>
              </div>
              {isActive && <ChevronRight size={14} color="#2563eb" />}
            </button>
          );
        })}
      </div>

      {/* Divider */}
      <div style={{ height: '1px', backgroundColor: '#e2e8f0', margin: '1rem 1rem' }} />

      {/* Suggested Questions List */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.6rem' }}>
          <Sparkles size={14} color="#64748b" />
          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            Suggested Questions
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          {SUGGESTED_QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              onClick={() => {
                onSelectView('chat');
                onSelectPrompt(q);
              }}
              style={{
                padding: '0.5rem 0.65rem',
                borderRadius: '6px',
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                color: '#334155',
                fontSize: '0.75rem',
                textAlign: 'left',
                lineHeight: 1.4,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#eff6ff';
                e.currentTarget.style.borderColor = '#bfdbfe';
                e.currentTarget.style.color = '#1d4ed8';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#f8fafc';
                e.currentTarget.style.borderColor = '#e2e8f0';
                e.currentTarget.style.color = '#334155';
              }}
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Active Profile Context Card */}
      {activeMemory && (activeMemory.department || activeMemory.year || activeMemory.student_name) && (
        <div style={{
          padding: '0.85rem 1rem',
          margin: '0.75rem',
          backgroundColor: '#eff6ff',
          borderRadius: '8px',
          border: '1px solid #bfdbfe'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.3rem' }}>
            <UserCheck size={14} color="#1d4ed8" />
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#1d4ed8', textTransform: 'uppercase' }}>
              Student Context Active
            </span>
          </div>
          <p style={{ fontSize: '0.75rem', color: '#1e3a8a', fontWeight: 500 }}>
            {activeMemory.student_name ? `${activeMemory.student_name} • ` : ''}
            {activeMemory.year || ''} {activeMemory.department || ''}
          </p>
          {activeMemory.subjects && activeMemory.subjects.length > 0 && (
            <p style={{ fontSize: '0.68rem', color: '#3b82f6', marginTop: '0.2rem' }}>
              {activeMemory.subjects.length} subjects loaded from curriculum
            </p>
          )}
        </div>
      )}
    </aside>
  );
}
