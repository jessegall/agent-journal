from core.base.actor_type import ActorType
from core.base.change.logged_event import LoggedEvent
from core.modules.actors.models.actor_record import ActorRecord
from core.modules.questions.listeners.question_mark_listener import QuestionMarkListener
from core.modules.questions.models.enums.question_mark_type import QuestionMarkType
from core.modules.questions.models.enums.question_mark_variant import QuestionMarkVariant


class QuestionAnsweredMarkListener(QuestionMarkListener):
    """When a question is answered, its card stays in place and shows the answer, and a new mark says it was answered
    at this moment, on the side of whoever answered."""

    name = "questions.answered-mark"
    event = "question.answer"

    def handle(self, event: LoggedEvent) -> None:
        question = self.question(event)
        self.show(event, QuestionMarkType.QUESTION, QuestionMarkVariant.ANSWERED, f"Question {question.id} answered", question.environment_id,
                  question.agent_id, "question", question.id, key=f"question:{question.id}", ended=True)
        self.show(event, QuestionMarkType.ANSWER, self.variant(event), f"Question {question.id} answered", question.environment_id, question.agent_id, "question", question.id)

    def variant(self, event: LoggedEvent) -> QuestionMarkVariant:
        is_user = self.queries.query(ActorRecord).find(event.actor_id).type is ActorType.USER
        return QuestionMarkVariant.USER if is_user else QuestionMarkVariant.AGENT
