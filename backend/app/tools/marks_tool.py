from typing import Any

def calculate_marks_percentage(marks_obtained: float, maximum_marks: float) -> dict[str, Any]:
    """
    Calculates percentage and maps to the college 10-point grading system:
    Formula: (marks_obtained / maximum_marks) * 100
    Passing requirement: >= 50%
    """
    if maximum_marks <= 0:
        raise ValueError("Maximum marks must be greater than 0.")
    if marks_obtained < 0:
        raise ValueError("Marks obtained cannot be negative.")
    if marks_obtained > maximum_marks:
        raise ValueError(f"Marks obtained ({marks_obtained}) cannot exceed maximum marks ({maximum_marks}).")

    percentage = round((marks_obtained / maximum_marks) * 100, 2)
    
    # Grading according to REG-2024-PASS-04
    if percentage >= 91.0:
        grade = "O (Outstanding)"
        points = 10
        classification = "First Class with Distinction range"
        status = "Passed"
    elif percentage >= 81.0:
        grade = "A+ (Excellent)"
        points = 9
        classification = "First Class range"
        status = "Passed"
    elif percentage >= 71.0:
        grade = "A (Very Good)"
        points = 8
        classification = "First Class range"
        status = "Passed"
    elif percentage >= 61.0:
        grade = "B+ (Good)"
        points = 7
        classification = "First Class range"
        status = "Passed"
    elif percentage >= 50.0:
        grade = "B (Average / Minimum Pass)"
        points = 6
        classification = "Second Class range"
        status = "Passed"
    else:
        grade = "RA (Re-Appear / Failed)"
        points = 0
        classification = "Below Passing Threshold (< 50%)"
        status = "Failed"

    formula_str = f"({marks_obtained:g} / {maximum_marks:g}) × 100 = {percentage:.2f}%"

    if status == "Passed":
        message = (
            f"You scored {marks_obtained:g} out of {maximum_marks:g}, which is {percentage:.2f}%. "
            f"This falls into Grade {grade} ({points} Grade Points). Congratulations on meeting the passing criteria!"
        )
    else:
        message = (
            f"You scored {marks_obtained:g} out of {maximum_marks:g}, which is {percentage:.2f}%. "
            f"This is below the 50% aggregate passing benchmark (Grade {grade}). Review the subject units and seek faculty guidance for the next assessment."
        )

    return {
        "marks_obtained": marks_obtained,
        "maximum_marks": maximum_marks,
        "percentage": percentage,
        "grade": grade,
        "points": points,
        "classification": classification,
        "status": status,
        "message": message,
        "calculation_formula": formula_str
    }
