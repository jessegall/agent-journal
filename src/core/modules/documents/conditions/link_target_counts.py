from dataclasses import dataclass

from engine.database.statement import Statement
from engine.query.select import Select
from core.modules.documents.references.row_ref import RowRef


@dataclass(frozen=True)
class LinkTargetCounts:
    """Counts distinct link counterparts by model."""

    select: Select
    reference: RowRef

    def statement(self) -> Statement:
        source = self.select.statement()
        return Statement(f"""SELECT counterpart_model, count(*) FROM (
            SELECT DISTINCT CASE WHEN source_model = ? AND source_id = ? THEN target_model ELSE source_model END AS counterpart_model,
                CASE WHEN source_model = ? AND source_id = ? THEN target_id ELSE source_id END AS counterpart_id
            FROM ({source.sql})) GROUP BY counterpart_model ORDER BY counterpart_model""",
            (self.reference.model, self.reference.row_id, self.reference.model, self.reference.row_id, *source.parameters))
