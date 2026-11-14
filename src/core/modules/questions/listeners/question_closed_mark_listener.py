from engine.event.logged_event import LoggedEvent
from core.modules.questions.listeners.question_mark_listener import QuestionMarkListener
from core.modules.questions.models.enums.question_mark_type import QuestionMarkType
from core.modules.questions.models.enums.question_mark_variant import QuestionMarkVariant
from engine.event.moved import Moved
from core.modules.questions.models.lifecycles.question_lifecycle import QuestionLifecycle
from core.modules.questions.models.question import Question


class QuestionClosedMarkListener(QuestionMarkListener[Moved[Question]]):
    """When a question is closed, its mark ends in place and says so."""

    name = "questions.closed-mark"
    moves = tuple([QuestionLifecycle.close])

    def handle(self, event: Moved[Question], logged: LoggedEvent) -> None:
        question = event.row
        self.show(logged, QuestionMarkType.QUESTION, QuestionMarkVariant.CLOSED, f"Question {question.id} closed without an answer", 
                  question.session_agent_id, "question", question.id, key=f"question:{question.id}", ended=True)
