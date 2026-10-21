import re
from dataclasses import dataclass
from typing import ClassVar

from journal.events.rows.question_answered import QuestionAnswered
from journal.events.rows.question_posed import QuestionPosed
from journal.events.rows.row_resolved import RowResolved
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

    def asked(self, time: float) -> "Question":
        return self.with_event(QuestionPosed(environment_id=self.environment_id, time=time, question_id=self.id))

    def answered(self, answer: str, time: float) -> "Question":
        return self.with_(answer=answer).with_event(QuestionAnswered(environment_id=self.environment_id, time=time, question_id=self.id)).with_event(RowResolved(environment_id=self.environment_id, time=time, ref=f"questions:{self.id}"))

    def summary_line(self) -> str:
        return self.first_line(self.text)
