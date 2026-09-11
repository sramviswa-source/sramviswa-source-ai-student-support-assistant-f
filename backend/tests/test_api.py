import pytest
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_health():
    res = client.get("/api/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "healthy"
    assert data["kb_documents_indexed"] >= 5

def test_attendance_endpoint():
    res = client.post("/api/tools/attendance", json={"attended_classes": 45, "total_classes": 50})
    assert res.status_code == 200
    data = res.json()
    assert data["percentage"] == 90.0
    assert data["status"] == "Eligible"

def test_percentage_endpoint():
    res = client.post("/api/tools/percentage", json={"marks_obtained": 78, "maximum_marks": 100})
    assert res.status_code == 200
    data = res.json()
    assert data["percentage"] == 78.0
    assert data["grade"] == "A (Very Good)"

def test_study_plan_endpoint():
    res = client.post("/api/tools/study-plan", json={
        "subjects": ["Operating Systems", "DBMS", "Computer Networks"],
        "preparation_days": 5,
        "available_hours_per_day": 3.0
    })
    assert res.status_code == 200
    data = res.json()
    assert data["preparation_days"] == 5
    assert len(data["schedule"]) == 5

def test_kb_search_endpoint():
    res = client.post("/api/kb/search", json={"query": "What is the attendance requirement?"})
    assert res.status_code == 200
    data = res.json()
    assert data["found"] is True
    assert len(data["results"]) > 0

def test_chat_demo_1_attendance_policy():
    res = client.post("/api/chat", json={
        "message": "What is the attendance requirement?",
        "session_id": "test_chat_1"
    })
    assert res.status_code == 200
    data = res.json()
    assert "75%" in data["response"]
    assert len(data["sources"]) > 0

def test_chat_demo_2_attendance_calculation():
    res = client.post("/api/chat", json={
        "message": "I attended 45 out of 50 classes. Calculate my attendance.",
        "session_id": "test_chat_2"
    })
    assert res.status_code == 200
    data = res.json()
    assert "90" in data["response"]
    assert data["tool_result"] is not None
    assert data["tool_result"]["tool_name"] == "Attendance Calculator"

def test_chat_demo_3_marks_calculation():
    res = client.post("/api/chat", json={
        "message": "I scored 78 out of 100. What is my percentage?",
        "session_id": "test_chat_3"
    })
    assert res.status_code == 200
    data = res.json()
    assert "78" in data["response"]
    assert data["tool_result"] is not None
    assert data["tool_result"]["tool_name"] == "Marks Percentage Calculator"

def test_chat_demo_4_study_plan():
    res = client.post("/api/chat", json={
        "message": "I have 7 days to prepare for 5 subjects. Create a study plan.",
        "session_id": "test_chat_4"
    })
    assert res.status_code == 200
    data = res.json()
    assert "Day 1" in data["response"]
    assert data["tool_result"] is not None
    assert data["tool_result"]["tool_name"] == "Study Plan Generator"

def test_chat_demo_5_contextual_memory():
    session_id = "test_chat_demo_5"
    # Step 1: Tell assistant student department & year
    res1 = client.post("/api/chat", json={
        "message": "I am a CSE third-year student.",
        "session_id": session_id
    })
    assert res1.status_code == 200
    assert res1.json()["active_memory"]["department"] == "Computer Science and Engineering (CSE)"
    assert res1.json()["active_memory"]["year"] == "3rd Year"

    # Step 2: Ask for a study plan without explicitly restating subjects
    res2 = client.post("/api/chat", json={
        "message": "Create a study plan for me.",
        "session_id": session_id
    })
    assert res2.status_code == 200
    data2 = res2.json()
    assert data2["tool_result"] is not None
    # Verify CSE curriculum subjects from memory are used
    plan_subjs = data2["tool_result"]["inputs"]["subjects"]
    assert any("Operating Systems" in s for s in plan_subjs)

def test_chat_demo_6_not_in_kb_no_hallucination():
    res = client.post("/api/chat", json={
        "message": "What is the fee for enrolling in the space astronaut spaceship certification course?",
        "session_id": "test_chat_6"
    })
    assert res.status_code == 200
    data = res.json()
    assert "couldn't find this information in the available college knowledge base" in data["response"].lower() or "not found" in data["response"].lower()
