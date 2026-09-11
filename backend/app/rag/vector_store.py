import math
import re
from collections import Counter
from typing import Any

# Standard English stopwords to filter out non-informative noise
STOPWORDS = {
    "a", "about", "above", "after", "again", "against", "all", "am", "an", "and",
    "any", "are", "aren't", "as", "at", "be", "because", "been", "before", "being",
    "below", "between", "both", "but", "by", "can", "cannot", "could", "did", "do",
    "does", "doing", "don't", "down", "during", "each", "few", "for", "from", "further",
    "had", "has", "have", "having", "he", "her", "here", "hers", "herself", "him",
    "himself", "his", "how", "i", "if", "in", "into", "is", "isn't", "it", "its",
    "itself", "let's", "me", "more", "most", "my", "myself", "no", "nor", "not", "of",
    "off", "on", "once", "only", "or", "other", "ought", "our", "ours", "ourselves",
    "out", "over", "own", "same", "shan't", "she", "should", "so", "some", "such",
    "than", "that", "the", "their", "theirs", "them", "themselves", "then", "there",
    "these", "they", "this", "those", "through", "to", "too", "under", "until", "up",
    "very", "was", "wasn't", "we", "were", "weren't", "what", "when", "where", "which",
    "while", "who", "whom", "why", "with", "won't", "would", "you", "your", "yours",
    "yourself", "yourselves"
}

def tokenize(text: str) -> list[str]:
    """Tokenizes text into cleaned lower-case tokens, stripping non-alphanumeric chars."""
    tokens = re.findall(r"\b[a-zA-Z0-9_\-\.]{2,}\b", text.lower())
    return [t for t in tokens if t not in STOPWORDS]

class Chunk:
    def __init__(self, text: str, source_file: str, title: str, category: str, chunk_id: int):
        self.text = text
        self.source_file = source_file
        self.title = title
        self.category = category
        self.chunk_id = chunk_id
        self.tokens = tokenize(text)
        self.term_freq = Counter(self.tokens)

class LocalVectorStore:
    """
    Lightweight, robust TF-IDF and Cosine Similarity vector store.
    Provides fast, deterministic, and explainable semantic retrieval
    without external vector DB dependencies.
    """
    def __init__(self):
        self.chunks: list[Chunk] = []
        self.doc_count: int = 0
        self.idf: dict[str, float] = {}
        self.chunk_vectors: list[dict[str, float]] = []

    def chunk_document(self, doc: dict) -> list[Chunk]:
        """
        Splits a document text into section/paragraph-based chunks.
        """
        content = doc["content"]
        sections = re.split(r"\n\s*\n", content)
        chunks = []
        chunk_counter = 0

        for section in sections:
            clean_sec = section.strip()
            if not clean_sec or len(clean_sec) < 30:
                continue

            # If section is very long, break it down further by lines
            if len(clean_sec) > 600:
                sub_lines = clean_sec.splitlines()
                buffer = []
                buf_len = 0
                for line in sub_lines:
                    buffer.append(line)
                    buf_len += len(line)
                    if buf_len >= 400:
                        sub_text = "\n".join(buffer)
                        chunks.append(Chunk(
                            text=sub_text,
                            source_file=doc["filename"],
                            title=doc["title"],
                            category=doc["category"],
                            chunk_id=chunk_counter
                        ))
                        chunk_counter += 1
                        buffer = buffer[-2:] if len(buffer) >= 2 else []
                        buf_len = sum(len(l) for l in buffer)
                if buffer:
                    sub_text = "\n".join(buffer)
                    chunks.append(Chunk(
                        text=sub_text,
                        source_file=doc["filename"],
                        title=doc["title"],
                        category=doc["category"],
                        chunk_id=chunk_counter
                    ))
                    chunk_counter += 1
            else:
                chunks.append(Chunk(
                    text=clean_sec,
                    source_file=doc["filename"],
                    title=doc["title"],
                    category=doc["category"],
                    chunk_id=chunk_counter
                ))
                chunk_counter += 1

        return chunks

    def build_index(self, documents: list[dict]) -> None:
        """Indexes all documents, builds vocabulary, calculates IDF, and creates chunk vectors."""
        self.chunks = []
        for doc in documents:
            self.chunks.extend(self.chunk_document(doc))

        self.doc_count = len(self.chunks)
        if self.doc_count == 0:
            self.idf = {}
            self.chunk_vectors = []
            return

        # Calculate document frequency (DF) for each term across all chunks
        df: Counter = Counter()
        for chunk in self.chunks:
            unique_terms = set(chunk.tokens)
            df.update(unique_terms)

        # Smooth IDF: log(1 + (N / (1 + df)))
        self.idf = {
            term: math.log(1.0 + (self.doc_count / (1.0 + freq)))
            for term, freq in df.items()
        }

        # Build normalized TF-IDF vector for each chunk
        self.chunk_vectors = []
        for chunk in self.chunks:
            vec = {}
            norm_sq = 0.0
            for term, count in chunk.term_freq.items():
                tfidf = (1.0 + math.log(count)) * self.idf.get(term, 1.0)
                vec[term] = tfidf
                norm_sq += tfidf ** 2

            norm = math.sqrt(norm_sq) if norm_sq > 0 else 1.0
            norm_vec = {k: v / norm for k, v in vec.items()}
            self.chunk_vectors.append(norm_vec)

    def search(self, query: str, top_k: int = 3) -> list[dict[str, Any]]:
        """Searches index for most relevant chunks using Cosine Similarity."""
        if not self.chunks or not query.strip():
            return []

        query_tokens = tokenize(query)
        if not query_tokens:
            return []

        q_tf = Counter(query_tokens)
        q_vec = {}
        q_norm_sq = 0.0

        for term, count in q_tf.items():
            if term in self.idf:
                weight = (1.0 + math.log(count)) * self.idf[term]
                q_vec[term] = weight
                q_norm_sq += weight ** 2

        if q_norm_sq == 0.0:
            return []

        q_norm = math.sqrt(q_norm_sq)
        norm_q_vec = {k: v / q_norm for k, v in q_vec.items()}

        scores = []
        for idx, chunk_vec in enumerate(self.chunk_vectors):
            dot_product = sum(norm_q_vec[k] * chunk_vec.get(k, 0.0) for k in norm_q_vec)
            if dot_product > 0.0:
                chunk = self.chunks[idx]
                matched_terms = sum(1 for k in q_tf if k in chunk.term_freq)
                coverage = matched_terms / len(q_tf)
                scores.append((dot_product, coverage, chunk))

        # Sort primarily by dot_product
        scores.sort(key=lambda x: x[0], reverse=True)
        results = []
        for dot_product, coverage, chunk in scores[:top_k]:
            results.append({
                "score": round(float(dot_product), 4),
                "coverage": round(float(coverage), 4),
                "title": chunk.title,
                "filename": chunk.source_file,
                "category": chunk.category,
                "content": chunk.text,
                "chunk_id": chunk.chunk_id
            })

        return results
