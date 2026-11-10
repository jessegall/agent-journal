from dataclasses import dataclass

from core.base.model.view_model import ViewModel
from engine.time.timestamp import Timestamp
from core.modules.documents.models.support.views import DOCUMENT_ROWS_SELECT


@dataclass(frozen=True, kw_only=True)
class DocumentRow(ViewModel):
    """A document or a report as the library lists it, without its text, read from the document_rows view."""

    cli_name = "document-row"
    view = "document_rows"
    key = "row_key"
    select = DOCUMENT_ROWS_SELECT

    row_key: str
    row_type: str
    id: int
    title: str
    abstract: str
    close_reason: str
    updated_at: Timestamp
