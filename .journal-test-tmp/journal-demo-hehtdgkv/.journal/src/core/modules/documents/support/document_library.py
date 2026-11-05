from collections.abc import Mapping
from dataclasses import dataclass

from core.modules.documents.models.document_row import DocumentRow


@dataclass(frozen=True)
class DocumentLibrary:
    """What the documents window draws: one page of the documents or the reports, with how many there are,
    holding only the fields of a row."""

    total: int
    rows: tuple[DocumentRow, ...]

    def json(self) -> Mapping[str, object]:
        return {"total": self.total, "rows": [{"id": row.id, "title": row.title, "abstract": row.abstract, "close_reason": row.close_reason, "updated_at": row.updated_at.text} for row in self.rows]}
