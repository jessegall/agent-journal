from core.base.database.migration import Migration

COMMON = " version INTEGER NOT NULL DEFAULT 1, metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)), created_at TEXT NOT NULL, updated_at TEXT NOT NULL) STRICT"


class DriversTables(Migration):
    """Creates the hook calls, the agent lines and the rule history of the drivers module."""

    number = 1
    statements = (
        "CREATE TABLE hook_calls (id INTEGER PRIMARY KEY, agent_id INTEGER NOT NULL REFERENCES agents(id) ON DELETE RESTRICT,"
        " environment_id INTEGER NOT NULL REFERENCES environments(id) ON DELETE RESTRICT, creator_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT,"
        " hook TEXT NOT NULL, firing TEXT NOT NULL UNIQUE, tool TEXT NOT NULL DEFAULT '', summary TEXT NOT NULL DEFAULT '', writes_files INTEGER NOT NULL DEFAULT 0,"
        " suite TEXT NOT NULL DEFAULT '', driver TEXT NOT NULL DEFAULT '', answer TEXT NOT NULL DEFAULT 'allowed', refusal TEXT NOT NULL DEFAULT '', lines TEXT NOT NULL DEFAULT '',"
        + COMMON,
        "CREATE INDEX hook_calls_agent ON hook_calls (agent_id, id)",
        "CREATE INDEX hook_calls_created ON hook_calls (created_at)",
        "CREATE TABLE agent_lines (id INTEGER PRIMARY KEY, agent_id INTEGER NOT NULL REFERENCES agents(id) ON DELETE RESTRICT,"
        " hook_call_id INTEGER REFERENCES hook_calls(id) ON DELETE RESTRICT, creator_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT,"
        " text TEXT NOT NULL, source TEXT NOT NULL DEFAULT '', state TEXT NOT NULL DEFAULT 'waiting', delivered_at TEXT," + COMMON,
        "CREATE INDEX agent_lines_waiting ON agent_lines (agent_id, state, id)",
        "CREATE TABLE rule_histories (id INTEGER PRIMARY KEY, agent_id INTEGER NOT NULL REFERENCES agents(id) ON DELETE RESTRICT,"
        " creator_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT, rule TEXT NOT NULL, layer TEXT NOT NULL DEFAULT '',"
        " last_due_outcome TEXT NOT NULL DEFAULT 'consulted', last_answer_at TEXT," + COMMON,
        "CREATE UNIQUE INDEX rule_histories_rule ON rule_histories (agent_id, rule, layer)",
    )
