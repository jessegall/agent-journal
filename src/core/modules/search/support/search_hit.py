from dataclasses import dataclass

from collections.abc import Sequence

from core.base.model.model import Model
from core.base.search_term import SearchTerm
from core.base.timestamp import Timestamp
from core.base.driver.nudge_declaration import CUT_MARK

EXCERPT_CHARACTERS = 160
LEAD_CHARACTERS = 40


@dataclass(frozen=True)
class SearchHit:
    """One row that holds the terms, or some of them: its model's command name, its number, when it was made, how many terms it holds, its model's rank and a short
    excerpt of its text from a little before the first term, its spaces folded and a cut end marked."""

    cli_name: str
    row_id: int
    created_at: Timestamp
    excerpt: str
    held: int = 0
    rank: int = 0

    @classmethod
    def matched(cls, row: Model, terms: Sequence[str]) -> "SearchHit":
        text = " ".join(row.search_text().split())
        positions = [position for position in (text.lower().find(SearchTerm.stem(term)) for term in terms) if position >= 0]
        start = max(0, min(positions, default=0) - LEAD_CHARACTERS)
        end = start + EXCERPT_CHARACTERS
        excerpt = (CUT_MARK if start else "") + text[start:end] + (CUT_MARK if end < len(text) else "")
        return cls(row.cli_name, row.id, row.creation_timestamp(), excerpt, row.terms_held(terms), row.search_rank)

    def line(self) -> str:
        return f"{self.cli_name} {self.row_id}: {self.excerpt}"
