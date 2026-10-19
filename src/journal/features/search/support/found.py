from dataclasses import dataclass

from journal.models.model import Model

AROUND = 160
"""The most characters of a find shown, around the first word looked for."""


@dataclass(frozen=True)
class Found:
    """One thing a search found: what it is, such as task 12, and the passage that holds the words."""

    ref: str
    passage: str

    @classmethod
    def of(cls, row: Model, words: list[str]) -> "Found":
        return cls(f"{row.noun()} {row.id}", cls.around(row.mentioning_text(), words))

    @staticmethod
    def around(text: str, words: list[str]) -> str:
        flat = " ".join(text.split())
        at = max(0, flat.lower().find(words[0].lower()) - AROUND // 4)
        cut = flat[at:at + AROUND]
        return ("…" if at else "") + cut + ("…" if at + AROUND < len(flat) else "")

    def line(self) -> str:
        return f"{self.ref}: {self.passage}"
