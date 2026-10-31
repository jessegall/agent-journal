from core.base.change.logged_event import LoggedEvent
from core.modules.questions.listeners.question_mark_listener import QuestionMarkListener
from core.modules.questions.models.enums.question_mark_type import QuestionMarkType
from core.modules.questions.models.enums.question_mark_variant import QuestionMarkVariant


class QuestionClosedMarkListener(QuestionMarkListener):
    """When a question is closed, its process mark ends and the chat shows a close mark."""

    name = "questions.closed-mark"
    event = "question.close"

    def handle(self, event: LoggedEvent) -> None:
        question = self.question(event)
        self.process(event, question, ended=True)
        self.show(event, QuestionMarkType.QUESTION, QuestionMarkVariant.CLOSED, f"Question {question.id} closed without an answer", question.environment_id,
                  question.agent_id, "question", question.id)
