from dataclasses import dataclass

from journal.models.base import Scoped


@dataclass(frozen=True)
class Question(Scoped):
    text: str = ""
    options: tuple[str, ...] = ()
    answer: str | None = None

    def answered(self, answer: str) -> "Question": ...
