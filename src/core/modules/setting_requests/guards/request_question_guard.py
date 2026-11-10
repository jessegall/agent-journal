from engine.enums.actor_type import ActorType
from engine.event.changed import Changed
from engine.command.context import Context
from engine.guard.guard import Guard
from engine.query.queries import Queries
from engine.errors.refusal import Refusal
from core.modules.questions.models.enums.question_state import QuestionState
from core.modules.questions.models.question import Question
from core.modules.setting_requests.models.setting_request import SettingRequest


class RequestQuestionGuard(Guard[Changed[Question]]):
    """Only a person answers or edits a question that asks to change a setting; the agent that asked may close it."""

    name = "setting-requests.person-answers"
    is_safety = True

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def check(self, event: Changed[Question], context: Context) -> None:
        if context.actor.type is not ActorType.AGENT or event.row.state is QuestionState.CLOSED:
            return
        if self.queries.query(SettingRequest).filter(question_id=event.row.id).exists():
            raise Refusal(f"a person was asked to decide question {event.row.id} in the dock")
