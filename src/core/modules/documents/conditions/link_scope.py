from dataclasses import dataclass

from engine.database.statement import Statement
from engine.query.conditions.all_of import AllOf
from engine.query.conditions.any_of import AnyOf
from core.modules.documents.conditions.link_counterparts import end
from core.modules.documents.models.link import Link
from core.modules.documents.references.row_ref import RowRef
from core.modules.documents.models.enums.link_side import LinkSide


@dataclass(frozen=True)
class LinkScope:
    """Matches incoming, outgoing or both directions for one reference."""

    reference: RowRef
    side: LinkSide

    def statement(self) -> Statement:
        if self.side is not LinkSide.ROW:
            return AllOf(end(str(self.side), self.reference)).statement()
        return AnyOf([AllOf(end("source", self.reference)), AllOf(end("target", self.reference))]).statement()

    def counterpart(self, link: Link) -> RowRef:
        if (link.source_model, link.source_id) == (self.reference.model, self.reference.row_id):
            return RowRef(link.target_model, link.target_id)
        return RowRef(link.source_model, link.source_id)
