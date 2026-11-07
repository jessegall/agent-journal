from dataclasses import replace

from core.base.database.database import Database
from core.base.database.foreign_reference import ForeignReference
from core.base.database.kept_rows import KeptRows
from core.base.database.statement import Statement
from core.base.model.model import Model
from core.base.model.table import Table

RESTRICTING_REFERENCES = Statement(
    'SELECT schema.name AS table_name, keys."from" AS column_name, coalesce(keys."to", ?) AS target_column '
    'FROM sqlite_master AS schema, pragma_foreign_key_list(schema.name) AS keys '
    'WHERE schema.type = \'table\' AND keys."table" = ? AND keys.on_delete IN (\'NO ACTION\', \'RESTRICT\') '
    'ORDER BY schema.name, keys.id, keys.seq',
    scan_reason="Foreign-key metadata reads the fixed schema catalogue rather than stored journal rows.")


class ForeignReferences:
    """Reads restrictive foreign keys, refreshing its cached metadata when the schema changes."""

    def __init__(self, database: Database, kept: KeptRows) -> None:
        self.database, self.kept = database, kept

    def restricting(self, table: Table[Model]) -> tuple[ForeignReference, ...]:
        version = self.database.schema_version()
        return self.kept.kept_value(f"schema.references:{table.name}:{table.key}:{version}",
                                    lambda: self.read(table), Statement("SELECT ?", [version]))

    def read(self, table: Table[Model]) -> tuple[ForeignReference, ...]:
        statement = replace(RESTRICTING_REFERENCES, parameters=[table.key, table.name])
        return tuple(ForeignReference(row["table_name"], row["column_name"], row["target_column"])
                     for row in self.database.rows(statement))
