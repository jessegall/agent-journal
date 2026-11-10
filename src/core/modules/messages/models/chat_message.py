from dataclasses import dataclass

from core.base.model.environment_scoped import EnvironmentScoped
from core.base.model.view_model import ViewModel
from engine.time.timestamp import Timestamp
from core.modules.messages.models.enums.message_type import MessageType
from core.modules.messages.models.support.views import CHAT_MESSAGES_SELECT


@dataclass(frozen=True, kw_only=True)
class ChatMessage(EnvironmentScoped, ViewModel):
    """A message as the chat draws it, read from the chat_messages view without who made it or when it was
    delivered."""

    cli_name = "message"
    view = "chat_messages"
    key = "id"
    select = CHAT_MESSAGES_SELECT

    id: int
    environment_id: int
    parent_id: int | None
    type: MessageType
    text: str
    read_at: Timestamp | None
    files: tuple[str, ...]
    captions: str
    reactions: str
    flowchart_edges: str
    peer: str
    recipient: str
    commented_row: str
    session_agent_id: int | None
    target_agent_id: int | None
    created_at: Timestamp
