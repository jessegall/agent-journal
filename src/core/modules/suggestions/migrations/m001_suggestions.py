from core.base.database.migration import Migration


class SuggestionsTableMigration(Migration):
    """Creates the suggestions table, one row per key."""

    number = 1
    statements = (
        "CREATE TABLE suggestions (id INTEGER PRIMARY KEY, environment_id INTEGER NOT NULL REFERENCES environments(id) ON DELETE CASCADE,"
        " creator_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT, key TEXT NOT NULL UNIQUE, title TEXT NOT NULL, answer TEXT,"
        " version INTEGER NOT NULL DEFAULT 1, metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)), created_at TEXT NOT NULL, updated_at TEXT NOT NULL) STRICT",
    )
