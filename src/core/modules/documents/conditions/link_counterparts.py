from dataclasses import dataclass

from engine.database.statement import Statement
from engine.query.conditions.conjunction import Conjunction
from engine.query.conditions.disjunction import Disjunction
from engine.query.conditions.equal import Equal
from core.modules.documents.references.row_ref import RowRef


# The two columns that name one end of a link.
def end(side: str, row: RowRef) -> list[Equal]:
    return [Equal(f"{side}_model", row.model), Equal(f"{side}_id", row.row_id)]


@dataclass(frozen=True)
class LinkCounterparts:
    """Reads all matching relations for only the counterparts selected on a page."""

    reference: RowRef
    counterparts: tuple[RowRef, ...]

    def statement(self) -> Statement:
        pairs = [Disjunction([Conjunction([*end("source", self.reference), *end("target", counterpart)]), Conjunction([*end("target", self.reference), *end("source", counterpart)])])
                 for counterpart in self.counterparts]
        return Disjunction(pairs).statement()
