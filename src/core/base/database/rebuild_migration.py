from core.base.database.database import Database
from core.base.database.migration import Migration
from core.base.database.statement import Statement


class ForeignKeyBreak(Exception):
    """A rebuild left rows pointing at rows that are not there, so it is undone."""

    def __init__(self, broken: list[tuple]) -> None:
        super().__init__(f"the rebuild left {len(broken)} rows pointing nowhere: {broken[:5]}")


class RebuildMigration(Migration):
    """A change SQLite makes only by rebuilding a table: run with foreign keys off, outside the usual
    transaction, then checked with foreign_key_check before foreign keys are on again."""

    def run(self, database: Database) -> None:
        database.update(Statement("PRAGMA foreign_keys = OFF"))
        try:
            with database.transaction():
                super().run(database)
                broken = [tuple(row) for row in database.rows(Statement("PRAGMA foreign_key_check"))]
                if broken:
                    raise ForeignKeyBreak(broken)
        finally:
            database.update(Statement("PRAGMA foreign_keys = ON"))
