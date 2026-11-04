from core.base.database.migration import Migration


class RulesTableMigration(Migration):
    """Creates the rules table."""

    number = 1
    statements = (
        "CREATE TABLE rules (id INTEGER PRIMARY KEY, creator_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT, text TEXT NOT NULL CHECK (length(text) >= 1),"
        " state TEXT NOT NULL DEFAULT 'active', version INTEGER NOT NULL DEFAULT 1, metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)),"
        " created_at TEXT NOT NULL, updated_at TEXT NOT NULL) STRICT",
    )
