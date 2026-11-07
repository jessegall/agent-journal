from dataclasses import dataclass

from core.base.model.model import Model
from core.modules.documents.models.enums.comment_selection_type import CommentSelectionType


@dataclass(frozen=True, kw_only=True)
class CommentSelection(Model):
    """What a comment on a document or a report keeps beside its message: its own words, the selection they are
    about and where that starts in the shown text, and the revision of the text it was made on."""

    model_name = "comment_selection"
    cli_name = "comment-selection"

    message_id: int
    creator_id: int
    body: str
    quote: str = ""
    position: int | None = None
    selection_type: CommentSelectionType = CommentSelectionType.TEXT
    revision: int | None = None
