from dataclasses import dataclass

from collections.abc import Sequence
from typing import Any

from engine.model.model import Model
from engine.text.search_term import SearchTerm
from engine.time.timestamp import Timestamp
from engine.driver.message_template import CUT_MARK

EXCERPT_CHARACTERS = 160
LEAD_CHARACTERS = 40


@dataclass(frozen=True)
class SearchHit:
    """A search result with its matching term count, rank and text excerpt, and the row's title, its state
    when it has one and the rest of its searched text, so the result is read without opening the row."""

    cli_name: str
    row_id: int
    created_at: Timestamp
    excerpt: str
    matched_tokens: Sequence[str] = ()
    rank: int = 0
    title: str = ""
    body: str = ""
    state: str = ""

    @classmethod
    def matched(cls, row: Model, terms: Sequence[str]) -> "SearchHit":
        text = " ".join(row.search_text().split())
        positions = [position for position in (text.lower().find(SearchTerm.stem(term)) for term in terms) if position >= 0]
        start = max(0, min(positions, default=0) - LEAD_CHARACTERS)
        end = start + EXCERPT_CHARACTERS
        excerpt = (CUT_MARK if start else "") + text[start:end] + (CUT_MARK if end < len(text) else "")
        # the first searched field names the row, the others are what a reader reads under it
        title, *remainder = (str(getattr(row, name) or "") for name in row.search_fields)
        return cls(row.cli_name, row.id, row.creation_timestamp(), excerpt, row.matching_terms(terms), row.search_rank, title, "\n\n".join(part for part in remainder if part), str(getattr(row, "state", "") or ""))

    @classmethod
    def restored(cls, stored: dict[str, Any]) -> "SearchHit":
        return cls(stored["cli_name"], stored["row_id"], Timestamp.parsed(stored["created_at"]), stored["excerpt"], stored["matched_tokens"], stored["rank"], stored["title"], stored["body"], stored.get("state", ""))

    def stored(self) -> dict[str, object]:
        return {"cli_name": self.cli_name, "row_id": self.row_id, "created_at": self.created_at.text, "excerpt": self.excerpt, "matched_tokens": list(self.matched_tokens), "rank": self.rank, "title": self.title, "body": self.body, "state": self.state}

    @property
    def matched_terms(self) -> int:
        return len(self.matched_tokens)

    def line(self) -> str:
        return f"{self.cli_name} {self.row_id}: {self.excerpt}"

    def line_with_words(self) -> str:
        return f"{self.line()} [holds: {', '.join(self.matched_tokens)}]"
