import re
from typing import Any

# Sensitive patterns that must never be retained in memory
SENSITIVE_PATTERNS = [
    r"password[:\s=]+[^\s]+",
    r"pin[:\s=]+\d+",
    r"cvv[:\s=]+\d+",
    r"\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b",  # Credit/Debit card numbers
    r"\b\d{9,18}\b\s*(bank|account)",
    r"(medical history|diagnosis|prescription|doctor notes)"
]

# Syllabus subject presets for automatic student context enrichment
DEPARTMENT_PRESETS = {
    ("cse", "3"): [
        "Operating Systems (CS3501)",
        "Database Management Systems (CS3502)",
        "Computer Networks (CS3503)",
        "Theory of Computation (CS3504)",
        "Web Technology (CS3505)"
    ],
    ("cse", "5"): [
        "Operating Systems (CS3501)",
        "Database Management Systems (CS3502)",
        "Computer Networks (CS3503)",
        "Theory of Computation (CS3504)",
        "Web Technology (CS3505)"
    ],
    ("cse", "6"): [
        "Artificial Intelligence & ML (CS3601)",
        "Compiler Design (CS3602)",
        "Cryptography & Network Security (CS3603)",
        "Software Engineering (CS3604)",
        "Cloud Computing (Elective)"
    ]
}

class SessionMemoryStore:
    """
    Manages non-sensitive conversational context for students.
    Remembers: student name, department, year, semester, subjects, study preferences.
    Explicitly filters and rejects sensitive data.
    """
    def __init__(self):
        self._sessions: dict[str, dict[str, Any]] = {}

    def get_or_create(self, session_id: str) -> dict[str, Any]:
        if session_id not in self._sessions:
            self._sessions[session_id] = {
                "student_name": None,
                "department": None,
                "year": None,
                "semester": None,
                "subjects": [],
                "study_preferences": {},
                "history": []
            }
        return self._sessions[session_id]

    def reset_session(self, session_id: str) -> None:
        """Clears conversational memory for a given session."""
        self._sessions[session_id] = {
            "student_name": None,
            "department": None,
            "year": None,
            "semester": None,
            "subjects": [],
            "study_preferences": {},
            "history": []
        }

    def sanitize_text(self, text: str) -> str:
        """Strips out sensitive information before memory storage."""
        sanitized = text
        for pat in SENSITIVE_PATTERNS:
            sanitized = re.sub(pat, "[REDACTED_SENSITIVE_DATA]", sanitized, flags=re.IGNORECASE)
        return sanitized

    def extract_and_update(self, session_id: str, user_text: str) -> dict[str, Any]:
        """
        Extracts non-sensitive student attributes from natural language.
        Example: 'I am a CSE third-year student.'
        """
        mem = self.get_or_create(session_id)
        text_lower = user_text.lower()

        # Check for sensitive patterns - do not save if detected
        for pat in SENSITIVE_PATTERNS:
            if re.search(pat, text_lower):
                return mem

        # 1. Department extraction
        if re.search(r"\b(cse|computer\s+science)\b", text_lower):
            mem["department"] = "Computer Science and Engineering (CSE)"
        elif re.search(r"\b(ai\s*(&|and)?\s*ds|artificial\s+intelligence)\b", text_lower):
            mem["department"] = "Artificial Intelligence & Data Science (AI&DS)"
        elif re.search(r"\b(ece|electronics)\b", text_lower):
            mem["department"] = "Electronics and Communication Engineering (ECE)"
        elif re.search(r"\b(mech|mechanical)\b", text_lower):
            mem["department"] = "Mechanical Engineering (MECH)"
        elif re.search(r"\b(civil)\b", text_lower):
            mem["department"] = "Civil Engineering (CIVIL)"

        # 2. Year extraction
        if re.search(r"\b(3rd|third)[-\s]*year\b", text_lower):
            mem["year"] = "3rd Year"
            if not mem["semester"]:
                mem["semester"] = "Semester 5"
        elif re.search(r"\b(1st|first)[-\s]*year\b", text_lower):
            mem["year"] = "1st Year"
        elif re.search(r"\b(2nd|second)[-\s]*year\b", text_lower):
            mem["year"] = "2nd Year"
        elif re.search(r"\b(4th|fourth|final)[-\s]*year\b", text_lower):
            mem["year"] = "4th Year"

        # 3. Semester extraction
        sem_match = re.search(r"\bsem(?:ester)?\s*([1-8])\b", text_lower)
        if sem_match:
            mem["semester"] = f"Semester {sem_match.group(1)}"

        # 4. Student Name extraction (e.g., "My name is John" or "I am Alice")
        name_match = re.search(r"(?:my\s+name\s+is|i\s+am)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)", user_text)
        if name_match:
            candidate = name_match.group(1).strip()
            # Avoid picking up "I am a CSE student"
            if candidate.lower() not in ["a", "a cse", "a third", "studying", "preparing", "a student"]:
                mem["student_name"] = candidate

        # 5. Study preference extraction (e.g., "I can study 4 hours a day")
        hrs_match = re.search(r"(\d+(?:\.\d+)?)\s*(?:hours|hrs)\b", text_lower)
        if hrs_match:
            mem["study_preferences"]["hours_per_day"] = float(hrs_match.group(1))

        # 6. Automatic Subject Enrichment if Dept = CSE & Year = 3rd Year
        if mem.get("department") == "Computer Science and Engineering (CSE)" and mem.get("year") == "3rd Year":
            if not mem["subjects"]:
                mem["subjects"] = DEPARTMENT_PRESETS[("cse", "3")].copy()

        return mem

    def add_message(self, session_id: str, role: str, content: str) -> None:
        """Appends a turn to conversational history, keeping the last 10 turns."""
        mem = self.get_or_create(session_id)
        sanitized = self.sanitize_text(content)
        mem["history"].append({"role": role, "content": sanitized})
        if len(mem["history"]) > 10:
            mem["history"] = mem["history"][-10:]

# Global session memory instance
memory_store = SessionMemoryStore()
