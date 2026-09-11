import re
from typing import Any

class IntentRouter:
    """
    Intelligently determines student intent and extracts required parameters
    from natural language queries.
    """

    @staticmethod
    def detect_intent(text: str) -> str:
        text_lower = text.lower().strip()

        # 1. Attendance Calculation Intent
        # Must distinguish from general policy questions like "What is the attendance requirement?"
        has_calc_word = bool(re.search(r"\b(calc|calculate|calculation|percentage|what is my attendance|check my attendance)\b", text_lower))
        has_attendance_word = bool(re.search(r"\b(attendance|classes|attended|class)\b", text_lower))
        has_fraction = bool(re.search(r"\b\d+\s*(?:out of|\/|\bof\b)\s*\d+\b", text_lower))

        if (has_calc_word or has_fraction) and has_attendance_word and not re.search(r"\b(requirement|rule|policy|regulations?|minimum)\b", text_lower):
            return "attendance_calc"

        # Also check if student just says "Calculate my attendance"
        if "calculate my attendance" in text_lower:
            return "attendance_calc"

        # 2. Marks / Score Percentage Calculation Intent
        has_marks_word = bool(re.search(r"\b(marks?|score|scored|grade|percentage|cgpa)\b", text_lower))
        if (has_calc_word or has_fraction) and has_marks_word and not re.search(r"\b(rule|policy|criteria|requirement|passing requirement)\b", text_lower):
            return "marks_calc"

        # 3. Study Plan Generation Intent
        if re.search(r"\b(study plan|study schedule|revision schedule|plan my studies|prepare for exam|prep plan)\b", text_lower):
            return "study_plan"

        # 4. College Information / Regulations / Syllabus / FAQ (RAG Intent)
        rag_keywords = [
            "attendance requirement", "attendance policy", "minimum attendance", "condonation", "detention",
            "exam rule", "examination", "hall ticket", "malpractice", "grace period", "prohibited",
            "internal assessment", "cia", "internal mark", "continuous internal", "assignment",
            "passing requirement", "passing criteria", "passing mark", "letter grade", "revaluation",
            "academic calendar", "semester start", "symposium", "techfest", "vacation", "exam date",
            "department", "hod", "syllabus", "course", "subject", "curriculum", "bonafide", "duplicate id",
            "library hours", "hostel", "medical leave", "arrear"
        ]
        for kw in rag_keywords:
            if kw in text_lower:
                return "college_policy"

        # Questions starting with what/when/where/how/who regarding college
        if re.search(r"^(what|when|where|who|how|is there|can i)\b", text_lower) and len(text.split()) > 3:
            return "college_policy"

        # 5. Fallback / General Conversation
        return "general_chat"

    @staticmethod
    def extract_attendance_params(text: str) -> tuple[float | None, float | None]:
        """
        Extracts (attended_classes, total_classes) from text.
        Examples:
        - "42 classes out of 50" -> (42.0, 50.0)
        - "attended 45 out of 50" -> (45.0, 50.0)
        - "42/50" -> (42.0, 50.0)
        """
        # Pattern 1: "X out of Y" or "X / Y"
        m1 = re.search(r"(\d+(?:\.\d+)?)\s*(?:out of|\/|\bof\b)\s*(\d+(?:\.\d+)?)", text, re.IGNORECASE)
        if m1:
            return float(m1.group(1)), float(m1.group(2))

        # Pattern 2: "attended X ... total Y"
        m_att = re.search(r"attended\s+(\d+(?:\.\d+)?)", text, re.IGNORECASE)
        m_tot = re.search(r"total\s+(\d+(?:\.\d+)?)", text, re.IGNORECASE)
        if m_att and m_tot:
            return float(m_att.group(1)), float(m_tot.group(1))

        # Pattern 3: Find any two standalone numbers
        nums = [float(n) for n in re.findall(r"\b\d+(?:\.\d+)?\b", text)]
        if len(nums) >= 2:
            return nums[0], nums[1]

        return None, None

    @staticmethod
    def extract_marks_params(text: str) -> tuple[float | None, float | None]:
        """
        Extracts (marks_obtained, maximum_marks) from text.
        Examples:
        - "I scored 78 out of 100" -> (78.0, 100.0)
        - "78/100" -> (78.0, 100.0)
        - "marks 45 max 50" -> (45.0, 50.0)
        """
        m1 = re.search(r"(\d+(?:\.\d+)?)\s*(?:out of|\/|\bof\b)\s*(\d+(?:\.\d+)?)", text, re.IGNORECASE)
        if m1:
            return float(m1.group(1)), float(m1.group(2))

        nums = [float(n) for n in re.findall(r"\b\d+(?:\.\d+)?\b", text)]
        if len(nums) >= 2:
            return nums[0], nums[1]

        return None, None

    @staticmethod
    def extract_study_plan_params(text: str) -> tuple[list[str], int, float]:
        """
        Extracts (subjects, preparation_days, available_hours_per_day) from text.
        """
        text_lower = text.lower()
        
        # Days
        days_match = re.search(r"(\d+)\s*(?:days?|day)\b", text_lower)
        days = int(days_match.group(1)) if days_match else 7

        # Hours per day
        hours_match = re.search(r"(\d+(?:\.\d+)?)\s*(?:hours?|hrs?)\b", text_lower)
        hours = float(hours_match.group(1)) if hours_match else 4.0

        # Subjects count or explicit list
        subjects = []
        subj_count_match = re.search(r"(\d+)\s*(?:subjects?|courses?)\b", text_lower)
        if subj_count_match:
            count = int(subj_count_match.group(1))
            default_catalog = [
                "Operating Systems",
                "Database Management Systems",
                "Computer Networks",
                "Theory of Computation",
                "Web Technology",
                "Artificial Intelligence",
                "Software Engineering"
            ]
            subjects = default_catalog[:count]

        return subjects, days, hours

router = IntentRouter()
