from engine.database.migration import Migration


class SkippedRefusalsTableMigration(Migration):
    """Creates the table of refusals agents passed, with their reasons."""

    number = 29
    statements = [
        "CREATE TABLE refusal_skips (id INTEGER PRIMARY KEY, session_agent_id INTEGER NOT NULL REFERENCES agents(id) ON DELETE CASCADE,"
        " creator_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT, name TEXT NOT NULL, reason TEXT NOT NULL, streak INTEGER NOT NULL DEFAULT 1,"
        " used_at TEXT, restored_at TEXT, version INTEGER NOT NULL DEFAULT 1, metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)), created_at TEXT NOT NULL, updated_at TEXT NOT NULL) STRICT",
        "CREATE INDEX refusal_skips_agent ON refusal_skips (session_agent_id, name, id)",
        "CREATE INDEX refusals_actor ON refusals (actor_id, guard, created_at)",
    ]
