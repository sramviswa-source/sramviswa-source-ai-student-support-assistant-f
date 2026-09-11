import React from 'react';
import { 
  Info, 
  Brain, 
  BookOpen, 
  Calculator, 
  ShieldCheck, 
  Cpu, 
  Layers, 
  GitBranch, 
  CheckCircle2,
  Users,
  Code2
} from 'lucide-react';

export default function AboutView() {
  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '2rem 1.5rem', maxWidth: '1000px', margin: '0 auto' }}>
      {/* Title */}
      <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.35rem 0.85rem',
          backgroundColor: '#eff6ff',
          color: '#1d4ed8',
          borderRadius: '9999px',
          fontSize: '0.78rem',
          fontWeight: 600,
          marginBottom: '0.75rem',
          border: '1px solid #bfdbfe'
        }}>
          <Cpu size={14} />
          <span>Agentic AI System Architecture</span>
        </div>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
          AI Student Support Assistant
        </h2>
        <p style={{ fontSize: '0.95rem', color: '#64748b', maxWidth: '680px', margin: '0 auto', lineHeight: 1.6 }}>
          A functional academic guidance web platform for ABC Institute of Technology [SAMPLE DATA] featuring Retrieval-Augmented Generation (RAG), computational tools, and contextual conversational memory.
        </p>
      </div>

      {/* Grid of Key Architecture Pillars */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.25rem',
        marginBottom: '2rem'
      }}>
        {/* RAG Card */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          padding: '1.5rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.85rem' }}>
            <div style={{ padding: '0.5rem', borderRadius: '8px', backgroundColor: '#eff6ff', color: '#2563eb' }}>
              <BookOpen size={20} />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>
              1. RAG & Knowledge Base
            </h3>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.6, marginBottom: '0.75rem' }}>
            Retrieval-Augmented Generation indexes sample institutional regulations (Attendance, Examinations, Passing, Internal Marks, Syllabus, Academic Calendar).
          </p>
          <ul style={{ paddingLeft: '1.2rem', fontSize: '0.8rem', color: '#334155', lineHeight: 1.5 }}>
            <li><strong>Strict Hallucination Prevention:</strong> Out-of-domain questions are rejected if below threshold.</li>
            <li><strong>Source Grounding:</strong> Answers cite specific documents (e.g., <code>attendance_regulations.txt</code>).</li>
            <li><strong>Zero External DB Burden:</strong> Lightweight local TF-IDF vector retrieval.</li>
          </ul>
        </div>

        {/* Tools Card */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          padding: '1.5rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.85rem' }}>
            <div style={{ padding: '0.5rem', borderRadius: '8px', backgroundColor: '#eff6ff', color: '#2563eb' }}>
              <Calculator size={20} />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>
              2. Computational Tools
            </h3>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.6, marginBottom: '0.75rem' }}>
            Autonomous tool calling routes calculations to deterministic Python engines:
          </p>
          <ul style={{ paddingLeft: '1.2rem', fontSize: '0.8rem', color: '#334155', lineHeight: 1.5 }}>
            <li><strong>Attendance Calculator:</strong> Evaluates <code>(attended / total) * 100</code> against 75% eligibility and condonation rules.</li>
            <li><strong>Marks Calculator:</strong> Maps percentages to 10-point grades (O, A+, A, B+, B, RA).</li>
            <li><strong>Study Planner:</strong> Produces personalized day-by-day study sessions and Pomodoro blocks.</li>
          </ul>
        </div>

        {/* Memory Card */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          padding: '1.5rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.85rem' }}>
            <div style={{ padding: '0.5rem', borderRadius: '8px', backgroundColor: '#eff6ff', color: '#2563eb' }}>
              <Brain size={20} />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>
              3. Conversational Memory
            </h3>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.6, marginBottom: '0.75rem' }}>
            Tracks useful student context across multi-turn interactions:
          </p>
          <ul style={{ paddingLeft: '1.2rem', fontSize: '0.8rem', color: '#334155', lineHeight: 1.5 }}>
            <li><strong>Profile Extraction:</strong> Retains student name, department (CSE), year (3rd Year), and semester.</li>
            <li><strong>Curriculum Auto-Enrichment:</strong> Auto-populates 3rd-year CSE subjects for personalized study schedules.</li>
            <li><strong>Privacy First:</strong> Passwords, payment, and medical details are redacted and discarded.</li>
          </ul>
        </div>
      </div>

      {/* Agent Workflow Section */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        padding: '1.75rem',
        marginBottom: '2rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <GitBranch size={20} color="#2563eb" />
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a' }}>
            Agent Decision Workflow
          </h3>
        </div>

        <div style={{
          backgroundColor: '#f8fafc',
          padding: '1.25rem',
          borderRadius: '8px',
          fontFamily: 'monospace',
          fontSize: '0.82rem',
          lineHeight: 1.7,
          color: '#334155',
          border: '1px solid #e2e8f0'
        }}>
          <div>[1] Student Query Received</div>
          <div style={{ paddingLeft: '1.5rem' }}>↓ Extract non-sensitive student profile facts into Session Memory</div>
          <div>[2] Intent Detection & Routing</div>
          <div style={{ paddingLeft: '1.5rem' }}>├─ Attendance calculation? → Extract numbers → Run Attendance Tool</div>
          <div style={{ paddingLeft: '1.5rem' }}>├─ Marks / score? → Extract numbers → Run Marks Tool (10-point scale)</div>
          <div style={{ paddingLeft: '1.5rem' }}>├─ Study schedule? → Inject subjects from Memory → Run Study Planner Tool</div>
          <div style={{ paddingLeft: '1.5rem' }}>└─ College regulation / syllabus? → Search Knowledge Base (RAG)</div>
          <div>[3] RAG Retrieval & Verification</div>
          <div style={{ paddingLeft: '1.5rem' }}>├─ High Confidence Match (&gt;= 0.12 threshold &amp; 40% coverage)? → Synthesize grounded answer + Citations</div>
          <div style={{ paddingLeft: '1.5rem' }}>└─ Out of domain / Low confidence? → Explicitly state information is unavailable (NO Hallucination)</div>
          <div>[4] Return Structured Response with Citations &amp; Tool Traces to User</div>
        </div>
      </div>

      {/* Technologies & Team */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.25rem'
      }}>
        {/* Technologies */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          padding: '1.5rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
            <Code2 size={18} color="#2563eb" />
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>
              Technology Stack
            </h4>
          </div>
          <ul style={{ paddingLeft: '1.2rem', fontSize: '0.82rem', color: '#475569', lineHeight: 1.6 }}>
            <li><strong>Frontend:</strong> React 18, Vite, Lucide Icons, Modern CSS</li>
            <li><strong>Backend:</strong> Python 3.14, FastAPI, Uvicorn, Pydantic V2</li>
            <li><strong>AI / LLM Integration:</strong> Google Gemini API / OpenAI API / Deterministic Local Engine</li>
            <li><strong>RAG:</strong> TF-IDF Vector Space Model &amp; Cosine Similarity Search</li>
            <li><strong>Testing:</strong> Pytest automated test suite (26 passing tests)</li>
          </ul>
        </div>

        {/* Project Info */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          padding: '1.5rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
            <Users size={18} color="#2563eb" />
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>
              Academic Project Details
            </h4>
          </div>
          <p style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.6, marginBottom: '0.5rem' }}>
            <strong>Project Title:</strong> AI Student Support Assistant
          </p>
          <p style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.6, marginBottom: '0.5rem' }}>
            <strong>Institution:</strong> ABC Institute of Technology [SAMPLE DATA]
          </p>
          <p style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.6, marginBottom: '0.5rem' }}>
            <strong>Department:</strong> Computer Science and Engineering
          </p>
          <p style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.6 }}>
            <strong>Status:</strong> Functional Prototype (Verified with 6 Demo Scenarios)
          </p>
        </div>
      </div>
    </div>
  );
}
