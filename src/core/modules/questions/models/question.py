from dataclasses import dataclass

from core.base.model.model import Model
from core.modules.questions.models.enums.question_state import QuestionState
from core.modules.questions.models.lifecycles.question_lifecycle import QuestionLifecycle

TEXT_LIMIT_CHARACTERS = 500
OPTION_LIMIT_CHARACTERS = 120


@dataclass(frozen=True, kw_only=True)
class Question(Model):
    """What an agent asks the user, with the options it offers and the one it recommends, until it is answered
    or closed."""

    model_name = "question"
    cli_name = "question"
    search_fields = ["text", "answer"]
    lifecycle = QuestionLifecycle

    environment_id: int
    agent_id: int
    creator_id: int
    text: str
    options: tuple[str, ...] = ()
    recommended: str = ""
    answer: str = ""
    message_id: int | None = None
    state: QuestionState = QuestionState.OPEN

