from core.base.database.migration import Migration


class EnvironmentsTable(Migration):
    """Creates the environments table."""

    number = 1
    statements = (
        "CREATE TABLE environments (id INTEGER PRIMARY KEY, creator_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT,"
        " name TEXT NOT NULL UNIQUE, folder TEXT NOT NULL, branch TEXT NOT NULL DEFAULT '', version INTEGER NOT NULL DEFAULT 1,"
        " metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)), created_at TEXT NOT NULL, updated_at TEXT NOT NULL) STRICT",
    )
