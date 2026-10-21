from dataclasses import dataclass

from journal.models.model import Model

AROUND = 160


@dataclass(frozen=True)
class SearchHit:
    """One thing a search found: what it is, such as task 12, and the passage that holds the words."""

    ref: str
    passage: str

    @classmethod
    def of(cls, row: Model, terms: list[str]) -> "Found":
        return cls(f"{row.noun()} {row.id}", cls.around(row.mentioning_text(), terms))

    @staticmethod
    def around(text: str, terms: list[str]) -> str:
        flat = " ".join(text.split())
        time = max(0, flat.lower().find(terms[0].lower()) - AROUND // 4)
        cut = flat[time:time + AROUND]
        return ("…" if time else "") + cut + ("…" if time + AROUND < len(flat) else "")

    def line(self) -> str:
        return f"{self.ref}: {self.passage}"
