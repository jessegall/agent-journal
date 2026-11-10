from engine.database.migration import Migration


class MessageWorkSourcesMigration(Migration):
    """Stores one versioned request selection for each agent and environment."""

    number = 18
    statements = [
        "ALTER TABLE messages ADD COLUMN read_notice_at TEXT",
        "UPDATE messages SET read_notice_at = read_at WHERE read_at IS NOT NULL",
        "CREATE TABLE message_work_sources (id INTEGER PRIMARY KEY, version INTEGER NOT NULL DEFAULT 1,"
        " metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)), created_at TEXT NOT NULL, updated_at TEXT NOT NULL,"
        " creator_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT,"
        " agent_id INTEGER NOT NULL REFERENCES agents(id) ON DELETE CASCADE,"
        " environment_id INTEGER NOT NULL REFERENCES environments(id) ON DELETE CASCADE,"
        " message_id INTEGER REFERENCES messages(id) ON DELETE RESTRICT, origin TEXT NOT NULL,"
        " provisional INTEGER NOT NULL DEFAULT 0, used INTEGER NOT NULL DEFAULT 0, UNIQUE (agent_id, environment_id)) STRICT",
        "CREATE INDEX message_work_sources_message ON message_work_sources (message_id)",
    ]
