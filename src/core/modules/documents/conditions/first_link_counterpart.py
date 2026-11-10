from dataclasses import dataclass

from core.base.database.statement import Statement
from engine.query.select import Select
from core.modules.documents.references.row_ref import RowRef


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
