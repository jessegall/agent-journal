from engine.database.migration import Migration


class TranscriptionsTableMigration(Migration):
    """Creates the transcriptions table."""

    number = 1
    statements = (
        "CREATE TABLE transcriptions (id INTEGER PRIMARY KEY, environment_id INTEGER NOT NULL REFERENCES environments(id) ON DELETE CASCADE,"
        " creator_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT, title TEXT NOT NULL CHECK (length(title) BETWEEN 1 AND 200),"
        " text TEXT NOT NULL DEFAULT '', source TEXT NOT NULL DEFAULT '', version INTEGER NOT NULL DEFAULT 1,"
        " metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)), created_at TEXT NOT NULL, updated_at TEXT NOT NULL) STRICT",
    )
