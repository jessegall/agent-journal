from core.base.actor_type import ActorType
from core.base.change.logged_event import LoggedEvent
from core.modules.actors.models.actor_record import ActorRecord
from core.modules.questions.listeners.question_mark_listener import QuestionMarkListener
from core.modules.questions.models.enums.question_mark_type import QuestionMarkType
from core.modules.questions.models.enums.question_mark_variant import QuestionMarkVariant
from core.base.change.moved import Moved
from core.modules.questions.models.lifecycles.question_lifecycle import QuestionLifecycle
from core.modules.questions.models.question import Question


class QuestionAnsweredMarkListener(QuestionMarkListener[Moved[Question]]):
    """When a question is answered, its card stays in place and shows the answer, and a new mark says it was answered
    at this moment; both are on the side of whoever answered."""

    name = "questions.answered-mark"
    moves = tuple([QuestionLifecycle.answer])

    def handle(self, event: Moved[Question], logged: LoggedEvent) -> None:
        question = event.row
        side = self.variant(logged)
        self.show(logged, QuestionMarkType.QUESTION, side, f"Question {question.id} answered",
                  question.session_agent_id, "question", question.id, key=f"question:{question.id}", ended=True)
        self.show(logged, QuestionMarkType.ANSWER, side, f"Question {question.id} answered", question.session_agent_id, "question", question.id)

    def variant(self, logged: LoggedEvent) -> QuestionMarkVariant:
        is_user = self.queries.query(ActorRecord).find(logged.actor_id).type is ActorType.USER
        return QuestionMarkVariant.USER if is_user else QuestionMarkVariant.AGENT
