from dataclasses import dataclass

from journal.models.scoped import Scoped


@dataclass(frozen=True)
class Question(Scoped):
    text: str = ""
    options: tuple[str, ...] = ()
    answer: str | None = None

    def answered(self, answer: str) -> "Question":
        return self.with_(answer=answer)
