from dataclasses import dataclass

from engine.database.statement import Statement
from engine.query.conditions.conjunction import Conjunction
from engine.query.conditions.disjunction import Disjunction
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
        source_reference = Conjunction(end("source", self.reference))
        return Disjunction([Conjunction([source_reference, Equal("target_model", self.model)]), Conjunction([Excluding(source_reference), Equal("source_model", self.model)])]).statement()
