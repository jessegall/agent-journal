from dataclasses import dataclass

from engine.database.statement import Statement
from engine.query.conditions.all_of import AllOf
from engine.query.conditions.any_of import AnyOf
from engine.query.conditions.equal import Equal
from core.modules.documents.references.row_ref import RowRef


def end(side: str, row: RowRef) -> list[Equal]:
    """The two columns that name one end of a link."""
    return [Equal(f"{side}_model", row.model), Equal(f"{side}_id", row.row_id)]


@dataclass(frozen=True)
class LinkCounterparts:
    """Reads all matching relations for only the counterparts selected on a page."""

    reference: RowRef
    counterparts: tuple[RowRef, ...]

    def statement(self) -> Statement:
        pairs = [AnyOf([AllOf([*end("source", self.reference), *end("target", counterpart)]), AllOf([*end("target", self.reference), *end("source", counterpart)])])
                 for counterpart in self.counterparts]
        return AnyOf(pairs).statement()
