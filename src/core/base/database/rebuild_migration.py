from core.base.database.database import Database
from core.base.database.migration import Migration
from core.base.database.statement import Statement


class ForeignKeyBreak(Exception):
    """Raised when rebuilding a table would leave rows pointing at rows that no longer exist."""

    def __init__(self, broken: list[tuple[object, ...]]) -> None:
        super().__init__(f"the rebuild left {len(broken)} rows pointing nowhere: {broken[:5]}")


class RebuildMigration(Migration):
    """A change to a table that SQLite can only make by rebuilding the whole table."""

    def run(self, database: Database) -> None:
        database.update(Statement("PRAGMA foreign_keys = OFF"))
        try:
            with database.transaction():
                super().run(database)
                broken: list[tuple[object, ...]] = [tuple(row) for row in database.rows(Statement("PRAGMA foreign_key_check"))]
                if broken:
                    raise ForeignKeyBreak(broken)
        finally:
            database.update(Statement("PRAGMA foreign_keys = ON"))
