from dataclasses import dataclass
from typing import ClassVar

from journal.models.scoped import Scoped


@dataclass(frozen=True)
class Question(Scoped):
    text_fields: ClassVar[tuple[str, ...]] = ("text", "answer")

    text: str = ""
    options: tuple[str, ...] = ()
    answer: str | None = None

    def is_answered(self) -> bool:
        return self.answer is not None

    def is_settled(self) -> bool:
        """Nothing waiting on it waits any longer."""
        return self.is_answered()

    def answered(self, answer: str) -> "Question":
        return self.with_(answer=answer)

