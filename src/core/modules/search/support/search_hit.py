from dataclasses import dataclass

from core.base.model.model import Model
from core.base.timestamp import Timestamp

EXCERPT_CHARACTERS = 160
LEAD_CHARACTERS = 40
CUT_MARK = "…"


@dataclass(frozen=True)
class SearchHit:
    """One row that holds every term: its model's command name, its number, when it was made, and a short
    excerpt of its text from a little before the first term, its spaces folded and a cut end marked."""

    cli_name: str
    row_id: int
    created_at: Timestamp
    excerpt: str

    @classmethod
    def matched(cls, row: Model, first_term: str) -> "SearchHit":
        text = " ".join(row.search_text().split())
        start = max(0, text.lower().find(first_term.lower()) - LEAD_CHARACTERS)
        end = start + EXCERPT_CHARACTERS
        excerpt = (CUT_MARK if start else "") + text[start:end] + (CUT_MARK if end < len(text) else "")
        return cls(row.cli_name, row.id, row.creation_timestamp(), excerpt)

    def line(self) -> str:
        return f"{self.cli_name} {self.row_id}: {self.excerpt}"
