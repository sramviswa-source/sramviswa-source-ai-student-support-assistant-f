import React, { useState } from 'react';
import { 
  Calculator, 
  Percent, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Sparkles,
  ArrowRight,
  BookOpen
} from 'lucide-react';
import { calculateAttendance, calculatePercentage, generateStudyPlan } from '../api';

export default function ToolsView({ activeMemory }) {
  const [activeTab, setActiveTab] = useState('attendance');

  // Attendance State
  const [attendedInput, setAttendedInput] = useState(45);
  const [totalInput, setTotalInput] = useState(50);
  const [attendanceResult, setAttendanceResult] = useState(null);
  const [attError, setAttError] = useState('');

  // Marks State
  const [marksInput, setMarksInput] = useState(78);
  const [maxMarksInput, setMaxMarksInput] = useState(100);
  const [marksResult, setMarksResult] = useState(null);
  const [marksError, setMarksError] = useState('');

  // Study Plan State
  const [planSubjects, setPlanSubjects] = useState(
    activeMemory?.subjects?.length > 0
      ? activeMemory.subjects.join(', ')
      : "Operating Systems, Database Systems, Computer Networks, Theory of Computation, Web Technology"
  );
  const [planDays, setPlanDays] = useState(7);
  const [planHours, setPlanHours] = useState(4);
  const [studyPlanResult, setStudyPlanResult] = useState(null);
  const [planError, setPlanError] = useState('');
  const [isPlanning, setIsPlanning] = useState(false);

  // Handle Attendance Calculation
  const handleCalcAttendance = async (e) => {
    e.preventDefault();
    setAttError('');
    try {
      const res = await calculateAttendance(attendedInput, totalInput);
      setAttendanceResult(res);
    } catch (err) {
      setAttError(err.message);
      setAttendanceResult(null);
    }
  };

  // Handle Marks Calculation
  const handleCalcMarks = async (e) => {
    e.preventDefault();
    setMarksError('');
    try {
      const res = await calculatePercentage(marksInput, maxMarksInput);
      setMarksResult(res);
    } catch (err) {
      setMarksError(err.message);
      setMarksResult(null);
    }
  };

  // Handle Study Plan Generation
  const handleGeneratePlan = async (e) => {
    e.preventDefault();
    setPlanError('');
    setIsPlanning(true);
    try {
      const subjs = planSubjects.split(',').map(s => s.trim()).filter(Boolean);
      const res = await generateStudyPlan(subjs, planDays, planHours);
      setStudyPlanResult(res);
    } catch (err) {
      setPlanError(err.message);
      setStudyPlanResult(null);
    } finally {
      setIsPlanning(false);
    }
  };

  const loadMemorySubjects = () => {
    if (activeMemory?.subjects?.length > 0) {
      setPlanSubjects(activeMemory.subjects.join(', '));
    }
  };

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', maxWidth: '1000px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
          <Calculator size={24} color="#2563eb" />
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0f172a' }}>
            Academic Calculator & Planning Suite
          </h2>
        </div>
        <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
          Interactive computational tools configured with ABC Institute of Technology regulations.
        </p>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        borderBottom: '1px solid #e2e8f0',
        marginBottom: '1.5rem',
        paddingBottom: '0.2rem'
      }}>
        {[
          { id: 'attendance', label: 'Attendance Calculator', icon: Percent },
          { id: 'marks', label: 'Marks & Grade Calculator', icon: Calculator },
          { id: 'plan', label: 'Study Schedule Generator', icon: Calendar }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.65rem 1.15rem',
                border: 'none',
                borderBottom: isActive ? '2px solid #2563eb' : '2px solid transparent',
                backgroundColor: 'transparent',
                color: isActive ? '#2563eb' : '#64748b',
                fontWeight: isActive ? 600 : 500,
                fontSize: '0.88rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <Icon size={16} color={isActive ? '#2563eb' : '#64748b'} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. ATTENDANCE CALCULATOR */}
      {activeTab === 'attendance' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {/* Input Form */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            padding: '1.5rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
          }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>
              Attendance Inputs
            </h3>
            <form onSubmit={handleCalcAttendance} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                  Attended Classes:
                </label>
                <input
                  type="number"
                  min="0"
                  value={attendedInput}
                  onChange={(e) => setAttendedInput(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.75rem',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.9rem'
                  }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                  Total Classes Conducted:
                </label>
                <input
                  type="number"
                  min="1"
                  value={totalInput}
                  onChange={(e) => setTotalInput(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.75rem',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.9rem'
                  }}
                  required
                />
              </div>

              {attError && (
                <div style={{ padding: '0.5rem', backgroundColor: '#fef2f2', color: '#dc2626', borderRadius: '6px', fontSize: '0.8rem' }}>
                  {attError}
                </div>
              )}

              <button
                type="submit"
                style={{
                  padding: '0.65rem',
                  backgroundColor: '#2563eb',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  marginTop: '0.5rem'
                }}
              >
                Calculate Attendance
              </button>
            </form>
          </div>

          {/* Results Output */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            padding: '1.5rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            {attendanceResult ? (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>
                    Calculated Standing
                  </span>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '0.2rem 0.6rem',
                    borderRadius: '9999px',
                    backgroundColor: attendanceResult.percentage >= 75 ? '#ecfdf5' : attendanceResult.percentage >= 65 ? '#fffbeb' : '#fef2f2',
                    color: attendanceResult.percentage >= 75 ? '#065f46' : attendanceResult.percentage >= 65 ? '#92400e' : '#991b1b'
                  }}>
                    {attendanceResult.status}
                  </span>
                </div>

                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#1e3a8a', marginBottom: '0.5rem' }}>
                  {attendanceResult.percentage.toFixed(1)}%
                </div>

                {/* Progress bar */}
                <div style={{ width: '100%', height: '10px', backgroundColor: '#e2e8f0', borderRadius: '9999px', overflow: 'hidden', marginBottom: '1rem' }}>
                  <div style={{
                    width: `${Math.min(attendanceResult.percentage, 100)}%`,
                    height: '100%',
                    backgroundColor: attendanceResult.percentage >= 75 ? '#10b981' : attendanceResult.percentage >= 65 ? '#f59e0b' : '#ef4444',
                    transition: 'width 0.4s ease'
                  }} />
                </div>

                <div style={{
                  padding: '0.65rem 0.85rem',
                  backgroundColor: '#f8fafc',
                  borderRadius: '6px',
                  border: '1px solid #e2e8f0',
                  fontFamily: 'monospace',
                  fontSize: '0.85rem',
                  color: '#0f172a',
                  marginBottom: '1rem'
                }}>
                  Formula: {attendanceResult.calculation_formula}
                </div>

                <p style={{ fontSize: '0.85rem', color: '#334155', lineHeight: 1.5, marginBottom: '0.5rem' }}>
                  {attendanceResult.message}
                </p>
                <p style={{ fontSize: '0.82rem', color: '#2563eb', fontWeight: 500 }}>
                  {attendanceResult.advice}
                </p>
              </div>
            ) : (
              <div style={{ textAlign: 'center', color: '#94a3b8' }}>
                <Percent size={48} style={{ margin: '0 auto 0.75rem', opacity: 0.5 }} />
                <p style={{ fontSize: '0.88rem' }}>Enter attended and total classes to view your attendance percentage and eligibility.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. MARKS & GRADE CALCULATOR */}
      {activeTab === 'marks' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            padding: '1.5rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
          }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>
              Marks & Score Inputs
            </h3>
            <form onSubmit={handleCalcMarks} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                  Marks Obtained:
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={marksInput}
                  onChange={(e) => setMarksInput(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.75rem',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.9rem'
                  }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                  Maximum Marks:
                </label>
                <input
                  type="number"
                  min="1"
                  step="0.5"
                  value={maxMarksInput}
                  onChange={(e) => setMaxMarksInput(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.75rem',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.9rem'
                  }}
                  required
                />
              </div>

              {marksError && (
                <div style={{ padding: '0.5rem', backgroundColor: '#fef2f2', color: '#dc2626', borderRadius: '6px', fontSize: '0.8rem' }}>
                  {marksError}
                </div>
              )}

              <button
                type="submit"
                style={{
                  padding: '0.65rem',
                  backgroundColor: '#2563eb',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  marginTop: '0.5rem'
                }}
              >
                Calculate Percentage & Grade
              </button>
            </form>
          </div>

          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            padding: '1.5rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            {marksResult ? (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>
                    Evaluation Result
                  </span>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '0.2rem 0.6rem',
                    borderRadius: '9999px',
                    backgroundColor: marksResult.status === 'Passed' ? '#ecfdf5' : '#fef2f2',
                    color: marksResult.status === 'Passed' ? '#065f46' : '#991b1b'
                  }}>
                    {marksResult.status}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#1e3a8a' }}>
                    {marksResult.percentage.toFixed(2)}%
                  </div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#2563eb' }}>
                    Grade {marksResult.grade}
                  </div>
                </div>

                <div style={{
                  padding: '0.65rem 0.85rem',
                  backgroundColor: '#f8fafc',
                  borderRadius: '6px',
                  border: '1px solid #e2e8f0',
                  fontFamily: 'monospace',
                  fontSize: '0.85rem',
                  color: '#0f172a',
                  marginBottom: '1rem'
                }}>
                  Formula: {marksResult.calculation_formula}
                </div>

                <p style={{ fontSize: '0.85rem', color: '#334155', lineHeight: 1.5 }}>
                  {marksResult.message}
                </p>
              </div>
            ) : (
              <div style={{ textAlign: 'center', color: '#94a3b8' }}>
                <Calculator size={48} style={{ margin: '0 auto 0.75rem', opacity: 0.5 }} />
                <p style={{ fontSize: '0.88rem' }}>Enter marks obtained and maximum marks to evaluate percentage and 10-point college letter grade.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. STUDY SCHEDULE GENERATOR */}
      {activeTab === 'plan' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            padding: '1.5rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
          }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>
              Study Schedule Parameters
            </h3>

            <form onSubmit={handleGeneratePlan} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#334155' }}>
                    Subjects (comma-separated):
                  </label>
                  {activeMemory?.subjects?.length > 0 && (
                    <button
                      type="button"
                      onClick={loadMemorySubjects}
                      style={{
                        border: 'none',
                        backgroundColor: 'transparent',
                        color: '#2563eb',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      Use Profile Subjects ({activeMemory.subjects.length})
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  value={planSubjects}
                  onChange={(e) => setPlanSubjects(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.75rem',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.88rem'
                  }}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                    Preparation Days:
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={planDays}
                    onChange={(e) => setPlanDays(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.6rem 0.75rem',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.88rem'
                    }}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                    Available Study Hours Per Day:
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="16"
                    step="0.5"
                    value={planHours}
                    onChange={(e) => setPlanHours(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.6rem 0.75rem',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.88rem'
                    }}
                    required
                  />
                </div>
              </div>

              {planError && (
                <div style={{ padding: '0.5rem', backgroundColor: '#fef2f2', color: '#dc2626', borderRadius: '6px', fontSize: '0.8rem' }}>
                  {planError}
                </div>
              )}

              <button
                type="submit"
                disabled={isPlanning}
                style={{
                  padding: '0.65rem',
                  backgroundColor: '#2563eb',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  cursor: isPlanning ? 'not-allowed' : 'pointer'
                }}
              >
                {isPlanning ? 'Generating Schedule...' : 'Generate Personalized Study Schedule'}
              </button>
            </form>
          </div>

          {/* Generated Plan Output */}
          {studyPlanResult && (
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              padding: '1.5rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a' }}>
                  {studyPlanResult.preparation_days}-Day Structured Study Plan
                </h3>
                <span style={{
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  padding: '0.25rem 0.65rem',
                  backgroundColor: '#eff6ff',
                  color: '#1d4ed8',
                  borderRadius: '9999px',
                  border: '1px solid #bfdbfe'
                }}>
                  {studyPlanResult.total_study_hours} Total Hours ({studyPlanResult.available_hours_per_day} hrs/day)
                </span>
              </div>

              {/* Day-by-Day Cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {studyPlanResult.schedule.map((day) => (
                  <div
                    key={day.day}
                    style={{
                      padding: '1rem',
                      backgroundColor: '#f8fafc',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1e3a8a' }}>
                        Day {day.day}: {day.focus_subject}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        {day.hours} Hours
                      </span>
                    </div>
                    <ul style={{ paddingLeft: '1.25rem', fontSize: '0.82rem', color: '#334155', lineHeight: 1.5 }}>
                      {day.session_breakdown.map((s, sIdx) => (
                        <li key={sIdx}>{s}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Recommendations */}
              <div style={{ marginTop: '1.25rem', padding: '1rem', backgroundColor: '#eff6ff', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e40af', marginBottom: '0.4rem' }}>
                  Preparation Tips & Best Practices:
                </h4>
                <ul style={{ paddingLeft: '1.25rem', fontSize: '0.8rem', color: '#1e3a8a', lineHeight: 1.5 }}>
                  {studyPlanResult.recommendations.map((rec, rIdx) => (
                    <li key={rIdx}>{rec}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
