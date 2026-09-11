from typing import Any
from .document_loader import load_documents
from .vector_store import LocalVectorStore
from ..config import settings

class KnowledgeRetriever:
    """
    High-level RAG retriever coordinating document ingestion,
    indexing, confidence filtering, and non-hallucination verification.
    """
    def __init__(self):
        self.store = LocalVectorStore()
        self.documents: list[dict] = []
        self.is_indexed: bool = False
        self.reload()

    def reload(self) -> None:
        """Reloads all documents from the knowledge base directory and re-indexes."""
        self.documents = load_documents(settings.KB_DIR)
        self.store.build_index(self.documents)
        self.is_indexed = True

    def retrieve(self, query: str, top_k: int | None = None) -> tuple[bool, list[dict[str, Any]]]:
        """
        Retrieves relevant context chunks from the knowledge base.
        Returns:
            (found: bool, matches: list[dict])
        Enforces both cosine similarity threshold and query term coverage
        to strictly prevent hallucinations on out-of-domain queries.
        """
        k = top_k or settings.RAG_TOP_K
        results = self.store.search(query, top_k=k)
        
        if not results:
            return False, []

        top_match = results[0]
        # Filter matches that meet similarity threshold AND minimum coverage
        # Minimum coverage requires at least 40% of the query's informative tokens to be in the document
        min_coverage = 0.40 if len(query.split()) > 3 else 0.30
        
        valid_matches = [
            r for r in results 
            if r["score"] >= settings.RAG_SIMILARITY_THRESHOLD and r.get("coverage", 1.0) >= min_coverage
        ]

        if not valid_matches or top_match["score"] < settings.RAG_SIMILARITY_THRESHOLD or top_match.get("coverage", 1.0) < min_coverage:
            return False, []

        return True, valid_matches

    def get_documents_summary(self) -> list[dict[str, Any]]:
        """Returns metadata list of all loaded documents."""
        return [
            {
                "filename": doc["filename"],
                "title": doc["title"],
                "category": doc["category"],
                "char_count": doc["char_count"]
            }
            for doc in self.documents
        ]

    def get_document_content(self, filename: str) -> dict[str, Any] | None:
        """Returns the full text of a specific document."""
        for doc in self.documents:
            if doc["filename"].lower() == filename.lower():
                return doc
        return None

# Global instance
retriever = KnowledgeRetriever()
