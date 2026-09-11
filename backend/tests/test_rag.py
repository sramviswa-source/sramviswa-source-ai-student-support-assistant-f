import pytest
from backend.app.rag.retriever import retriever

def test_rag_retrieves_attendance_policy():
    found, matches = retriever.retrieve("What is the minimum attendance requirement?")
    assert found is True
    assert len(matches) > 0
    top = matches[0]
    assert "attendance" in top["filename"].lower() or "attendance" in top["content"].lower()
    assert "75%" in top["content"]

def test_rag_retrieves_passing_criteria():
    found, matches = retriever.retrieve("What are the passing requirements and grading system?")
    assert found is True
    assert len(matches) > 0
    assert any("passing" in m["filename"].lower() or "grade" in m["content"].lower() for m in matches)

def test_rag_retrieves_exam_rules():
    found, matches = retriever.retrieve("What are the examination rules regarding hall ticket and malpractice?")
    assert found is True
    assert len(matches) > 0
    assert any("examination" in m["filename"].lower() or "hall ticket" in m["content"].lower() for m in matches)

def test_rag_rejects_out_of_domain_query():
    # Out of domain question that is NOT in the knowledge base
    found, matches = retriever.retrieve("What is the cost of enrolling in astronaut spaceship pilot training?")
    assert found is False
    assert len(matches) == 0
