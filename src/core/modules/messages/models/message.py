from dataclasses import dataclass
from core.base.model.model import Model
from core.base.timestamp import Timestamp
from core.modules.messages.models.enums.message_type import MessageType

TITLE_CHARACTERS = 60


@dataclass(frozen=True, kw_only=True)
class Message(Model):
    """One message in an environment's chat; a reply names the message it answers as its parent. Its title,
    which a comment on it names it by, is the first line of its text."""

    model_name = "message"
    cli_name = "message"
    search_fields = ["text"]

    environment_id: int
    agent_id: int | None = None
    parent_id: int | None = None
    creator_id: int
    type: MessageType
    text: str
    read_at: Timestamp | None = None
    delivered_at: Timestamp | None = None
    files: tuple[str, ...] = ()
    captions: str = "{}"
    reactions: str = "[]"
    flowchart_edges: str = "[]"
    peer: str = ""
    peer_key: str = ""
    recipient: str = ""

    @property
    def title(self) -> str:
        first_line = next(iter(self.text.strip().splitlines()), "")
        return f"{first_line[:TITLE_CHARACTERS]}…" if len(first_line) > TITLE_CHARACTERS else first_line
