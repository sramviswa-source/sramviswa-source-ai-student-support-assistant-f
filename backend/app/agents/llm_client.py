import re
import httpx
from typing import Any
from ..config import settings

class LLMClient:
    """
    Unified LLM Client supporting Google Gemini, OpenAI, and a built-in
    grounded local synthesis engine.
    Ensures zero hallucination by strictly grounding answers on retrieved knowledge.
    """

    def __init__(self):
        self.provider = settings.ACTIVE_PROVIDER

    async def call_gemini(self, prompt: str, system_instruction: str = "") -> str:
        """Invokes Google Gemini REST API using httpx."""
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{settings.GEMINI_MODEL}:generateContent?key={settings.GEMINI_API_KEY}"
        payload = {
            "contents": [
                {
                    "parts": [{"text": prompt}]
                }
            ],
            "generationConfig": {
                "temperature": 0.2,
                "maxOutputTokens": 800
            }
        }
        if system_instruction:
            payload["systemInstruction"] = {
                "parts": [{"text": system_instruction}]
            }

        async with httpx.AsyncClient(timeout=20.0) as client:
            resp = await client.post(url, json=payload)
            if resp.status_code != 200:
                raise RuntimeError(f"Gemini API error {resp.status_code}: {resp.text}")
            data = resp.json()
            candidates = data.get("candidates", [])
            if candidates and "content" in candidates[0]:
                parts = candidates[0]["content"].get("parts", [])
                if parts:
                    return parts[0].get("text", "")
            return "Unable to generate response from Gemini."

    async def call_openai(self, prompt: str, system_instruction: str = "") -> str:
        """Invokes OpenAI Chat Completion API using httpx."""
        url = "https://api.openai.com/v1/chat/completions"
        headers = {
            "Authorization": f"Bearer {settings.OPENAI_API_KEY}",
            "Content-Type": "application/json"
        }
        messages = []
        if system_instruction:
            messages.append({"role": "system", "content": system_instruction})
        messages.append({"role": "user", "content": prompt})

        payload = {
            "model": settings.OPENAI_MODEL,
            "messages": messages,
            "temperature": 0.2,
            "max_tokens": 800
        }

        async with httpx.AsyncClient(timeout=20.0) as client:
            resp = await client.post(url, headers=headers, json=payload)
            if resp.status_code != 200:
                raise RuntimeError(f"OpenAI API error {resp.status_code}: {resp.text}")
            data = resp.json()
            return data["choices"][0]["message"]["content"]

    def local_grounded_synthesis(
        self,
        query: str,
        retrieved_chunks: list[dict[str, Any]],
        memory_context: dict[str, Any]
    ) -> str:
        """
        Synthesizes a clean, well-formatted response using only the retrieved
        knowledge base chunks without hallucinating.
        """
        if not retrieved_chunks:
            return (
                "I couldn't find this information in the available college knowledge base. "
                "Please check the official college regulations or contact your department office or Academic Cell."
            )

        top_chunk = retrieved_chunks[0]
        title = top_chunk.get("title", "College Academic Policy")
        filename = top_chunk.get("filename", "knowledge_base")
        content = top_chunk.get("content", "").strip()

        # Build context acknowledgment if student info is known
        prefix = ""
        if memory_context.get("student_name"):
            prefix = f"Hello {memory_context['student_name']}! "
        elif memory_context.get("department") and memory_context.get("year"):
            prefix = f"Based on your profile as a {memory_context['year']} {memory_context['department']} student:\n\n"

        # Construct clear grounded response
        response = (
            f"{prefix}"
            f"According to the sample college regulations for **{title}** in the knowledge base:\n\n"
            f"{content}\n\n"
            f"**Source Document:** `{filename}`"
        )
        return response

    async def generate_response(
        self,
        query: str,
        retrieved_chunks: list[dict[str, Any]],
        memory_context: dict[str, Any],
        system_instruction: str = ""
    ) -> str:
        """
        Dispatches request to active provider (Gemini, OpenAI, or local fallback).
        """
        provider = settings.ACTIVE_PROVIDER
        
        # Build prompt grounding if chunks exist
        if retrieved_chunks:
            context_text = "\n\n".join(
                [f"--- Document: {c['filename']} ({c['title']}) ---\n{c['content']}" for c in retrieved_chunks]
            )
            grounded_prompt = (
                f"You are the AI Student Support Assistant for {settings.COLLEGE_NAME}.\n"
                f"STUDENT CONTEXT: {memory_context}\n\n"
                f"KNOWLEDGE BASE CONTEXT (ONLY use this information, do not invent policies):\n"
                f"{context_text}\n\n"
                f"STUDENT QUESTION: {query}\n\n"
                f"INSTRUCTIONS:\n"
                f"- Answer concisely and helpfully using simple language.\n"
                f"- Cite the official source document at the end (e.g. Source: Attendance Regulations).\n"
                f"- If the required information is NOT in the context, explicitly say you could not find it and advise contacting college authorities.\n"
                f"- Do not hallucinate."
            )
        else:
            grounded_prompt = (
                f"You are the AI Student Support Assistant for {settings.COLLEGE_NAME}.\n"
                f"STUDENT CONTEXT: {memory_context}\n\n"
                f"STUDENT QUERY: {query}\n\n"
                f"Note: No college regulations were retrieved for this query. "
                f"If this is a greeting or general study inquiry, respond warmly and guide the student. "
                f"If this is asking for specific official college rules not in the knowledge base, "
                f"explicitly state that the information was not found in the college knowledge base."
            )

        if provider == "gemini" and settings.GEMINI_API_KEY:
            try:
                return await self.call_gemini(grounded_prompt, system_instruction)
            except Exception as e:
                print(f"Gemini API call failed ({e}), falling back to local grounded synthesis.")
        elif provider == "openai" and settings.OPENAI_API_KEY:
            try:
                return await self.call_openai(grounded_prompt, system_instruction)
            except Exception as e:
                print(f"OpenAI API call failed ({e}), falling back to local grounded synthesis.")

        # Local deterministic synthesis
        if retrieved_chunks:
            return self.local_grounded_synthesis(query, retrieved_chunks, memory_context)
        else:
            q_lower = query.lower().strip()
            if any(w in q_lower for w in ["hi", "hello", "hey", "greetings", "good morning", "good afternoon"]):
                name_str = f" {memory_context['student_name']}" if memory_context.get("student_name") else ""
                return (
                    f"Hello{name_str}! Welcome to the **AI Student Support Assistant** at ABC Institute of Technology.\n\n"
                    f"I can help you with:\n"
                    f"- **Attendance Regulations & Calculation** (e.g., *'I attended 45 out of 50 classes. Calculate my attendance.'*)\n"
                    f"- **Marks & Grade Evaluation** (e.g., *'I scored 78 out of 100. What is my percentage?'*)\n"
                    f"- **Personalized Study Schedules** (e.g., *'Create a 7-day study plan for me.'*)\n"
                    f"- **Official Academic Policies & Syllabus** (e.g., *'What is the attendance requirement?'* or *'Explain my semester syllabus'*)\n\n"
                    f"How can I assist your studies today?"
                )
            elif "thank" in q_lower:
                return "You're very welcome! Feel free to ask anytime if you need more study assistance or academic policy details. Best of luck with your academics!"
            else:
                return (
                    "I couldn't find this information in the available college knowledge base. "
                    "Please check the official college regulations or contact your department."
                )

llm_client = LLMClient()
