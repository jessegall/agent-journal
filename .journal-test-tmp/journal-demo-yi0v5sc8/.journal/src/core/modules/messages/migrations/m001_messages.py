from core.base.database.migration import Migration


class MessagesTableMigration(Migration):
    """Creates the messages table with its chat and unread indexes."""

    number = 1
    statements = (
        "CREATE TABLE messages (id INTEGER PRIMARY KEY, environment_id INTEGER NOT NULL REFERENCES environments(id) ON DELETE RESTRICT,"
        " agent_id INTEGER REFERENCES agents(id) ON DELETE RESTRICT, parent_id INTEGER REFERENCES messages(id) ON DELETE RESTRICT,"
        " creator_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT, type TEXT NOT NULL, text TEXT NOT NULL, read_at TEXT,"
        " version INTEGER NOT NULL DEFAULT 1, metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)),"
        " created_at TEXT NOT NULL, updated_at TEXT NOT NULL) STRICT",
        "CREATE INDEX messages_chat ON messages (environment_id, id)",
        "CREATE INDEX messages_unread ON messages (environment_id) WHERE type = 'user' AND read_at IS NULL",
    )
