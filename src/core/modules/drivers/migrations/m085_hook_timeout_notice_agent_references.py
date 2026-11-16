from engine.database.rebuild_migration import RebuildMigration


class HookTimeoutNoticeAgentReferencesMigration(RebuildMigration):
    """A hook timeout notice's agent and the agent it goes to reference agents, as every column that holds an
    agent's id does."""

    number = 85
    statements = (
        "CREATE TABLE hook_timeout_notices_rebuilt (id INTEGER PRIMARY KEY, session_agent_id INTEGER NOT NULL REFERENCES agents(id) ON DELETE RESTRICT, receiver_id INTEGER NOT NULL REFERENCES agents(id) ON DELETE RESTRICT, timeout_count INTEGER NOT NULL, version INTEGER NOT NULL DEFAULT 1, metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)), created_at TEXT NOT NULL, updated_at TEXT NOT NULL) STRICT",
        "INSERT INTO hook_timeout_notices_rebuilt (id, session_agent_id, receiver_id, timeout_count, version, metadata, created_at, updated_at) SELECT id, session_agent_id, receiver_id, timeout_count, version, metadata, created_at, updated_at FROM hook_timeout_notices",
        "DROP TABLE hook_timeout_notices",
        "ALTER TABLE hook_timeout_notices_rebuilt RENAME TO hook_timeout_notices",
        "CREATE INDEX hook_timeout_notices_agent ON hook_timeout_notices (session_agent_id, id)",
    )
