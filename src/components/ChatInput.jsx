import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Calculator, BookOpen, Calendar } from 'lucide-react';

export default function ChatInput({ onSendMessage, isLoading }) {
  const [input, setInput] = useState('');
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 140)}px`;
    }
  }, [input]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSendMessage(input.trim());
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const insertTemplate = (template) => {
    setInput(template);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  return (
    <div style={{
      backgroundColor: '#ffffff',
      borderTop: '1px solid #e2e8f0',
      padding: '0.85rem 1.5rem',
      position: 'relative'
    }}>
      {/* Quick Tool Helper Action Chips */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        marginBottom: '0.65rem',
        overflowX: 'auto',
        paddingBottom: '0.2rem'
      }}>
        <span style={{ fontSize: '0.7rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase' }}>
          Quick Action:
        </span>
        <button
          type="button"
          onClick={() => insertTemplate("I attended 45 out of 50 classes. Calculate my attendance.")}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
            padding: '0.25rem 0.6rem',
            backgroundColor: '#f8fafc',
            border: '1px solid #cbd5e1',
            borderRadius: '9999px',
            fontSize: '0.72rem',
            color: '#334155',
            cursor: 'pointer',
            whiteSpace: 'nowrap'
          }}
        >
          <Calculator size={12} color="#2563eb" />
          <span>Attendance Calc</span>
        </button>

        <button
          type="button"
          onClick={() => insertTemplate("I scored 78 out of 100. What is my percentage?")}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
            padding: '0.25rem 0.6rem',
            backgroundColor: '#f8fafc',
            border: '1px solid #cbd5e1',
            borderRadius: '9999px',
            fontSize: '0.72rem',
            color: '#334155',
            cursor: 'pointer',
            whiteSpace: 'nowrap'
          }}
        >
          <Calculator size={12} color="#2563eb" />
          <span>Marks Calc</span>
        </button>

        <button
          type="button"
          onClick={() => insertTemplate("Create a 7-day study plan for me.")}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
            padding: '0.25rem 0.6rem',
            backgroundColor: '#f8fafc',
            border: '1px solid #cbd5e1',
            borderRadius: '9999px',
            fontSize: '0.72rem',
            color: '#334155',
            cursor: 'pointer',
            whiteSpace: 'nowrap'
          }}
        >
          <Calendar size={12} color="#2563eb" />
          <span>Study Plan</span>
        </button>

        <button
          type="button"
          onClick={() => insertTemplate("What is the minimum attendance requirement?")}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
            padding: '0.25rem 0.6rem',
            backgroundColor: '#f8fafc',
            border: '1px solid #cbd5e1',
            borderRadius: '9999px',
            fontSize: '0.72rem',
            color: '#334155',
            cursor: 'pointer',
            whiteSpace: 'nowrap'
          }}
        >
          <BookOpen size={12} color="#2563eb" />
          <span>Attendance Policy</span>
        </button>
      </div>

      {/* Textarea Form */}
      <form onSubmit={handleSubmit} style={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: '0.75rem',
        backgroundColor: '#f8fafc',
        border: '1px solid #cbd5e1',
        borderRadius: '12px',
        padding: '0.5rem 0.75rem',
        boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.02)'
      }}>
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a question about college rules, calculate attendance/marks, or say 'I am a CSE 3rd-year student'..."
          rows={1}
          disabled={isLoading}
          style={{
            flex: 1,
            border: 'none',
            outline: 'none',
            resize: 'none',
            backgroundColor: 'transparent',
            fontSize: '0.88rem',
            fontFamily: 'inherit',
            lineHeight: 1.5,
            color: '#0f172a',
            padding: '0.35rem 0',
            maxHeight: '130px'
          }}
        />

        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          style={{
            backgroundColor: !input.trim() || isLoading ? '#94a3b8' : '#2563eb',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: !input.trim() || isLoading ? 'not-allowed' : 'pointer',
            flexShrink: 0,
            transition: 'background-color 0.15s ease'
          }}
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
