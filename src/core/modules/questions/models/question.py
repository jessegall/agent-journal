from dataclasses import dataclass

from engine.model.environment_scoped import EnvironmentScoped
from engine.model.model import Model
from engine.model.state_holder import StateHolder
from core.modules.questions.models.enums.question_state import QuestionState
from core.modules.questions.models.lifecycles.question_lifecycle import QuestionLifecycle
from core.modules.documents.models.enums.comment_selection_type import CommentSelectionType

TEXT_LIMIT_CHARACTERS = 500
TITLE_LIMIT_CHARACTERS = 60
CONTEXT_LIMIT_CHARACTERS = 2000
OPTION_LIMIT_CHARACTERS = 120


@dataclass(frozen=True, kw_only=True)
class Question(EnvironmentScoped, Model, StateHolder):
    """What an agent asks the user, a short title in text and the context that lets it be read on its own, with the
    options it offers and the one it recommends, until it is answered or closed. A question asked before
    context existed has none."""

    model_name = "question"
    cli_name = "question"
    search_fields = ["text", "context", "answer"]
    lifecycle = QuestionLifecycle
    added_state_moves = tuple([QuestionLifecycle.close])

    environment_id: int = 0
    session_agent_id: int
    creator_id: int
    text: str
    context: str = ""
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

