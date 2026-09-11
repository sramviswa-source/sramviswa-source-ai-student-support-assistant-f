# AI Student Support Assistant

> **Agentic AI Web Application for College Students**  
> *College Name: ABC Institute of Technology [SAMPLE DATA]*

---

## 📌 Problem Statement & Objective
College students often face difficulties quickly finding verified academic policies, calculating attendance margins against mandatory minimums, determining grade boundaries, or planning balanced revision schedules. Information is typically scattered across college handbooks, circulars, and departmental portals.

The **AI Student Support Assistant** solves this by providing:
1. Grounded **Retrieval-Augmented Generation (RAG)** over college policies (attendance rules, exam protocols, passing standards, syllabus).
2. Autonomous **Computational Tools** (attendance margin calculator, marks percentage & 10-point grade classifier, and personalized multi-day study schedule planner).
3. **Conversational Context Memory** tracking student year, department, and subjects to personalize advice without requiring repeated explanations.
4. Strict **Non-Hallucination Guardrails**: If an inquiry falls outside the institutional knowledge base, the assistant explicitly states that the policy is unavailable and refers the student to official authorities.

---

## 🏗️ System Architecture

```
                                    +------------------------------+
                                    |    Student Web Browser       |
                                    |  (React 18 + Vite Dashboard) |
                                    +--------------+---------------+
                                                   |
                                                   | REST API (HTTP / JSON)
                                                   v
+--------------------------------------------------------------------------------------------------+
|                                    FastAPI Backend Service                                       |
|                                                                                                  |
|   +-------------------+         +-----------------------+         +--------------------------+   |
|   |   Intent Router   | ------->|  Session Memory Store | <------>| Active Profile Context   |   |
|   +---------+---------+         +-----------------------+         +--------------------------+   |
|             |                                                                                    |
|             +---------------------------------------+-----------------------------+              |
|             |                                       |                             |              |
|             v                                       v                             v              |
|   +-------------------+                   +-------------------+         +--------------------+   |
|   | RAG Engine        |                   | Academic Tools    |         | LLM Response Synthesizer|
|   | - TF-IDF Vectors  |                   | - Attendance Calc |         | - Google Gemini    |   |
|   | - Cosine Similarity                   | - Marks / Grade   |         | - OpenAI           |   |
|   | - Confidence Gate |                   | - Study Planner   |         | - Grounded Local   |   |
|   +---------+---------+                   +---------+---------+         +----------+---------+   |
|             |                                       |                              |             |
|             +---------------------------------------+------------------------------+             |
|                                                     |                                            |
|                                                     v                                            |
|                                      Final Grounded Response & Traces                            |
+--------------------------------------------------------------------------------------------------+
```

---

## 🔑 Core Features

### 1. AI Chat Assistant
- Natural language dialog with intent classification.
- Real-time tool execution badges with step-by-step mathematical formulas.
- Source citation cards referencing verified institutional documents.
- Typing indicator and resilient error handling.

### 2. Retrieval-Augmented Generation (RAG)
- Indexes sample policy documents located in `knowledge_base/`:
  - `attendance_regulations.txt`: 75% minimum attendance rule, condonation band (65%–74%), detention policy.
  - `examination_rules.txt`: Hall ticket requirements, barred devices, 10-minute grace window.
  - `internal_assessment.txt`: Continuous Internal Assessment (40:60 weightage), best-2 test average.
  - `passing_requirements.txt`: 50% aggregate minimum, 45% external exam minimum, 10-point letter grades.
  - `academic_calendar.txt`: Key semester dates, internal test windows, symposium, final exams.
  - `departments.txt`: Department profiles, HOD contacts, specialized research facilities.
  - `syllabus_cse.txt`: 3rd-year CSE core subjects (OS, DBMS, Networks, Automata, Web Tech).
  - `student_faq.txt`: Bonafide certificates, duplicate ID cards, hostel timings, library hours.
- Lightweight, explainable TF-IDF Vector Space Model & Cosine Similarity search with coverage gating to prevent false positives.

### 3. Computational Tools
- **Attendance Calculator**: Computes `(attended / total) * 100`. Compares against the 75% threshold and calculates how many consecutive upcoming classes must be attended to regain eligibility or how many can be safely missed.
- **Marks & Percentage Calculator**: Computes `(obtained / max) * 100` and maps to the official 10-point academic letter grade (`O`, `A+`, `A`, `B+`, `B`, `RA`).
- **Personalized Study Plan Generator**: Distributes daily study hours across subjects into deep-work blocks, practice sessions, and active recall revision. Automatically leverages student curriculum from memory.

### 4. Conversational Memory
- Captures student profile parameters (`student_name`, `department`, `year`, `semester`, `subjects`, `study_preferences`).
- Redacts and rejects sensitive data (passwords, payment cards, health records).
- One-click memory reset via header or sidebar modal.

