from engine.database.database import Database
from engine.database.migration import Migration
from engine.database.statement import Statement
from engine.database.foreign_key_error import ForeignKeyError


class RebuildMigration(Migration):
    """A change to a table that SQLite can only make by rebuilding the whole table."""

    def run(self, database: Database) -> None:
        database.update(Statement("PRAGMA foreign_keys = OFF"))
        try:
            with database.transaction():
                self.rebuild(database)
                broken: list[tuple[object, ...]] = [tuple(row) for row in database.rows(Statement("PRAGMA foreign_key_check"))]
                if broken:
                    raise ForeignKeyError(broken)
        finally:
            database.update(Statement("PRAGMA foreign_keys = ON"))

    def rebuild(self, database: Database) -> None:
        super().run(database)
