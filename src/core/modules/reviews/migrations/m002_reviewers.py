from core.base.database.migration import Migration


class ReviewersTableMigration(Migration):
    """Creates the reviewers table; a reviewer's id is its agent's id."""

    number = 2
    statements = (
        "CREATE TABLE reviewers (id INTEGER PRIMARY KEY REFERENCES agents(id) ON DELETE RESTRICT,"
        " environment_id INTEGER NOT NULL REFERENCES environments(id) ON DELETE RESTRICT,"
        " creator_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT, program TEXT NOT NULL, model TEXT NOT NULL DEFAULT '',"
        " state TEXT NOT NULL DEFAULT 'idle', version INTEGER NOT NULL DEFAULT 1, metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)),"
        " created_at TEXT NOT NULL, updated_at TEXT NOT NULL) STRICT",
        "CREATE INDEX reviewers_open ON reviewers (environment_id, state) WHERE state IN ('idle', 'reviewing')",
    )
