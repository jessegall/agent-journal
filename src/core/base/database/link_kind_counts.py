from core.base.database.database import Database
from core.base.database.statement import Statement
from core.base.query.select import Select


class LinkKindCounts:
    """Counts distinct link counterparts by model."""

    def __init__(self, database: Database) -> None:
        self.database = database

    def read(self, select: Select, model: str, row_id: int) -> dict[str, int]:
        source = select.statement()
        statement = Statement(f"""SELECT counterpart_model, count(*) FROM (
            SELECT DISTINCT CASE WHEN source_model = ? AND source_id = ? THEN target_model ELSE source_model END AS counterpart_model,
                CASE WHEN source_model = ? AND source_id = ? THEN target_id ELSE source_id END AS counterpart_id
            FROM ({source.sql})) GROUP BY counterpart_model ORDER BY counterpart_model""",
            (model, row_id, model, row_id, *source.parameters))
        return {str(row[0]): int(row[1]) for row in self.database.rows(statement)}
