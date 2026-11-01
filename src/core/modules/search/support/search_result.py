from collections.abc import Sequence
from dataclasses import dataclass

from core.modules.search.support.search_hit import SearchHit


@dataclass(frozen=True)
class SearchResult:
    """What a search found: the terms, the newest hits, and how many rows hold every term in all."""

    terms: Sequence[str]
    hits: Sequence[SearchHit]
    total: int

    def lines(self) -> list[str]:
        if not self.hits:
            return [f"nothing here holds all of: {' '.join(self.terms)}"]
        shown = [hit.line() for hit in self.hits]
        if self.total > len(self.hits):
            shown.append(f"{self.total} rows hold all of: {', '.join(self.terms)}, the newest {len(self.hits)} are shown")
        return shown