---

## 💻 Technology Stack

| Layer | Technologies Used |
|---|---|
| **Frontend** | React 18, Vite 5, Lucide React Icons, Modern Responsive CSS |
| **Backend** | Python 3.14 / 3.10+, FastAPI, Uvicorn, Pydantic V2 |
| **Retrieval (RAG)** | Local Vector Space Model (TF-IDF + Cosine Similarity + Token Coverage Filter) |
| **AI Providers** | Configurable: Google Gemini (`gemini-1.5-flash`), OpenAI (`gpt-4o-mini`), or Built-in Grounded Local Engine |
| **Testing** | Pytest Test Suite (26 automated test cases) |

---

## 🚀 Installation & Setup

### Prerequisites
- **Python 3.10+** (Tested on Python 3.14)
- **Node.js 18+** and **npm**

### Step 1: Clone or Open Repository
```bash
cd "d:\AI student support system"
```

### Step 2: Set Up Backend
```bash
# Install backend dependencies
python -m pip install -r backend/requirements.txt
```

### Step 3: Set Up Frontend
```bash
cd frontend
npm.cmd install
cd ..
```

### Step 4: Environment Variables (Optional)
Copy `.env.example` to `.env`:
```env
LLM_PROVIDER=local
GEMINI_API_KEY=
OPENAI_API_KEY=
HOST=127.0.0.1
PORT=8000
```
> [!NOTE]
> The application works immediately out-of-the-box in `local` mode with zero external API keys needed! If you have a Google Gemini or OpenAI key, paste it into `.env` to enable cloud LLM synthesis.

---

## ▶️ Running the Application

### Option A: One-Click Windows Launcher
Double-click `run_app.bat` or run:
```cmd
run_app.bat
```

### Option B: Manual Execution in Two Terminals

#### Terminal 1 — Backend (FastAPI):
```bash
python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload
```
Backend API will be available at: `http://127.0.0.1:8000`  
Swagger API Documentation: `http://127.0.0.1:8000/docs`

#### Terminal 2 — Frontend (React / Vite):
```bash
cd frontend
npm.cmd run dev
```
Open your browser at: `http://localhost:5173`

---

## 🧪 Running Automated Tests

Run the complete test suite verifying all tools, RAG precision, memory, and demo scenarios:
```bash
python -m pytest backend/tests -v
```
Output:
```
backend/tests/test_api.py ...........                                    [ 42%]
backend/tests/test_memory.py ...                                         [ 53%]
backend/tests/test_rag.py ....                                           [ 69%]
backend/tests/test_tools.py ........                                     [100%]
======================= 26 passed, 2 warnings in 0.89s ========================
```

---

## 📋 Verified Demo Scenarios

| Scenario | Input Prompt | Expected System Behavior |
|---|---|---|
| **DEMO 1: Attendance Policy** | *"What is the minimum attendance requirement?"* | RAG retrieves `attendance_regulations.txt`. Cites minimum 75% rule, condonation band (65-74%), and course detention. |
| **DEMO 2: Attendance Calculator** | *"I attended 45 out of 50 classes. Calculate my attendance."* | Calls Attendance Tool. Outputs `90.0%` with formula `(45 / 50) * 100 = 90.0%` and eligibility status. |
| **DEMO 3: Marks Calculator** | *"I scored 78 out of 100. What is my percentage?"* | Calls Marks Tool. Outputs `78.0%` with letter grade `A (Very Good)` and passing status. |
| **DEMO 4: Study Plan Generator** | *"I have 7 days to prepare for 5 subjects. Create a study plan."* | Calls Study Planner. Outputs day-by-day revision modules and Pomodoro suggestions. |
| **DEMO 5: Contextual Memory** | Turn 1: *"I am a CSE third-year student."*<br>Turn 2: *"Create a study plan for me."* | Extracts CSE 3rd-year profile into memory, automatically populates CSE Semester 5 curriculum subjects into the study plan. |
| **DEMO 6: Strict Non-Hallucination** | *"What is the fee for enrolling in the space astronaut spaceship certification course?"* | RAG similarity & coverage filter triggers. Declares information unavailable and advises contacting college authorities. |

---

## ⚠️ Known Limitations
- Current RAG indexing is in-memory and scans `.txt` documents on startup.
- Multi-user authentication is currently session-based rather than tied to a persistent institutional database.

---

## 🔮 Future Enhancements
1. **College ERP Integration**: Direct synchronization with college database for real-time student marks and attendance logs.
2. **Document Ingestion Portal**: Drag-and-drop PDF syllabus and circular ingestion with automatic text extraction.
3. **Multilingual Support**: Tamil and English bilingual conversational support for state universities.
4. **Voice Assistance**: Speech-to-text input and voice response readout for accessibility.
5. **Mobile Application**: React Native / Flutter cross-platform companion app with push notifications for exam alerts.
