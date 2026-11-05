from core.base.database.migration import Migration

COMMON = " version INTEGER NOT NULL DEFAULT 1, metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)), created_at TEXT NOT NULL, updated_at TEXT NOT NULL) STRICT"


class NudgeRecordsMigration(Migration):
    """Keeps how often each agent was told each line of a nudge, and when last."""

    number = 4
    statements = ("CREATE TABLE nudge_records (id INTEGER PRIMARY KEY, agent_id INTEGER NOT NULL REFERENCES agents(id) ON DELETE CASCADE, creator_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT,"
                  " key TEXT NOT NULL, text TEXT NOT NULL, said_count INTEGER NOT NULL DEFAULT 0, last_said_at TEXT," + COMMON,
                  "CREATE UNIQUE INDEX nudge_records_line ON nudge_records (agent_id, key, text)",
                  "CREATE INDEX nudge_records_key ON nudge_records (key)")
