from dataclasses import dataclass

from core.base.database.statement import Statement
from core.modules.documents.references.row_ref import RowRef


@dataclass(frozen=True)
class LinkTarget:
    """Matches the model of the other end of a link."""

    reference: RowRef
    model: str

    def statement(self) -> Statement:
        return Statement("CASE WHEN source_model = ? AND source_id = ? THEN target_model ELSE source_model END = ?",
                         (self.reference.model, self.reference.row_id, self.model))
