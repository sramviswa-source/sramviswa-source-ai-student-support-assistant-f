from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import Any

from .config import settings
from .models import (
    ChatRequest,
    ChatResponse,
    AttendanceRequest,
    AttendanceResponse,
    MarksRequest,
    MarksResponse,
    StudyPlanRequest,
    StudyPlanResponse,
    SearchRequest,
    SearchResponse,
    MemoryResetRequest,
    MemoryResponse
)
from .tools.attendance_tool import calculate_attendance
from .tools.marks_tool import calculate_marks_percentage
from .tools.study_planner import generate_study_plan
from .rag.retriever import retriever
from .memory.session_memory import memory_store
from .agents.orchestrator import orchestrator

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.PROJECT_VERSION,
    description="Agentic AI Student Support Assistant for ABC Institute of Technology [SAMPLE DATA]"
)

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "project": settings.PROJECT_NAME,
        "college": settings.COLLEGE_NAME,
        "provider": settings.ACTIVE_PROVIDER,
        "kb_documents_indexed": len(retriever.documents),
        "version": settings.PROJECT_VERSION
    }

# 1. Primary Chat Endpoint
@app.post("/api/chat", response_model=ChatResponse)
@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    try:
        response = await orchestrator.handle_message(
            message=request.message,
            session_id=request.session_id
        )
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat processing failed: {str(e)}")

# 2. Standalone Tool: Attendance Calculator
@app.post("/api/tools/attendance", response_model=AttendanceResponse)
@app.post("/tools/attendance", response_model=AttendanceResponse)
def calculate_attendance_endpoint(request: AttendanceRequest):
    try:
        res = calculate_attendance(request.attended_classes, request.total_classes)
        return AttendanceResponse(
            attended_classes=res["attended_classes"],
            total_classes=res["total_classes"],
            percentage=res["percentage"],
            status=res["status"],
            message=res["message"],
            calculation_formula=res["calculation_formula"],
            details=res["details"]
        )
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))

# 3. Standalone Tool: Marks/Percentage Calculator
@app.post("/api/tools/percentage", response_model=MarksResponse)
@app.post("/tools/percentage", response_model=MarksResponse)
def calculate_marks_endpoint(request: MarksRequest):
    try:
        res = calculate_marks_percentage(request.marks_obtained, request.maximum_marks)
        return MarksResponse(
            marks_obtained=res["marks_obtained"],
            maximum_marks=res["maximum_marks"],
            percentage=res["percentage"],
            grade=res["grade"],
            status=res["status"],
            message=res["message"],
            calculation_formula=res["calculation_formula"]
        )
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))

# 4. Standalone Tool: Study Plan Generator
@app.post("/api/tools/study-plan", response_model=StudyPlanResponse)
@app.post("/tools/study-plan", response_model=StudyPlanResponse)
def generate_study_plan_endpoint(request: StudyPlanRequest):
    try:
        subjs = request.subjects
        if not subjs and request.session_id:
            mem = memory_store.get_or_create(request.session_id)
            subjs = mem.get("subjects", [])
            
        res = generate_study_plan(
            subjects=subjs,
            preparation_days=request.preparation_days,
            available_hours_per_day=request.available_hours_per_day
        )
        return StudyPlanResponse(**res)
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))

# 5. Knowledge Base: Document List & Details
@app.get("/api/kb/documents")
@app.get("/kb/documents")
def get_documents():
    return {
        "college": settings.COLLEGE_NAME,
        "count": len(retriever.documents),
        "documents": retriever.get_documents_summary()
    }

@app.get("/api/kb/document/{filename}")
@app.get("/kb/document/{filename}")
def get_document_by_filename(filename: str):
    doc = retriever.get_document_content(filename)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found.")
    return doc

# 6. Knowledge Base: Semantic Search Endpoint
@app.post("/api/kb/search", response_model=SearchResponse)
@app.post("/kb/search", response_model=SearchResponse)
def search_knowledge_base(request: SearchRequest):
    found, matches = retriever.retrieve(request.query, top_k=request.top_k)
    return SearchResponse(
        query=request.query,
        found=found,
        results=matches
    )

# 7. Conversational Memory Endpoints
@app.get("/api/memory")
@app.get("/memory")
def get_memory(session_id: str = Query(default="default")):
    mem = memory_store.get_or_create(session_id)
    return {
        "session_id": session_id,
        "memory": mem,
        "message": "Current session memory retrieved successfully."
    }

@app.post("/api/memory/reset", response_model=MemoryResponse)
@app.post("/memory/reset", response_model=MemoryResponse)
def reset_memory(request: MemoryResetRequest):
    memory_store.reset_session(request.session_id)
    return MemoryResponse(
        session_id=request.session_id,
        memory=memory_store.get_or_create(request.session_id),
        message="Conversational memory has been successfully cleared."
    )
