import os
from pathlib import Path
from ..config import settings

def load_documents(kb_dir: Path | None = None) -> list[dict]:
    """
    Scans the knowledge base directory and loads all .txt documents.
    Extracts metadata from headers if present.
    """
    target_dir = kb_dir or settings.KB_DIR
    if not target_dir.exists():
        os.makedirs(target_dir, exist_ok=True)
        return []

    documents = []
    for file_path in sorted(target_dir.glob("*.txt")):
        try:
            with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                content = f.read().strip()
                
            if not content:
                continue

            # Extract title from DOCUMENT: or first line
            title = file_path.stem.replace("_", " ").title()
            for line in content.splitlines()[:5]:
                if line.startswith("DOCUMENT:"):
                    title = line.replace("DOCUMENT:", "").strip()
                    break

            # Category mapping based on filename
            stem = file_path.stem.lower()
            if "attendance" in stem:
                category = "Attendance Regulations"
            elif "exam" in stem:
                category = "Examination Rules"
            elif "internal" in stem or "cia" in stem:
                category = "Internal Assessment"
            elif "pass" in stem or "grade" in stem:
                category = "Passing & Grading"
            elif "calendar" in stem:
                category = "Academic Calendar"
            elif "dept" in stem or "department" in stem:
                category = "Departments"
            elif "syllabus" in stem:
                category = "Syllabus & Curriculum"
            elif "faq" in stem:
                category = "Student FAQs"
            else:
                category = "General Academic"

            documents.append({
                "filename": file_path.name,
                "title": title,
                "category": category,
                "content": content,
                "char_count": len(content),
                "path": str(file_path)
            })
        except Exception as e:
            print(f"Error loading {file_path}: {e}")

    return documents
