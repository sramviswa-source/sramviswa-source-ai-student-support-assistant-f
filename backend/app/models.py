from pydantic import BaseModel, Field
from typing import Optional, Any

# Chat Schemas
class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, description="Student query or message")
    session_id: str = Field(default="default", description="Conversation session ID")

class SourceCitation(BaseModel):
    title: str
    filename: str
    similarity: float
    snippet: str

class ToolExecutionResult(BaseModel):
    tool_name: str
    inputs: dict[str, Any]
    outputs: dict[str, Any]
    explanation: str

class ChatResponse(BaseModel):
    response: str
    intent: str
    sources: list[SourceCitation] = []
    tool_result: Optional[ToolExecutionResult] = None
    session_id: str
    active_memory: dict[str, Any] = {}
    provider: str = "local"

# Standalone Tool Schemas
class AttendanceRequest(BaseModel):
    attended_classes: float = Field(..., ge=0, description="Number of attended classes")
    total_classes: float = Field(..., gt=0, description="Total number of conducted classes")

class AttendanceResponse(BaseModel):
    attended_classes: float
    total_classes: float
    percentage: float
    status: str
    message: str
    calculation_formula: str
    details: dict[str, Any]

class MarksRequest(BaseModel):
    marks_obtained: float = Field(..., ge=0, description="Marks obtained by the student")
    maximum_marks: float = Field(..., gt=0, description="Maximum possible marks")

class MarksResponse(BaseModel):
    marks_obtained: float
    maximum_marks: float
    percentage: float
    grade: str
    status: str
    message: str
    calculation_formula: str

class StudyPlanRequest(BaseModel):
    subjects: list[str] = Field(default=[], description="List of subjects to prepare for")
    preparation_days: int = Field(..., gt=0, le=90, description="Preparation window in days")
    available_hours_per_day: float = Field(..., gt=0, le=18, description="Available study hours per day")
    session_id: Optional[str] = Field(default="default", description="Optional session to pull subjects from memory")

class StudyPlanDay(BaseModel):
    day: int
    focus_subject: str
    topics: list[str]
    hours: float
    session_breakdown: list[str]

class StudyPlanResponse(BaseModel):
    subjects: list[str]
    preparation_days: int
    available_hours_per_day: float
    total_study_hours: float
    schedule: list[StudyPlanDay]
    recommendations: list[str]

# Knowledge Base Schemas
class DocumentInfo(BaseModel):
    title: str
    filename: str
    category: str
    char_count: int
    content: Optional[str] = None

class SearchRequest(BaseModel):
    query: str = Field(..., min_length=1)
    top_k: int = Field(default=3, ge=1, le=10)

class SearchResponse(BaseModel):
    query: str
    found: bool
    results: list[dict[str, Any]]

# Memory Schemas
class MemoryResetRequest(BaseModel):
    session_id: str = Field(default="default")

class MemoryResponse(BaseModel):
    session_id: str
    memory: dict[str, Any]
    message: str
