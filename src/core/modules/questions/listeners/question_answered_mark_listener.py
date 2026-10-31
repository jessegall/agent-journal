from core.base.change.logged_event import LoggedEvent
from core.modules.questions.listeners.question_mark_listener import QuestionMarkListener
from core.modules.questions.models.enums.question_mark_type import QuestionMarkType
from core.modules.questions.models.enums.question_mark_variant import QuestionMarkVariant


class QuestionAnsweredMarkListener(QuestionMarkListener):
    """When a question is answered, its process mark ends and the chat shows an answer mark."""

    name = "questions.answered-mark"
    event = "question.answer"

    def handle(self, event: LoggedEvent) -> None:
        question = self.question(event)
        self.process(event, question, ended=True)
        self.show(event, QuestionMarkType.QUESTION, QuestionMarkVariant.ANSWERED, f"Question {question.id} answered: {question.answer}", question.environment_id,
                  question.agent_id, "question", question.id)
