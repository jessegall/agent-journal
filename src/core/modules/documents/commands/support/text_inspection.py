from dataclasses import dataclass

from core.modules.documents.support.comment_read import CommentRead
from core.modules.documents.models.text_row import TextRow


@dataclass(frozen=True)
class TextInspection:
    """A document or a report as its inspector reads it: the row, its comments and its latest revision."""

    text_row: TextRow
    comments: tuple[CommentRead, ...]
    revision: int | None
    open_author_id: int | None = None
