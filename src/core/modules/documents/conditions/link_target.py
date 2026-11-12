from dataclasses import dataclass

from engine.database.statement import Statement
from engine.query.conditions.all_of import AllOf
from engine.query.conditions.any_of import AnyOf
from engine.query.conditions.equal import Equal
from engine.query.conditions.excluding import Excluding
from core.modules.documents.conditions.link_counterparts import end
from core.modules.documents.references.row_ref import RowRef


@dataclass(frozen=True)
class LinkTarget:
    """Matches the model of the other end of a link: its target when the reference is its source, else its source."""

    reference: RowRef
    model: str

    def statement(self) -> Statement:
        from_reference = AllOf(end("source", self.reference))
        return AnyOf([AllOf([from_reference, Equal("target_model", self.model)]), AllOf([Excluding(from_reference), Equal("source_model", self.model)])]).statement()
