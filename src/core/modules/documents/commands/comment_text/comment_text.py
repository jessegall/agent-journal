from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.documents.models.enums.comment_selection_type import CommentSelectionType
from core.modules.documents.models.text_row import TextRow
from core.modules.messages.models.message import Message
from core.modules.plans.models.plan import Plan
from core.modules.tasks.models.task import Task


@dataclass(frozen=True)
class CommentText(Command[Message]):
    """Writes a comment on a document, a report, a plan, a task or a message: a message in the chat linked to
    the row it is about, and for a document or a report, the selection it is about."""

    text_model: type[TextRow] | type[Plan] | type[Task] | type[Message]
    row_id: int
    text: str
    quote: str = ""
    position: int | None = None
    selection_type: CommentSelectionType = CommentSelectionType.TEXT
