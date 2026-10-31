from core.base.database.migration import Migration


class NoticesTableMigration(Migration):
    """Creates the notices table."""

    number = 1
    statements = (
        "CREATE TABLE notices (id INTEGER PRIMARY KEY, environment_id INTEGER NOT NULL REFERENCES environments(id) ON DELETE CASCADE,"
        " creator_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT, title TEXT NOT NULL CHECK (length(title) BETWEEN 1 AND 80), link TEXT NOT NULL,"
        " label TEXT NOT NULL DEFAULT 'Open', closed_at TEXT, version INTEGER NOT NULL DEFAULT 1, metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)),"
        " created_at TEXT NOT NULL, updated_at TEXT NOT NULL) STRICT",
        "CREATE INDEX notices_environment ON notices (environment_id, closed_at)",
    )
