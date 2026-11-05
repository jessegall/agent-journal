from dataclasses import dataclass
from core.modules.documents.models.text_row import TextRow



@dataclass(frozen=True)
class NewText:
    """A document or report just made, with the rows it is about."""

    text_row: TextRow
    subjects: tuple[str, ...]
