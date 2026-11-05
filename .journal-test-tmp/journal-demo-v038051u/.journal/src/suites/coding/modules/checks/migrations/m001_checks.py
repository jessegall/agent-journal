from core.base.database.migration import Migration


class ChecksTableMigration(Migration):
    """Creates the checks table."""

    number = 1
    statements = (
        "CREATE TABLE checks (id INTEGER PRIMARY KEY, creator_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT,"
        " title TEXT NOT NULL CHECK (length(title) BETWEEN 1 AND 200), command TEXT NOT NULL, brief TEXT NOT NULL DEFAULT '',"
        " interval_minutes INTEGER NOT NULL DEFAULT 0 CHECK (interval_minutes >= 0), last_passed INTEGER CHECK (last_passed IN (0, 1)),"
        " last_output TEXT NOT NULL DEFAULT '', last_run_at TEXT, reported_at TEXT, stopped INTEGER NOT NULL DEFAULT 0 CHECK (stopped IN (0, 1)), removed_at TEXT,"
        " version INTEGER NOT NULL DEFAULT 1, metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)),"
        " created_at TEXT NOT NULL, updated_at TEXT NOT NULL) STRICT",
    )
