from dataclasses import dataclass

from engine.chat.mark_outcome import MarkOutcome
from core.base.model.environment_scoped import EnvironmentScoped
from core.base.model.view_model import ViewModel
from engine.time.timestamp import Timestamp
from core.modules.chat.models.enums.chat_mark_state import ChatMarkState
from core.modules.messages.models.support.views import MAIN_CHAT_MARKS_SELECT


@dataclass(frozen=True, kw_only=True)
class MainChatMark(EnvironmentScoped, ViewModel):
    """A mark shown in the environment's main chat."""

    cli_name = "chat-mark"
    view = "main_chat_marks"
    key = "id"
    select = MAIN_CHAT_MARKS_SELECT

    id: int
    environment_id: int
    session_agent_id: int | None
    type: str
    variant: str
    mark_key: str
    text: str
    detail: str
    lines: str
    target_model: str
    target_id: int | None
    outcome: MarkOutcome
    figure: str
    fraction: float
    run_key: str
    run_step: int
    state: ChatMarkState
    ended_at: Timestamp | None
    created_at: Timestamp

    def json(self) -> dict[str, object]:
        answer = {name: value for name, value in super().json().items() if name != "mark_key"}
        return {**answer, "key": self.mark_key}
