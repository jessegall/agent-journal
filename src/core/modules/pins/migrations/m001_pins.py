from core.base.database.database import Database
from core.base.database.migration import Migration
from core.base.database.statement import Statement

NOTICES_TABLE = Statement("SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = 'notices'")


class PinsTableMigration(Migration):
    """Creates the pins table; a database that holds the table of notices, as pins were first called, keeps its
    rows: the table and its index are renamed."""

    number = 1
    statements = (
        "CREATE TABLE pins (id INTEGER PRIMARY KEY, environment_id INTEGER NOT NULL REFERENCES environments(id) ON DELETE CASCADE,"
        " creator_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT, title TEXT NOT NULL CHECK (length(title) BETWEEN 1 AND 80), link TEXT NOT NULL,"
        " label TEXT NOT NULL DEFAULT 'Open', closed_at TEXT, version INTEGER NOT NULL DEFAULT 1, metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)),"
        " created_at TEXT NOT NULL, updated_at TEXT NOT NULL) STRICT",
        "CREATE INDEX pins_environment ON pins (environment_id, closed_at)",
    )
    renaming_statements = (
        "ALTER TABLE notices RENAME TO pins",
        "DROP INDEX notices_environment",
        "CREATE INDEX pins_environment ON pins (environment_id, closed_at)",
    )

    def run(self, database: Database) -> None:
        for sql in self.renaming_statements if database.rows(NOTICES_TABLE) else self.statements:
            database.update(Statement(sql))
