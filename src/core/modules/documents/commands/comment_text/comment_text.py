from dataclasses import dataclass

from core.base.command.command import Command
from core.base.model.model import Model
from core.modules.documents.models.enums.comment_selection_type import CommentSelectionType
from core.modules.messages.models.message import Message


@dataclass(frozen=True)
class CommentText(Command[Message]):
    """Writes a comment linked to a model row, with an optional selection for a document or report."""

    text_model: type[Model]
    row_id: int
    text: str
    quote: str = ""
    position: int | None = None
    selection_type: CommentSelectionType = CommentSelectionType.TEXT
    is_chat_visible: bool = True
