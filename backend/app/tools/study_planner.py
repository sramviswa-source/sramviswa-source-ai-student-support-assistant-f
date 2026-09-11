from typing import Any
import math

DEFAULT_CSE_SUBJECTS = [
    "Operating Systems (OS)",
    "Database Management Systems (DBMS)",
    "Computer Networks (CN)",
    "Theory of Computation (TOC)",
    "Web Technology & Full Stack (WT)"
]

def generate_study_plan(
    subjects: list[str],
    preparation_days: int,
    available_hours_per_day: float,
    context_notes: str = ""
) -> dict[str, Any]:
    """
    Generates a realistic, structured, day-by-day study schedule.
    Divides daily hours into focused deep-work blocks, practice/problem solving,
    and active recall revision.
    """
    if preparation_days <= 0:
        raise ValueError("Preparation days must be at least 1.")
    if available_hours_per_day <= 0:
        raise ValueError("Available hours per day must be greater than 0.")
    if available_hours_per_day > 18:
        raise ValueError("Available hours per day cannot exceed 18 hours for healthy study habits.")

    # If no subjects provided, use default syllabus context or fallback
    effective_subjects = [s.strip() for s in subjects if s.strip()]
    if not effective_subjects:
        effective_subjects = DEFAULT_CSE_SUBJECTS.copy()

    total_study_hours = round(preparation_days * available_hours_per_day, 1)
    num_subjects = len(effective_subjects)

    schedule = []
    
    # Plan layout depending on days
    for day in range(1, preparation_days + 1):
        # Last day or last 2 days reserved for final revision and mock testing if >= 4 days
        is_final_revision = (day == preparation_days) and (preparation_days >= 3)
        
        if is_final_revision:
            focus = "Comprehensive Review & Full Mock Practice"
            topics = [f"Rapid recap of high-weightage units across all {num_subjects} subjects", "Solve previous year exam question papers", "Formula / syntax cheat-sheet review"]
            sessions = [
                f"Session 1 ({available_hours_per_day * 0.4:.1f} hrs): High-priority questions & key definitions review",
                f"Session 2 ({available_hours_per_day * 0.4:.1f} hrs): Timed mock test paper under exam conditions",
                f"Session 3 ({available_hours_per_day * 0.2:.1f} hrs): Mistake analysis, formula flashcards, and sleep preparation"
            ]
        else:
            # Distribute subjects in round-robin fashion
            primary_idx = (day - 1) % num_subjects
            secondary_idx = (day) % num_subjects
            
            primary_subject = effective_subjects[primary_idx]
            
            if num_subjects > 1 and available_hours_per_day >= 3.0:
                secondary_subject = effective_subjects[secondary_idx]
                focus = f"{primary_subject} (Major Focus) + {secondary_subject} (Practice)"
                topics = [
                    f"{primary_subject}: Core theory concepts, derivations, and textbook units",
                    f"{secondary_subject}: Numerical problems, code tracing, or sample questions"
                ]
                s1_hrs = round(available_hours_per_day * 0.6, 1)
                s2_hrs = round(available_hours_per_day * 0.4, 1)
                sessions = [
                    f"Block 1 ({s1_hrs} hrs): Deep Work on {primary_subject} - Unit concepts & notes",
                    f"Block 2 ({s2_hrs} hrs): Practice & Active Recall on {secondary_subject} - Problem solving"
                ]
            else:
                focus = primary_subject
                topics = [
                    f"Fundamental unit concepts and lecture notes",
                    f"Standard university question bank solutions and diagrams"
                ]
                sessions = [
                    f"Block 1 ({available_hours_per_day * 0.7:.1f} hrs): Deep study & active concept note-taking",
                    f"Block 2 ({available_hours_per_day * 0.3:.1f} hrs): Self-testing, flashcards, and chapter summary"
                ]

        schedule.append({
            "day": day,
            "focus_subject": focus,
            "topics": topics,
            "hours": available_hours_per_day,
            "session_breakdown": sessions
        })

    recommendations = [
        "Use the 50/10 Pomodoro rule: 50 minutes of deep focus followed by a 10-minute break.",
        "Prioritize past 3 years university question papers for high-weightage topics.",
        "Use active recall: Write down summaries from memory without looking at notes.",
        "Stay hydrated and aim for at least 7 hours of sleep before exam days."
    ]

    return {
        "subjects": effective_subjects,
        "preparation_days": preparation_days,
        "available_hours_per_day": available_hours_per_day,
        "total_study_hours": total_study_hours,
        "schedule": schedule,
        "recommendations": recommendations,
        "summary": f"Generated a {preparation_days}-day structured plan across {num_subjects} subject(s) providing {total_study_hours} total study hours."
    }
