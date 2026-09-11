import React from 'react';
import { GraduationCap, RotateCcw, Brain, CheckCircle2, AlertCircle } from 'lucide-react';

export default function Header({ 
  activeMemory, 
  onResetMemory, 
  onOpenMemoryModal,
  backendConnected 
}) {
  const hasProfile = activeMemory && (activeMemory.department || activeMemory.year || activeMemory.student_name);

  return (
    <header style={{
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #e2e8f0',
      padding: '0.85rem 1.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 30,
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)'
    }}>
      {/* Title & Branding */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          boxShadow: '0 4px 6px -1px rgba(30, 64, 175, 0.25)'
        }}>
          <GraduationCap size={24} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <h1 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', letterSpacing: '-0.02em' }}>
              AI Student Support Assistant
            </h1>
            <span style={{
              fontSize: '0.7rem',
              fontWeight: 600,
              backgroundColor: '#eff6ff',
              color: '#1d4ed8',
              padding: '0.15rem 0.5rem',
              borderRadius: '9999px',
              border: '1px solid #bfdbfe'
            }}>
              SAMPLE DATA
            </span>
          </div>
          <p style={{ fontSize: '0.78rem', color: '#64748b' }}>
            ABC Institute of Technology • Academic Guidance, Calculators & Study Planner
          </p>
        </div>
      </div>

      {/* Action Controls & Memory Status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {/* Backend Connectivity Status */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.35rem',
          fontSize: '0.75rem',
          padding: '0.3rem 0.65rem',
          borderRadius: '9999px',
          backgroundColor: backendConnected ? '#ecfdf5' : '#fef2f2',
          color: backendConnected ? '#065f46' : '#991b1b',
          border: `1px solid ${backendConnected ? '#a7f3d0' : '#fecaca'}`
        }}>
          <span style={{
            width: '7px',
            height: '7px',
            borderRadius: '50%',
            backgroundColor: backendConnected ? '#10b981' : '#ef4444'
          }} />
          <span>{backendConnected ? 'Backend Connected' : 'Connecting...'}</span>
        </div>

        {/* Active Context / Memory Pill */}
        <button
          onClick={onOpenMemoryModal}
          title="View active conversational memory context"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.45rem 0.85rem',
            fontSize: '0.8rem',
            fontWeight: 500,
            borderRadius: '8px',
            border: '1px solid #cbd5e1',
            backgroundColor: hasProfile ? '#eff6ff' : '#ffffff',
            color: hasProfile ? '#1e40af' : '#475569',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          <Brain size={16} color={hasProfile ? '#2563eb' : '#64748b'} />
          <span>
            {hasProfile 
              ? `${activeMemory.student_name ? activeMemory.student_name + ' • ' : ''}${activeMemory.year || ''} ${activeMemory.department ? '(' + activeMemory.department.split('(')[1] || activeMemory.department : ''}`
              : 'Student Context (Empty)'}
          </span>
        </button>

        {/* Reset Memory Button */}
        <button
          onClick={onResetMemory}
          title="Reset conversation memory"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.45rem 0.75rem',
            fontSize: '0.8rem',
            fontWeight: 500,
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            backgroundColor: '#ffffff',
            color: '#dc2626',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#fef2f2'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#ffffff'; }}
        >
          <RotateCcw size={14} />
          <span>Clear Memory</span>
        </button>
      </div>
    </header>
  );
}
