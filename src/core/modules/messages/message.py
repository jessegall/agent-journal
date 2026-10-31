from dataclasses import dataclass
from core.base.model.model import Model
from core.base.timestamp import Timestamp
from core.modules.messages.message_type import MessageType


@dataclass(frozen=True, kw_only=True)
class Message(Model):
    """One message in an environment's chat; a reply names the message it answers as its parent."""

    model_name = "message"
    cli_name = "message"

    environment_id: int
    agent_id: int | None = None
    parent_id: int | None = None
    creator_id: int
    type: MessageType
    text: str
    read_at: Timestamp | None = None
