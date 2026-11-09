from dataclasses import dataclass
from core.base.command.command import Command
from core.modules.messages.models.message import Message


@dataclass(frozen=True)
class SendMessage(Command[Message]):
    """Writes a message in the caller's environment, as the caller; with a parent it is a reply to that
    message; the files are uploaded ones it takes along; a comment names the row it is on, as a model and a
    number."""

    text: str
    parent_id: int | None = None
    files: tuple[str, ...] = ()
    commented_row: tuple[str, int] | None = None
    target_agent_id: int | None = None
    is_chat_visible: bool = True
    is_agent_text: bool = False
