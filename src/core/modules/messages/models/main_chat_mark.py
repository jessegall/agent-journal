from dataclasses import dataclass

from core.base.chat.mark_outcome import MarkOutcome
from core.base.model.view_model import ViewModel
from core.base.timestamp import Timestamp
from core.modules.chat.models.enums.chat_mark_state import ChatMarkState
from core.modules.messages.models.support.views import MAIN_CHAT_MARKS_SELECT


@dataclass(frozen=True, kw_only=True)
class MainChatMark(ViewModel):
    """A mark of the main chat, read from the main_chat_marks view, which leaves out what a worker or a subagent does;
    the mark's key is read as mark_key and answered as key, since a view model's own key is a class name."""

    cli_name = "chat-mark"
    view = "main_chat_marks"
    key = "id"
    select = MAIN_CHAT_MARKS_SELECT

    id: int
    environment_id: int
    agent_id: int | None
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
