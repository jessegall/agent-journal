from core.base.database.migration import Migration


class SubagentDispatchesMigration(Migration):
    """A subagent's dispatch is kept: who sent it, its profile, model, job and instruction, and what it returned."""

    number = 10
    statements = [
        "CREATE TABLE subagent_dispatches (id INTEGER PRIMARY KEY, environment_id INTEGER NOT NULL REFERENCES environments(id) ON DELETE CASCADE,"
        " agent_id INTEGER NOT NULL REFERENCES agents(id) ON DELETE CASCADE, creator_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT,"
        " tool_key TEXT NOT NULL, profile TEXT NOT NULL, program_model TEXT NOT NULL, description TEXT NOT NULL, instruction TEXT NOT NULL, returned TEXT NOT NULL DEFAULT '',"
        " ended_at TEXT, version INTEGER NOT NULL DEFAULT 1, metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)), created_at TEXT NOT NULL, updated_at TEXT NOT NULL,"
        " UNIQUE (agent_id, tool_key)) STRICT",
    ]
