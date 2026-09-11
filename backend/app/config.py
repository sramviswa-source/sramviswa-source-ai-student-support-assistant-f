import os
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from repo root .env if present
repo_root = Path(__file__).resolve().parent.parent.parent
env_path = repo_root / ".env"
if env_path.exists():
    load_dotenv(dotenv_path=env_path)
else:
    load_dotenv()

class Settings:
    PROJECT_NAME: str = "AI Student Support Assistant"
    PROJECT_VERSION: str = "1.0.0"
    COLLEGE_NAME: str = "ABC Institute of Technology [SAMPLE DATA]"
    
    # Paths
    REPO_ROOT: Path = repo_root
    KB_DIR: Path = repo_root / "knowledge_base"
    
    # LLM Provider settings
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "").strip()
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "").strip()
    GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")
    OPENAI_MODEL: str = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
    
    # Provider auto-detection or explicit configuration
    # Options: "gemini", "openai", "local" (rule & template grounded intelligence)
    DEFAULT_PROVIDER: str = os.getenv("LLM_PROVIDER", "").strip().lower()
    
    @property
    def ACTIVE_PROVIDER(self) -> str:
        if self.DEFAULT_PROVIDER in ["gemini", "openai", "local"]:
            return self.DEFAULT_PROVIDER
        if self.GEMINI_API_KEY:
            return "gemini"
        if self.OPENAI_API_KEY:
            return "openai"
        return "local"

    # Server settings
    HOST: str = os.getenv("HOST", "127.0.0.1")
    PORT: int = int(os.getenv("PORT", "8000"))
    CORS_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "*"
    ]
    
    # RAG Settings
    RAG_CHUNK_SIZE: int = 400
    RAG_CHUNK_OVERLAP: int = 80
    RAG_SIMILARITY_THRESHOLD: float = 0.12  # Below this similarity, declare information unavailable
    RAG_TOP_K: int = 3

settings = Settings()
