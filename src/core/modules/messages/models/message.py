from dataclasses import dataclass
from core.base.model.environment_scoped import EnvironmentScoped
from core.base.model.model import Model
from engine.time.timestamp import Timestamp
from core.modules.messages.models.enums.message_type import MessageType

TITLE_CHARACTERS = 60
PROMPT_MESSAGE_KEY = "typed-prompt"


@dataclass(frozen=True, kw_only=True)
class Message(EnvironmentScoped, Model):
    """One message in an environment's chat; a reply names the message it answers as its parent. Its title,
    which a comment on it names it by, is the first line of its text."""

    model_name = "message"
    shared_rows = True
    cli_name = "message"
    search_fields = ["text"]
    search_rank = 1
    hidden_fields = frozenset(["is_chat_visible", "is_agent_text"])

    environment_id: int = 0
    session_agent_id: int | None = None
    target_agent_id: int | None = None
    parent_id: int | None = None
    creator_id: int
    type: MessageType
    text: str
    read_at: Timestamp | None = None
    read_notice_at: Timestamp | None = None
    delivered_at: Timestamp | None = None
    files: tuple[str, ...] = ()
    captions: str = "{}"
    reactions: str = "[]"
    flowchart_edges: str = "[]"
    peer: str = ""
    peer_key: str = ""
    recipient: str = ""
    is_chat_visible: bool = True
    is_agent_text: bool = False

    @property
    def title(self) -> str:
        first_line = next(iter(self.text.strip().splitlines()), "")
        return f"{first_line[:TITLE_CHARACTERS]}…" if len(first_line) > TITLE_CHARACTERS else first_line
