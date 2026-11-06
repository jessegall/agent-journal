from dataclasses import dataclass

from core.base.database.statement import Statement
from core.base.query.select import Select
from core.modules.documents.support.row_ref import RowRef


@dataclass(frozen=True)
class FirstLinkCounterpart:
    """Selects one stable representative per distinct counterpart before paging."""

    select: Select
    reference: RowRef

    def statement(self) -> Statement:
        source = self.select.statement()
        return Statement(f"""id IN (SELECT min(id) FROM ({source.sql}) GROUP BY
            CASE WHEN source_model = ? AND source_id = ? THEN target_model ELSE source_model END,
            CASE WHEN source_model = ? AND source_id = ? THEN target_id ELSE source_id END)""",
                         (*source.parameters, self.reference.model, self.reference.row_id, self.reference.model, self.reference.row_id))


@dataclass(frozen=True)
class LinkCounterparts:
    """Reads all matching relations for only the counterparts selected on a page."""

    reference: RowRef
    counterparts: tuple[RowRef, ...]

    def statement(self) -> Statement:
        if not self.counterparts:
            return Statement("0")
        marks = ", ".join("(?, ?)" for _ in self.counterparts)
        return Statement(f"""(CASE WHEN source_model = ? AND source_id = ? THEN target_model ELSE source_model END,
            CASE WHEN source_model = ? AND source_id = ? THEN target_id ELSE source_id END) IN ({marks})""",
                         (self.reference.model, self.reference.row_id, self.reference.model, self.reference.row_id,
                          *(value for counterpart in self.counterparts for value in (counterpart.model, counterpart.row_id))))
