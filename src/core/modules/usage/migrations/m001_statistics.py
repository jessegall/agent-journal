from core.base.database.migration import Migration


class StatisticsTableMigration(Migration):
    """Creates the statistics table, one number a key."""

    number = 1
    statements = (
        "CREATE TABLE statistics (id INTEGER PRIMARY KEY, key TEXT NOT NULL UNIQUE, value INTEGER NOT NULL DEFAULT 0, version INTEGER NOT NULL DEFAULT 1,"
        " metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)), created_at TEXT NOT NULL, updated_at TEXT NOT NULL) STRICT",
    )
