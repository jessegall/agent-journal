from engine.database.migration import Migration

COMMON = " version INTEGER NOT NULL DEFAULT 1, metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)), created_at TEXT NOT NULL, updated_at TEXT NOT NULL) STRICT"


class NudgeDebtsMigration(Migration):
    """Keeps the lines that named a command to run until the agent has run it or said why not."""

    number = 5
    statements = ("CREATE TABLE nudge_debts (id INTEGER PRIMARY KEY, agent_id INTEGER NOT NULL REFERENCES agents(id) ON DELETE CASCADE, creator_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT,"
                  " key TEXT NOT NULL, line TEXT NOT NULL, pays TEXT NOT NULL, opened_call_id INTEGER NOT NULL, settled_at TEXT, skip_reason TEXT NOT NULL DEFAULT ''," + COMMON,
                  "CREATE INDEX nudge_debts_open ON nudge_debts (agent_id, settled_at)")
