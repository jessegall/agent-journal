from core.base.database.migration import Migration


class FileEditsTable(Migration):
    """Creates the file_edits table, one row for each file an agent edited or wrote."""

    number = 1
    statements = (
        "CREATE TABLE file_edits (id INTEGER PRIMARY KEY, environment_id INTEGER NOT NULL REFERENCES environments(id) ON DELETE RESTRICT,"
        " agent_id INTEGER NOT NULL REFERENCES agents(id) ON DELETE RESTRICT, creator_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT,"
        " path TEXT NOT NULL, added INTEGER NOT NULL, removed INTEGER NOT NULL,"
        " version INTEGER NOT NULL DEFAULT 1, metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)),"
        " created_at TEXT NOT NULL, updated_at TEXT NOT NULL) STRICT",
        "CREATE INDEX file_edits_agent ON file_edits (agent_id, id)",
    )
