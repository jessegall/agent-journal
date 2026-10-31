from core.base.database.migration import Migration


class ChatMarkTableMigration(Migration):
    """Creates the chat marks table, one key to a mark in an environment, and the index a chat reads by."""

    number = 1
    statements = (
        "CREATE TABLE chat_marks (id INTEGER PRIMARY KEY, environment_id INTEGER NOT NULL REFERENCES environments(id) ON DELETE CASCADE,"
        " agent_id INTEGER REFERENCES agents(id) ON DELETE RESTRICT, creator_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT,"
        " type TEXT NOT NULL, variant TEXT NOT NULL, key TEXT NOT NULL, text TEXT NOT NULL, detail TEXT NOT NULL DEFAULT '',"
        " lines TEXT NOT NULL DEFAULT '', target_model TEXT NOT NULL DEFAULT '', target_id INTEGER,"
        " outcome TEXT NOT NULL DEFAULT 'none' CHECK (outcome IN ('none', 'running', 'passed', 'failed', 'warned')),"
        " figure TEXT NOT NULL DEFAULT '', fraction REAL NOT NULL DEFAULT 0, run_key TEXT NOT NULL DEFAULT '', run_step INTEGER NOT NULL DEFAULT 0,"
        " state TEXT NOT NULL DEFAULT 'shown' CHECK (state IN ('shown', 'ended')), ended_at TEXT,"
        " version INTEGER NOT NULL DEFAULT 1, metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)),"
        " created_at TEXT NOT NULL, updated_at TEXT NOT NULL, UNIQUE (environment_id, key)) STRICT",
        "CREATE INDEX chat_marks_chat ON chat_marks (environment_id, id)",
    )
