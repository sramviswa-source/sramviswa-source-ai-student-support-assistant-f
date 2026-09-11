import React, { useRef, useEffect } from 'react';
import { 
  Bot, 
  User, 
  BookOpen, 
  Calculator, 
  Calendar, 
  CheckCircle2, 
  FileText, 
  ExternalLink,
  Sparkles,
  Info,
  Layers
} from 'lucide-react';

const PROMPT_CHIPS = [
  { text: "What is the minimum attendance requirement?", category: "Regulations" },
  { text: "I attended 45 out of 50 classes. Calculate my attendance.", category: "Tools" },
  { text: "I scored 78 out of 100. What is my percentage?", category: "Tools" },
  { text: "What are the passing requirements?", category: "Regulations" },
  { text: "I am a CSE third-year student.", category: "Context" },
  { text: "Create a 7-day study plan for me.", category: "Planning" }
];

export default function ChatView({ 
  messages, 
  isLoading, 
  onSendPrompt, 
  onViewDoc 
}) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div style={{
      flex: 1,
      overflowY: 'auto',
      padding: '1.5rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.25rem'
    }}>
      {/* Welcome banner when no conversation history */}
      {messages.length === 0 && (
        <div style={{
          maxWidth: '750px',
          margin: '2rem auto',
          textAlign: 'center',
          animation: 'fadeIn 0.3s ease'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '16px',
            backgroundColor: '#eff6ff',
            border: '2px solid #bfdbfe',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem',
            color: '#2563eb'
          }}>
            <Bot size={36} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
            College Student Academic Assistant
          </h2>
          <p style={{ fontSize: '0.9rem', color: '#64748b', maxWidth: '600px', margin: '0 auto 1.75rem', lineHeight: 1.6 }}>
            Ask questions about college policies, check attendance criteria, calculate grades, or generate a tailored study plan grounded on official regulations.
          </p>

          {/* Quick start chip prompts */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '0.75rem',
            textAlign: 'left'
          }}>
            {PROMPT_CHIPS.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => onSendPrompt(chip.text)}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem',
                  padding: '0.85rem 1rem',
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#93c5fd';
                  e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(37,99,235,0.1)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.03)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{
                  padding: '0.4rem',
                  borderRadius: '6px',
                  backgroundColor: '#eff6ff',
                  color: '#2563eb',
                  marginTop: '0.1rem'
                }}>
                  <Sparkles size={16} />
                </div>
                <div>
                  <span style={{
                    fontSize: '0.68rem',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    color: '#64748b',
                    display: 'block',
                    marginBottom: '0.2rem'
                  }}>
                    {chip.category}
                  </span>
                  <p style={{ fontSize: '0.82rem', fontWeight: 500, color: '#1e293b' }}>
                    {chip.text}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Conversation Thread */}
      {messages.map((msg, index) => {
        const isUser = msg.role === 'user';
        return (
          <div
            key={index}
            style={{
              display: 'flex',
              gap: '0.85rem',
              maxWidth: '850px',
              width: '100%',
              margin: '0 auto',
              alignSelf: isUser ? 'flex-end' : 'flex-start',
              animation: 'fadeIn 0.25s ease'
            }}
          >
            {/* Avatar */}
            {!isUser && (
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: '#1e40af',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                flexShrink: 0,
                marginTop: '0.25rem'
              }}>
                <Bot size={20} />
              </div>
            )}

            {/* Bubble Content */}
            <div style={{ flex: 1, minWidth: 0 }}>
              {/* Header info */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '0.35rem',
                justifyContent: isUser ? 'flex-end' : 'flex-start'
              }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 600, color: isUser ? '#2563eb' : '#0f172a' }}>
                  {isUser ? 'You (Student)' : 'AI Student Support Assistant'}
                </span>
                {msg.intent && !isUser && (
                  <span style={{
                    fontSize: '0.68rem',
                    fontWeight: 600,
                    padding: '0.1rem 0.45rem',
                    borderRadius: '4px',
                    backgroundColor: '#eff6ff',
                    color: '#2563eb',
                    border: '1px solid #dbeafe',
                    textTransform: 'capitalize'
                  }}>
                    {msg.intent.replace('_', ' ')}
                  </span>
                )}
                <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                  {msg.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              {/* Message Bubble */}
              <div style={{
                backgroundColor: isUser ? '#2563eb' : '#ffffff',
                color: isUser ? '#ffffff' : '#1e293b',
                padding: '0.9rem 1.15rem',
                borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                border: isUser ? 'none' : '1px solid #e2e8f0',
                boxShadow: isUser ? '0 2px 4px rgba(37,99,235,0.2)' : '0 1px 3px rgba(0,0,0,0.04)',
                fontSize: '0.88rem',
                lineHeight: 1.6,
                wordBreak: 'break-word'
              }}>
                <div 
                  className="markdown-body"
                  dangerouslySetInnerHTML={{
                    __html: formatMarkdown(msg.content, isUser)
                  }}
                />

                {/* Tool Result Badge Card if present */}
                {msg.tool_result && (
                  <div style={{
                    marginTop: '0.85rem',
                    padding: '0.75rem 0.9rem',
                    borderRadius: '8px',
                    backgroundColor: '#f8fafc',
                    border: '1px solid #cbd5e1'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
                      <Calculator size={15} color="#2563eb" />
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1e40af' }}>
                        Tool Executed: {msg.tool_result.tool_name}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.76rem', color: '#475569', marginBottom: '0.4rem' }}>
                      {msg.tool_result.explanation}
                    </p>
                    {msg.tool_result.outputs?.calculation_formula && (
                      <div style={{
                        padding: '0.35rem 0.6rem',
                        backgroundColor: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '4px',
                        fontFamily: 'monospace',
                        fontSize: '0.8rem',
                        color: '#0f172a'
                      }}>
                        Formula: {msg.tool_result.outputs.calculation_formula}
                      </div>
                    )}
                  </div>
                )}

                {/* RAG Knowledge Base Sources */}
                {msg.sources && msg.sources.length > 0 && (
                  <div style={{
                    marginTop: '0.85rem',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '8px',
                    backgroundColor: '#eff6ff',
                    border: '1px solid #bfdbfe'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.4rem' }}>
                      <BookOpen size={14} color="#1d4ed8" />
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#1e40af', textTransform: 'uppercase' }}>
                        Retrieved Knowledge Base Sources
                      </span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                      {msg.sources.map((src, sIdx) => (
                        <div 
                          key={sIdx}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '0.35rem 0.5rem',
                            backgroundColor: '#ffffff',
                            borderRadius: '4px',
                            border: '1px solid #dbeafe',
                            fontSize: '0.75rem'
                          }}
                        >
                          <span style={{ fontWeight: 600, color: '#1e3a8a' }}>
                            {src.title} ({src.filename})
                          </span>
                          <span style={{
                            fontSize: '0.68rem',
                            padding: '0.1rem 0.35rem',
                            backgroundColor: '#dbeafe',
                            color: '#1d4ed8',
                            borderRadius: '3px'
                          }}>
                            Match: {(src.similarity * 100).toFixed(0)}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* User Avatar */}
            {isUser && (
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: '#2563eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                flexShrink: 0,
                marginTop: '0.25rem'
              }}>
                <User size={20} />
              </div>
            )}
          </div>
        );
      })}

      {/* Loading indicator */}
      {isLoading && (
        <div style={{
          display: 'flex',
          gap: '0.85rem',
          maxWidth: '850px',
          width: '100%',
          margin: '0 auto',
          alignSelf: 'flex-start',
          animation: 'fadeIn 0.25s ease'
        }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            backgroundColor: '#1e40af',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            flexShrink: 0
          }}>
            <Bot size={20} />
          </div>
          <div style={{
            backgroundColor: '#ffffff',
            padding: '0.85rem 1.25rem',
            borderRadius: '16px 16px 16px 4px',
            border: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}>
            <span style={{ fontSize: '0.8rem', color: '#64748b', marginRight: '0.2rem' }}>
              Assistant is thinking
            </span>
            <span className="typing-dot" />
            <span className="typing-dot" />
            <span className="typing-dot" />
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}

// Simple safe markdown formatter for bolding, bullet points, headers and code
function formatMarkdown(text, isUser) {
  if (!text) return '';
  if (isUser) {
    return text.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br/>');
  }

  let html = text
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    // Headers
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^#### (.*$)/gim, '<h4>$1</h4>')
    // Bold
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Code blocks
    .replace(/```(.*?)```/gs, '<pre><code>$1</code></pre>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // Bullet points
    .replace(/^\s*-\s+(.*$)/gim, '<li>$1</li>')
    .replace(/^\s*\*\s+(.*$)/gim, '<li>$1</li>');

  // Wrap loose li elements in ul
  html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
  // Newlines to paragraph breaks
  html = html.replace(/\n\n/g, '<br/><br/>').replace(/\n/g, '<br/>');

  return html;
}
