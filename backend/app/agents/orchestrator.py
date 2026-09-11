import json
from typing import Any
from ..config import settings
from ..models import ChatResponse, SourceCitation, ToolExecutionResult
from ..memory.session_memory import memory_store
from ..rag.retriever import retriever
from ..tools.attendance_tool import calculate_attendance
from ..tools.marks_tool import calculate_marks_percentage
from ..tools.study_planner import generate_study_plan
from .router import router
from .llm_client import llm_client

class AgentOrchestrator:
    """
    Coordinates the full agent lifecycle:
    1. Memory ingestion & Context Enrichment
    2. Intent Routing
    3. Tool Execution or RAG Retrieval
    4. Response Synthesis
    5. Memory State Update
    """

    async def handle_message(self, message: str, session_id: str = "default") -> ChatResponse:
        clean_msg = message.strip()
        if not clean_msg:
            return ChatResponse(
                response="Please enter a message or question.",
                intent="empty_input",
                session_id=session_id,
                active_memory=memory_store.get_or_create(session_id),
                provider=settings.ACTIVE_PROVIDER
            )

        # 1. Update session memory with any student profile facts
        memory_store.extract_and_update(session_id, clean_msg)
        memory = memory_store.get_or_create(session_id)
        memory_store.add_message(session_id, "user", clean_msg)

        # 2. Detect intent
        intent = router.detect_intent(clean_msg)

        sources: list[SourceCitation] = []
        tool_result: ToolExecutionResult | None = None
        reply_text = ""

        # 3. Branch execution based on intent

        # --- A. ATTENDANCE CALCULATOR TOOL ---
        if intent == "attendance_calc":
            att, tot = router.extract_attendance_params(clean_msg)
            if att is not None and tot is not None:
                try:
                    res = calculate_attendance(att, tot)
                    pct = res["percentage"]
                    formula = f"{att:g} ÷ {tot:g} × 100 = {pct:.1f}%"
                    reply_text = (
                        f"Your attendance is **{pct:.1f}%**.\n\n"
                        f"**Calculation:**\n`{formula}`\n\n"
                        f"**Academic Standing:** {res['message']}\n\n"
                        f"{res['advice']}"
                    )
                    tool_result = ToolExecutionResult(
                        tool_name="Attendance Calculator",
                        inputs={"attended_classes": att, "total_classes": tot},
                        outputs=res,
                        explanation=f"Evaluated {att:g}/{tot:g} classes against the 75% minimum university threshold."
                    )
                except ValueError as ve:
                    reply_text = f"Error in attendance calculation: {str(ve)}"
            else:
                reply_text = (
                    "To calculate your attendance, please specify both the classes you attended and the total classes conducted.\n"
                    "For example: *'I attended 42 classes out of 50. Calculate my attendance.'*"
                )

        # --- B. MARKS / PERCENTAGE CALCULATOR TOOL ---
        elif intent == "marks_calc":
            obtained, max_m = router.extract_marks_params(clean_msg)
            if obtained is not None and max_m is not None:
                try:
                    res = calculate_marks_percentage(obtained, max_m)
                    pct = res["percentage"]
                    formula = f"{obtained:g} ÷ {max_m:g} × 100 = {pct:.2f}%"
                    reply_text = (
                        f"Your score percentage is **{pct:.2f}%**.\n\n"
                        f"**Calculation:**\n`{formula}`\n\n"
                        f"**Result:** Grade **{res['grade']}** ({res['classification']})\n\n"
                        f"{res['message']}"
                    )
                    tool_result = ToolExecutionResult(
                        tool_name="Marks Percentage Calculator",
                        inputs={"marks_obtained": obtained, "maximum_marks": max_m},
                        outputs=res,
                        explanation=f"Computed percentage and mapped to the college 10-point scale."
                    )
                except ValueError as ve:
                    reply_text = f"Error in marks calculation: {str(ve)}"
            else:
                reply_text = (
                    "To calculate your marks percentage, please provide your marks obtained and the maximum marks.\n"
                    "For example: *'I scored 78 out of 100. What is my percentage?'*"
                )

        # --- C. STUDY PLAN GENERATOR TOOL ---
        elif intent == "study_plan":
            extracted_subjs, days, hours = router.extract_study_plan_params(clean_msg)
            
            # Contextual memory priority: Use subjects from memory if available
            effective_subjs = extracted_subjs
            if not effective_subjs and memory.get("subjects"):
                effective_subjs = memory["subjects"]
            
            # Check hours preference in memory
            if "hours_per_day" in memory.get("study_preferences", {}):
                hours = memory["study_preferences"]["hours_per_day"]

            try:
                plan = generate_study_plan(effective_subjs, days, hours)
                
                # Format plan nicely as markdown
                subj_list_str = ", ".join(plan["subjects"])
                lines = [
                    f"### Personalized {days}-Day Study Schedule",
                    f"**Subjects Covered:** {subj_list_str}",
                    f"**Total Preparation Hours:** {plan['total_study_hours']} hrs ({hours} hrs/day)\n"
                ]
                
                if memory.get("year") and memory.get("department"):
                    lines.insert(1, f"*Tailored for {memory['year']} {memory['department']} Curriculum (from your profile)*\n")

                for day_info in plan["schedule"]:
                    lines.append(f"#### Day {day_info['day']}: {day_info['focus_subject']}")
                    for session in day_info["session_breakdown"]:
                        lines.append(f"- {session}")
                    lines.append("")

                lines.append("#### Recommended Study Habits:")
                for rec in plan["recommendations"]:
                    lines.append(f"- {rec}")

                reply_text = "\n".join(lines)
                tool_result = ToolExecutionResult(
                    tool_name="Study Plan Generator",
                    inputs={
                        "subjects": plan["subjects"],
                        "preparation_days": days,
                        "available_hours_per_day": hours
                    },
                    outputs=plan,
                    explanation=f"Generated structured {days}-day plan with deep work and active recall modules."
                )
            except Exception as e:
                reply_text = f"Unable to generate study plan: {str(e)}"

        # --- D. COLLEGE INFORMATION / RAG INTENT ---
        elif intent == "college_policy":
            found, matches = retriever.retrieve(clean_msg)
            if not found:
                reply_text = (
                    "I couldn't find this information in the available college knowledge base. "
                    "Please check the official college regulations or contact your department office or Academic Cell."
                )
            else:
                sources = [
                    SourceCitation(
                        title=m["title"],
                        filename=m["filename"],
                        similarity=m["score"],
                        snippet=m["content"][:200] + "..."
                    )
                    for m in matches
                ]
                reply_text = await llm_client.generate_response(clean_msg, matches, memory)

        # --- E. GENERAL CHAT / FALLBACK ---
        else:
            # Check if query has semantic similarity to knowledge base before treating as chit-chat
            found, matches = retriever.retrieve(clean_msg, top_k=2)
            if found and matches and matches[0]["score"] >= 0.16:
                sources = [
                    SourceCitation(
                        title=m["title"],
                        filename=m["filename"],
                        similarity=m["score"],
                        snippet=m["content"][:200] + "..."
                    )
                    for m in matches
                ]
                reply_text = await llm_client.generate_response(clean_msg, matches, memory)
            else:
                reply_text = await llm_client.generate_response(clean_msg, [], memory)

        # Record assistant response in memory
        memory_store.add_message(session_id, "assistant", reply_text)

        return ChatResponse(
            response=reply_text,
            intent=intent,
            sources=sources,
            tool_result=tool_result,
            session_id=session_id,
            active_memory={
                "student_name": memory.get("student_name"),
                "department": memory.get("department"),
                "year": memory.get("year"),
                "semester": memory.get("semester"),
                "subjects": memory.get("subjects", []),
                "study_preferences": memory.get("study_preferences", {})
            },
            provider=settings.ACTIVE_PROVIDER
        )

orchestrator = AgentOrchestrator()
