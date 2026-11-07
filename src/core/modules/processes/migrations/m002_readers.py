from core.base.database.migration import Migration


class ReadersTableMigration(Migration):
    """Creates the readers table."""

    number = 2
    statements = (
        "CREATE TABLE readers (id INTEGER PRIMARY KEY, environment_id INTEGER REFERENCES environments(id) ON DELETE RESTRICT,"
        " creator_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT, name TEXT NOT NULL CHECK (length(name) BETWEEN 1 AND 40),"
        " type TEXT NOT NULL CHECK (type IN ('pattern', 'script')), commands TEXT NOT NULL, lines_pattern TEXT NOT NULL DEFAULT '',"
        " script TEXT NOT NULL DEFAULT '', progress_pattern TEXT NOT NULL DEFAULT '', finished_pattern TEXT NOT NULL DEFAULT '',"
        " failed_pattern TEXT NOT NULL DEFAULT '', summary_pattern TEXT NOT NULL DEFAULT '', topic_pattern TEXT NOT NULL DEFAULT '',"
        " title TEXT NOT NULL DEFAULT '', is_default INTEGER NOT NULL DEFAULT 0, version INTEGER NOT NULL DEFAULT 1,"
        " metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)), created_at TEXT NOT NULL, updated_at TEXT NOT NULL) STRICT",
        "CREATE UNIQUE INDEX readers_name ON readers (COALESCE(environment_id, 0), name)",
    )
