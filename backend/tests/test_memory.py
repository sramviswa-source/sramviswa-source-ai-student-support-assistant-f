import pytest
from backend.app.memory.session_memory import memory_store

def test_memory_extraction_and_enrichment():
    session_id = "test_student_1"
    memory_store.reset_session(session_id)
    
    # Send user statement
    mem = memory_store.extract_and_update(session_id, "I am a CSE third-year student.")
    assert mem["department"] == "Computer Science and Engineering (CSE)"
    assert mem["year"] == "3rd Year"
    # Auto-enriched subjects for CSE 3rd Year
    assert len(mem["subjects"]) >= 4
    assert any("Operating Systems" in s for s in mem["subjects"])

def test_memory_reset():
    session_id = "test_student_2"
    memory_store.extract_and_update(session_id, "I am a CSE third-year student.")
    assert memory_store.get_or_create(session_id)["year"] == "3rd Year"
    
    memory_store.reset_session(session_id)
    cleared = memory_store.get_or_create(session_id)
    assert cleared["year"] is None
    assert cleared["department"] is None
    assert cleared["subjects"] == []

def test_sensitive_info_rejection():
    session_id = "test_student_sensitive"
    memory_store.reset_session(session_id)
    
    # Message with password or credit card
    memory_store.extract_and_update(session_id, "My password is SecretPass123 and credit card is 4111 2222 3333 4444")
    raw = memory_store.get_or_create(session_id)
    # Ensure no sensitive values stored
    assert "SecretPass123" not in str(raw)
    assert "4111" not in str(raw)
