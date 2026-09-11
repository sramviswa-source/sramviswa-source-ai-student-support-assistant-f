import pytest
from backend.app.tools.attendance_tool import calculate_attendance
from backend.app.tools.marks_tool import calculate_marks_percentage
from backend.app.tools.study_planner import generate_study_plan

def test_attendance_tool_normal():
    res = calculate_attendance(45, 50)
    assert res["percentage"] == 90.0
    assert res["status"] == "Eligible"
    assert "90" in res["calculation_formula"]

def test_attendance_tool_condonable():
    res = calculate_attendance(35, 50)  # 70%
    assert res["percentage"] == 70.0
    assert res["status"] == "Shortage (Condonable)"
    assert res["details"]["is_condonable"] is True

def test_attendance_tool_detained():
    res = calculate_attendance(25, 50)  # 50%
    assert res["percentage"] == 50.0
    assert res["status"] == "Critical (Detained)"

def test_attendance_tool_invalid():
    with pytest.raises(ValueError, match="greater than 0"):
        calculate_attendance(10, 0)
    with pytest.raises(ValueError, match="cannot exceed"):
        calculate_attendance(55, 50)
    with pytest.raises(ValueError, match="cannot be negative"):
        calculate_attendance(-5, 50)

def test_marks_tool_normal():
    res = calculate_marks_percentage(78, 100)
    assert res["percentage"] == 78.0
    assert res["grade"] == "A (Very Good)"
    assert res["status"] == "Passed"

def test_marks_tool_fail():
    res = calculate_marks_percentage(40, 100)
    assert res["percentage"] == 40.0
    assert res["grade"] == "RA (Re-Appear / Failed)"
    assert res["status"] == "Failed"

def test_marks_tool_invalid():
    with pytest.raises(ValueError, match="greater than 0"):
        calculate_marks_percentage(50, 0)
    with pytest.raises(ValueError, match="cannot exceed"):
        calculate_marks_percentage(105, 100)

def test_study_planner_tool():
    subjects = ["OS", "DBMS", "CN", "TOC", "WT"]
    plan = generate_study_plan(subjects, 7, 4.0)
    assert plan["preparation_days"] == 7
    assert plan["available_hours_per_day"] == 4.0
    assert plan["total_study_hours"] == 28.0
    assert len(plan["schedule"]) == 7
    assert "OS" in plan["schedule"][0]["focus_subject"]
