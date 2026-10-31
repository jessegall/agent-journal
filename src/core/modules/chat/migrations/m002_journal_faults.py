from core.base.database.migration import Migration


class JournalFaultTableMigration(Migration):
    """Creates the journal faults table; a fault outlives the environment it happened in, which it forgets."""

    number = 2
    statements = (
        "CREATE TABLE journal_faults (id INTEGER PRIMARY KEY, environment_id INTEGER REFERENCES environments(id) ON DELETE SET NULL,"
        " creator_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT, source TEXT NOT NULL, message TEXT NOT NULL,"
        " version INTEGER NOT NULL DEFAULT 1, metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)),"
        " created_at TEXT NOT NULL, updated_at TEXT NOT NULL) STRICT",
    )
