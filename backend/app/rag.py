from __future__ import annotations

import math
import re
from collections import Counter

from .catalog import EVIDENCE
from .models import Evidence


TOKEN = re.compile(r"[a-z0-9_.:-]+")


def tokenize(text: str) -> list[str]:
    return TOKEN.findall(text.lower())


class DocumentationRetriever:
    """Small, deterministic retrieval layer for the zero-key demo.

    The production adapter can replace this scorer with FAISS while preserving
    connector/version metadata filtering and evidence IDs.
    """

    def __init__(self, documents: list[Evidence] | None = None) -> None:
        self.documents = documents or EVIDENCE

    def retrieve(self, query: str, *, connector: str | None = None, limit: int = 5) -> list[Evidence]:
        query_tokens = Counter(tokenize(query))
        scored: list[tuple[float, Evidence]] = []

        for document in self.documents:
            if connector and document.connector.lower() != connector.lower():
                continue
            document_tokens = Counter(document.tokens + tokenize(document.title + " " + document.excerpt))
            overlap = set(query_tokens) & set(document_tokens)
            lexical = sum(min(query_tokens[token], document_tokens[token]) for token in overlap)
            coverage = lexical / max(len(query_tokens), 1)
            rarity_bonus = sum(1 / math.sqrt(document_tokens[token]) for token in overlap)
            score = coverage + rarity_bonus * 0.12 + document.confidence * 0.08
            if score > 0.08:
                scored.append((score, document))

        scored.sort(key=lambda pair: pair[0], reverse=True)
        return [document.model_copy(update={"confidence": min(0.99, max(document.confidence, score))}) for score, document in scored[:limit]]


retriever = DocumentationRetriever()
