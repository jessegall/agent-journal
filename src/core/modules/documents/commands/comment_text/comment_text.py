from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.documents.models.text_row import TextRow
from core.modules.messages.models.message import Message
from core.modules.plans.models.plan import Plan


@dataclass(frozen=True)
class CommentText(Command[Message]):
    """Writes a comment on a document, a report or a plan: a message in the chat linked to the row it is about."""

    text_model: type[TextRow] | type[Plan]
    row_id: int
    text: str
