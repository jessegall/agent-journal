import re
from dataclasses import dataclass
from typing import ClassVar

from journal.events.rows.question_answered import QuestionAnswered
from journal.events.rows.question_asked import QuestionAsked
from journal.events.rows.row_settled import RowSettled
from journal.models.scoped import Scoped


@dataclass(frozen=True)
class Question(Scoped):
    text_fields: ClassVar[tuple[str, ...]] = ("text", "answer")
    PERSONAL: ClassVar[re.Pattern] = re.compile(r"\b(i|i'll|i'm|i've|me|my|we|we'll|us|our|you|you'll|you're|your)\b", re.IGNORECASE)

    text: str = ""
    options: tuple[str, ...] = ()
    answer: str | None = None

    def is_answered(self) -> bool:
        return self.answer is not None

    def is_settled(self) -> bool:
        return self.is_answered()

    def unclear_options(self) -> list[str]:
        return [option for option in self.options if self.PERSONAL.search(option)]

    def asked(self, at: float) -> "Question":
        return self.with_event(QuestionAsked(environment_id=self.environment_id, at=at, question_id=self.id))

    def answered(self, answer: str, at: float) -> "Question":
        return self.with_(answer=answer).with_event(QuestionAnswered(environment_id=self.environment_id, at=at, question_id=self.id)).with_event(RowSettled(environment_id=self.environment_id, at=at, ref=f"questions:{self.id}"))

