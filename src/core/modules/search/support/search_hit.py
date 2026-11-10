from dataclasses import dataclass

from collections.abc import Sequence
from typing import Any

from core.base.model.model import Model
from engine.text.search_term import SearchTerm
from core.base.timestamp import Timestamp
from core.base.driver.nudge_declaration import CUT_MARK

EXCERPT_CHARACTERS = 160
LEAD_CHARACTERS = 40


@dataclass(frozen=True)
class SearchHit:
    """A search result with its matching term count, rank and text excerpt."""

    cli_name: str
    row_id: int
    created_at: Timestamp
    excerpt: str
    matched_terms: int = 0
    rank: int = 0

    @classmethod
    def matched(cls, row: Model, terms: Sequence[str]) -> "SearchHit":
        text = " ".join(row.search_text().split())
        positions = [position for position in (text.lower().find(SearchTerm.stem(term)) for term in terms) if position >= 0]
        start = max(0, min(positions, default=0) - LEAD_CHARACTERS)
        end = start + EXCERPT_CHARACTERS
        excerpt = (CUT_MARK if start else "") + text[start:end] + (CUT_MARK if end < len(text) else "")
        return cls(row.cli_name, row.id, row.creation_timestamp(), excerpt, row.count_matching_terms(terms), row.search_rank)

    @classmethod
    def restored(cls, stored: dict[str, Any]) -> "SearchHit":
        return cls(stored["cli_name"], stored["row_id"], Timestamp.parsed(stored["created_at"]), stored["excerpt"], stored["matched_terms"], stored["rank"])

    def stored(self) -> dict[str, object]:
        return {"cli_name": self.cli_name, "row_id": self.row_id, "created_at": self.created_at.text, "excerpt": self.excerpt, "matched_terms": self.matched_terms, "rank": self.rank}

    def line(self) -> str:
        return f"{self.cli_name} {self.row_id}: {self.excerpt}"
