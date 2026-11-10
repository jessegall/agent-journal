from dataclasses import dataclass

from engine.database.statement import Statement
from core.modules.documents.references.row_ref import RowRef


@dataclass(frozen=True)
class LinkCounterparts:
    """Reads all matching relations for only the counterparts selected on a page."""

    reference: RowRef
    counterparts: tuple[RowRef, ...]

    def statement(self) -> Statement:
        if not self.counterparts:
            return Statement("0")
        pair = """((source_model = ? AND source_id = ? AND target_model = ? AND target_id = ?)
            OR (target_model = ? AND target_id = ? AND source_model = ? AND source_id = ?))"""
        return Statement("(" + " OR ".join(pair for _ in self.counterparts) + ")",
                         tuple(value for counterpart in self.counterparts
                               for value in (self.reference.model, self.reference.row_id, counterpart.model, counterpart.row_id,
                                             self.reference.model, self.reference.row_id, counterpart.model, counterpart.row_id)))
