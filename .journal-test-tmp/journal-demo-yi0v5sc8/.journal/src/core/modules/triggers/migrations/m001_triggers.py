from core.base.database.migration import Migration


class TriggersTableMigration(Migration):
    """Creates the triggers table."""

    number = 1
    statements = (
        "CREATE TABLE triggers (id INTEGER PRIMARY KEY, creator_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT,"
        " phrases TEXT NOT NULL CHECK (json_valid(phrases)), action TEXT NOT NULL DEFAULT 'nudge', text TEXT NOT NULL CHECK (length(text) BETWEEN 1 AND 600),"
        " next_at TEXT, interval_minutes INTEGER, cron_line TEXT NOT NULL DEFAULT '', end_at TEXT, fire_limit INTEGER, fired_count INTEGER NOT NULL DEFAULT 0,"
        " ended_at TEXT, version INTEGER NOT NULL DEFAULT 1, metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)),"
        " created_at TEXT NOT NULL, updated_at TEXT NOT NULL) STRICT",
        "CREATE INDEX triggers_open ON triggers (ended_at, next_at)",
    )
