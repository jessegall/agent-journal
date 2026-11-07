from dataclasses import dataclass

from core.modules.documents.models.enums.comment_selection_type import CommentSelectionType
from core.modules.documents.support.resolved_row_ref import ResolvedRowRef


@dataclass(frozen=True)
class QuestionPlace:
    """The document or report and selection a question is about."""

    row: ResolvedRowRef | None = None
    quote: str = ""
    position: int | None = None
    selection_type: CommentSelectionType = CommentSelectionType.TEXT
