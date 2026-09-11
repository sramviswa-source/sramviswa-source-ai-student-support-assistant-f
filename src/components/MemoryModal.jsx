import React from 'react';
import { Brain, RotateCcw, X, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function MemoryModal({ 
  isOpen, 
  onClose, 
  activeMemory, 
  onResetMemory 
}) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
      zIndex: 60
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        maxWidth: '550px',
        width: '100%',
        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{
          padding: '1rem 1.25rem',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Brain size={20} color="#2563eb" />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>
              Conversational Memory State
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{
              border: 'none',
              backgroundColor: 'transparent',
              fontSize: '1.25rem',
              color: '#64748b',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '65vh', overflowY: 'auto' }}>
          <p style={{ fontSize: '0.82rem', color: '#64748b' }}>
            The assistant retains non-sensitive student profile details provided during the conversation to personalize responses and study plans.
          </p>

          <div style={{
            backgroundColor: '#f8fafc',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.65rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span style={{ fontWeight: 600, color: '#475569' }}>Student Name:</span>
              <span style={{ color: activeMemory?.student_name ? '#0f172a' : '#94a3b8', fontWeight: 500 }}>
                {activeMemory?.student_name || '(Not set)'}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span style={{ fontWeight: 600, color: '#475569' }}>Department:</span>
              <span style={{ color: activeMemory?.department ? '#0f172a' : '#94a3b8', fontWeight: 500 }}>
                {activeMemory?.department || '(Not set)'}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span style={{ fontWeight: 600, color: '#475569' }}>Academic Year:</span>
              <span style={{ color: activeMemory?.year ? '#0f172a' : '#94a3b8', fontWeight: 500 }}>
                {activeMemory?.year || '(Not set)'}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span style={{ fontWeight: 600, color: '#475569' }}>Semester:</span>
              <span style={{ color: activeMemory?.semester ? '#0f172a' : '#94a3b8', fontWeight: 500 }}>
                {activeMemory?.semester || '(Not set)'}
              </span>
            </div>

            <div style={{ fontSize: '0.85rem' }}>
              <span style={{ fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.35rem' }}>
                Active Subjects Context ({activeMemory?.subjects?.length || 0}):
              </span>
              {activeMemory?.subjects?.length > 0 ? (
                <ul style={{ paddingLeft: '1.25rem', fontSize: '0.8rem', color: '#1e3a8a' }}>
                  {activeMemory.subjects.map((s, idx) => (
                    <li key={idx}>{s}</li>
                  ))}
                </ul>
              ) : (
                <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>(No subjects active in memory)</span>
              )}
            </div>
          </div>

          {/* Privacy Guarantee */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.65rem 0.85rem',
            backgroundColor: '#ecfdf5',
            borderRadius: '6px',
            border: '1px solid #a7f3d0',
            fontSize: '0.78rem',
            color: '#065f46'
          }}>
            <ShieldAlert size={16} color="#059669" flexShrink={0} />
            <span>Strict Privacy Rule: No passwords, payment cards, or health records are ever stored.</span>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '0.85rem 1.25rem',
          borderTop: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <button
            onClick={() => {
              onResetMemory();
              onClose();
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.45rem 0.85rem',
              backgroundColor: '#fef2f2',
              color: '#dc2626',
              border: '1px solid #fecaca',
              borderRadius: '6px',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <RotateCcw size={14} />
            <span>Reset Memory</span>
          </button>

          <button
            onClick={onClose}
            style={{
              padding: '0.45rem 1.25rem',
              backgroundColor: '#2563eb',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
