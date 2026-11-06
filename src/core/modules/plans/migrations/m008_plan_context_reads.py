from core.base.database.migration import Migration


class PlanContextReadsMigration(Migration):
    """Records context reads by plan start event and receiving agent."""

    number = 8
    statements = [
        "CREATE TABLE plan_context_reads (id INTEGER PRIMARY KEY, environment_id INTEGER NOT NULL REFERENCES environments(id) ON DELETE RESTRICT,"
        " plan_id INTEGER NOT NULL REFERENCES plans(id) ON DELETE CASCADE, start_event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE RESTRICT,"
        " session_agent_id INTEGER NOT NULL REFERENCES agents(id) ON DELETE CASCADE, creator_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT,"
        " version INTEGER NOT NULL DEFAULT 1, metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)), created_at TEXT NOT NULL, updated_at TEXT NOT NULL,"
        " UNIQUE (plan_id, start_event_id, session_agent_id)) STRICT",
    ]
