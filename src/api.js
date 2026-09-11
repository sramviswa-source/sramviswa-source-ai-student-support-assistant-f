/**
 * API client connecting the React frontend to the FastAPI backend.
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

export async function checkBackendHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Health check failed:', err);
    return null;
  }
}

export async function sendChatMessage(message, sessionId = 'default') {
  const res = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, session_id: sessionId })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Network request failed' }));
    throw new Error(err.detail || `Server error (${res.status})`);
  }
  return await res.json();
}

export async function calculateAttendance(attendedClasses, totalClasses) {
  const res = await fetch(`${API_BASE}/tools/attendance`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      attended_classes: Number(attendedClasses),
      total_classes: Number(totalClasses)
    })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Calculation failed' }));
    throw new Error(err.detail || `Error (${res.status})`);
  }
  return await res.json();
}

export async function calculatePercentage(marksObtained, maximumMarks) {
  const res = await fetch(`${API_BASE}/tools/percentage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      marks_obtained: Number(marksObtained),
      maximum_marks: Number(maximumMarks)
    })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Calculation failed' }));
    throw new Error(err.detail || `Error (${res.status})`);
  }
  return await res.json();
}

export async function generateStudyPlan(subjects, preparationDays, availableHoursPerDay, sessionId = 'default') {
  const res = await fetch(`${API_BASE}/tools/study-plan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      subjects: subjects || [],
      preparation_days: Number(preparationDays),
      available_hours_per_day: Number(availableHoursPerDay),
      session_id: sessionId
    })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Planner failed' }));
    throw new Error(err.detail || `Error (${res.status})`);
  }
  return await res.json();
}

export async function getKnowledgeBaseDocs() {
  const res = await fetch(`${API_BASE}/kb/documents`);
  if (!res.ok) throw new Error('Failed to fetch knowledge base documents');
  return await res.json();
}

export async function getDocumentContent(filename) {
  const res = await fetch(`${API_BASE}/kb/document/${encodeURIComponent(filename)}`);
  if (!res.ok) throw new Error(`Failed to load document: ${filename}`);
  return await res.json();
}

export async function searchKnowledgeBase(query, topK = 3) {
  const res = await fetch(`${API_BASE}/kb/search`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, top_k: topK })
  });
  if (!res.ok) throw new Error('Knowledge base search failed');
  return await res.json();
}

export async function getSessionMemory(sessionId = 'default') {
  const res = await fetch(`${API_BASE}/memory?session_id=${encodeURIComponent(sessionId)}`);
  if (!res.ok) throw new Error('Failed to fetch session memory');
  return await res.json();
}

export async function resetSessionMemory(sessionId = 'default') {
  const res = await fetch(`${API_BASE}/memory/reset`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ session_id: sessionId })
  });
  if (!res.ok) throw new Error('Failed to reset memory');
  return await res.json();
}
