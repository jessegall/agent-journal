from engine.database.migration import Migration


class JournalExceptionTableMigration(Migration):
    """Creates the table of journal exceptions, first named journal_faults and renamed by migration 4; an
    exception remains after its environment is deleted."""

    number = 2
    statements = (
        "CREATE TABLE journal_faults (id INTEGER PRIMARY KEY, environment_id INTEGER REFERENCES environments(id) ON DELETE SET NULL,"
        " creator_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT, source TEXT NOT NULL, message TEXT NOT NULL,"
        " version INTEGER NOT NULL DEFAULT 1, metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)),"
        " created_at TEXT NOT NULL, updated_at TEXT NOT NULL) STRICT",
    )
