from core.base.change.logged_event import LoggedEvent
from core.modules.chat.listeners.mark_listener import MarkListener
from core.modules.questions.models.enums.question_mark_type import QuestionMarkType
from core.modules.questions.models.enums.question_mark_variant import QuestionMarkVariant
from core.modules.questions.models.question import Question


class QuestionMarkListener(MarkListener):
    """What the question mark listeners share: the questions module as the writer, and the process mark of one
    question, kept under the key question:<id> so it is updated in place and ended once. By default a listener
    shows that process mark while the question waits."""

    module_name = "journal.core.questions"

    def handle(self, event: LoggedEvent) -> None:
        self.process(event, self.question(event), ended=False)

    def question(self, event: LoggedEvent) -> Question:
        return self.queries.query(Question).find(event.row_id)

    def process(self, event: LoggedEvent, question: Question, ended: bool) -> None:
        self.show(event, QuestionMarkType.QUESTION, QuestionMarkVariant.OPEN, f"Question {question.id}: {question.text}", question.environment_id, question.agent_id,
                  "question", question.id, key=f"question:{question.id}", ended=ended)
