from engine.database.migration import Migration

COMMON = " version INTEGER NOT NULL DEFAULT 1, metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)), created_at TEXT NOT NULL, updated_at TEXT NOT NULL) STRICT"


class AgentBlocksMigration(Migration):
    """Keeps the blocks on an agent until what ends them is true."""

    number = 9
    statements = ["CREATE TABLE agent_blocks (id INTEGER PRIMARY KEY, agent_id INTEGER NOT NULL REFERENCES agents(id) ON DELETE CASCADE, creator_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT,"
                  " nudge_key TEXT NOT NULL, nudge_text TEXT NOT NULL, condition_name TEXT NOT NULL, condition_text TEXT NOT NULL, closed_at TEXT," + COMMON,
                  "CREATE INDEX agent_blocks_open ON agent_blocks (agent_id, closed_at)"]
