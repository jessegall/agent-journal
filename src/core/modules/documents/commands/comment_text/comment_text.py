from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.documents.models.text_row import TextRow
from core.modules.messages.models.message import Message


@dataclass(frozen=True)
class CommentText(Command[Message]):
    """Writes a comment on a document or a report: a message in the chat linked to the text it is about."""

    text_model: type[TextRow]
    row_id: int
    text: str
