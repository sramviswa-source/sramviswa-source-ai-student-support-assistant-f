import math
from typing import Any

def calculate_attendance(attended_classes: float, total_classes: float) -> dict[str, Any]:
    """
    Calculates attendance percentage according to college regulations:
    Formula: (attended / total) * 100
    Minimum requirement: 75%
    Condonation band: 65% - 74.99%
    Detention: < 65%
    """
    if total_classes <= 0:
        raise ValueError("Total classes must be greater than 0.")
    if attended_classes < 0:
        raise ValueError("Attended classes cannot be negative.")
    if attended_classes > total_classes:
        raise ValueError(f"Attended classes ({attended_classes}) cannot exceed total classes ({total_classes}).")

    percentage = round((attended_classes / total_classes) * 100, 2)
    
    # Analyze standing against 75% college rule
    if percentage >= 75.0:
        status = "Eligible"
        safe_missable = math.floor((attended_classes - 0.75 * total_classes) / 0.75)
        message = (
            f"Your attendance is {percentage:.1f}%. You satisfy the minimum 75% requirement "
            f"and are eligible for the End-Semester Examination."
        )
        if safe_missable > 0:
            advice = f"You can safely miss up to {safe_missable} upcoming class(es) while still keeping attendance at or above 75%."
        else:
            advice = "You are currently right at or near the 75% threshold. Do not miss any upcoming classes."
    elif percentage >= 65.0:
        status = "Shortage (Condonable)"
        classes_needed = math.ceil((0.75 * total_classes - attended_classes) / 0.25)
        message = (
            f"Your attendance is {percentage:.1f}%, which is below the 75% threshold. "
            f"Under college regulations (REG-2024-ATT-01), attendance between 65% and 74% may be condoned "
            f"on medical grounds with Principal approval and condonation fee."
        )
        advice = f"To reach the 75% eligibility mark naturally, you must attend the next {classes_needed} consecutive class(es) without absence."
    else:
        status = "Critical (Detained)"
        classes_needed = math.ceil((0.75 * total_classes - attended_classes) / 0.25)
        message = (
            f"Your attendance is {percentage:.1f}%, which is below 65%. "
            f"According to college regulations, attendance below 65% is not eligible for condonation and results in course detention."
        )
        advice = f"You need to attend at least {classes_needed} consecutive classes without missing any to bring your attendance up to 75%."

    formula_str = f"({attended_classes:g} / {total_classes:g}) × 100 = {percentage:.2f}%"

    return {
        "attended_classes": attended_classes,
        "total_classes": total_classes,
        "percentage": percentage,
        "status": status,
        "message": message,
        "advice": advice,
        "calculation_formula": formula_str,
        "details": {
            "minimum_required_pct": 75.0,
            "condonation_min_pct": 65.0,
            "is_eligible": percentage >= 75.0,
            "is_condonable": 65.0 <= percentage < 75.0,
            "is_detained": percentage < 65.0
        }
    }
