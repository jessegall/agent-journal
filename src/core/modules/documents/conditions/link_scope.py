from dataclasses import dataclass
from enum import StrEnum

from core.base.database.statement import Statement
from core.modules.documents.models.link import Link
from core.modules.documents.support.row_ref import RowRef


class LinkSide(StrEnum):
    """The requested end of a relation read."""

    SOURCE = "source"
    TARGET = "target"
    BOTH = "row"


@dataclass(frozen=True)
class LinkScope:
    """Matches incoming, outgoing or both directions for one reference."""

    reference: RowRef
    side: LinkSide

    def statement(self) -> Statement:
        if self.side is not LinkSide.BOTH:
            return Statement(f"{self.side}_model = ? AND {self.side}_id = ?", (self.reference.model, self.reference.row_id))
        return Statement("((source_model = ? AND source_id = ?) OR (target_model = ? AND target_id = ?))",
                         (self.reference.model, self.reference.row_id, self.reference.model, self.reference.row_id))

    def counterpart(self, link: Link) -> RowRef:
        if (link.source_model, link.source_id) == (self.reference.model, self.reference.row_id):
            return RowRef(link.target_model, link.target_id)
        return RowRef(link.source_model, link.source_id)
