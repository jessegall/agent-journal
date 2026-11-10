from engine.change.logged_event import LoggedEvent
from core.modules.chat.listeners.mark_listener import MarkListener
from core.modules.questions.models.enums.question_mark_type import QuestionMarkType
from core.modules.questions.models.enums.question_mark_variant import QuestionMarkVariant
from core.modules.questions.models.question import Question
from typing import TypeVar

from engine.change.changed import Changed


QuestionEvent = TypeVar("QuestionEvent", bound=Changed[Question])


class QuestionMarkListener(MarkListener[QuestionEvent]):
    """What the question mark listeners share: the questions module as the writer, and the process mark of one
    question, kept under the key question:<id> so it is updated in place and ended once. By default a listener
    shows that process mark while the question waits."""

    module_name = "journal.core.questions"

    def handle(self, event: QuestionEvent, logged: LoggedEvent) -> None:
        self.process(logged, event.row, ended=False)

    def process(self, logged: LoggedEvent, question: Question, ended: bool) -> None:
        self.show(logged, QuestionMarkType.QUESTION, QuestionMarkVariant.OPEN, f"Question {question.id}: {question.text}", question.session_agent_id,
                  "question", question.id, key=f"question:{question.id}", ended=ended)
