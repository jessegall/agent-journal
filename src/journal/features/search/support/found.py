from dataclasses import dataclass

from journal.models.model import Model

AROUND = 160


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
        time = max(0, flat.lower().find(words[0].lower()) - AROUND // 4)
        cut = flat[time:time + AROUND]
        return ("…" if time else "") + cut + ("…" if time + AROUND < len(flat) else "")

    def line(self) -> str:
        return f"{self.ref}: {self.passage}"
