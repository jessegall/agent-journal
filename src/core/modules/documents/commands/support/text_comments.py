from dataclasses import dataclass

from core.modules.documents.support.comment_read import CommentRead


@dataclass(frozen=True)
class TextComments:
    """The comments on one document or report: the messages linked to it as comments_on."""

    cli_name: str
    row_id: int
    comments: tuple[CommentRead, ...]
    page: int = 1
    page_size: int = 25
    total: int = 0
    next_command: str | None = None
