from dataclasses import dataclass

from journal.models.model import Model

SNIPPET_RADIUS = 160


@dataclass(frozen=True)
class SearchHit:
    """One thing a search found: what it is, such as task 12, and the passage that holds the words."""

    ref: str
    passage: str

    @classmethod
    def of(cls, row: Model, terms: list[str]) -> "Found":
        return cls(f"{row.noun()} {row.id}", cls.excerpt(row.mentioning_text(), terms))

    @staticmethod
    def excerpt(text: str, terms: list[str]) -> str:
        flat = " ".join(text.split())
        time = max(0, flat.lower().find(terms[0].lower()) - SNIPPET_RADIUS // 4)
        cut = flat[time:time + SNIPPET_RADIUS]
        return ("…" if time else "") + cut + ("…" if time + SNIPPET_RADIUS < len(flat) else "")

    def line(self) -> str:
        return f"{self.ref}: {self.passage}"
