from dataclasses import dataclass

from core.base.model.environment_scoped import EnvironmentScoped
from core.base.model.model import Model
from core.base.model.state_holder import StateHolder
from core.modules.questions.models.enums.question_state import QuestionState
from core.modules.questions.models.lifecycles.question_lifecycle import QuestionLifecycle
from core.modules.documents.models.enums.comment_selection_type import CommentSelectionType

TEXT_LIMIT_CHARACTERS = 500
OPTION_LIMIT_CHARACTERS = 120


@dataclass(frozen=True, kw_only=True)
class Question(EnvironmentScoped, Model, StateHolder):
    """What an agent asks the user, with the options it offers and the one it recommends, until it is answered
    or closed."""

    model_name = "question"
    cli_name = "question"
    search_fields = ["text", "answer"]
    lifecycle = QuestionLifecycle
    added_state_moves = tuple([QuestionLifecycle.close])

    environment_id: int = 0
    session_agent_id: int
    creator_id: int
    text: str
    options: tuple[str, ...] = ()
    recommended: str = ""
    answer: str = ""
    message_id: int | None = None
    state: QuestionState = QuestionState.OPEN
    row_model: str = ""
    row_id: int | None = None
    quote: str = ""
    position: int | None = None
    selection_type: CommentSelectionType = CommentSelectionType.TEXT

