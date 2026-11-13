from engine.database.rebuild_migration import RebuildMigration


class PlanContextStartEventUnboundMigration(RebuildMigration):
    """Rebuilds plan_context_reads with the start event id as a plain number: the event that started a plan is pruned
    from the event log like every other event, and a reference to it made every pruning pass fail."""

    number = 17
    statements = (
        "CREATE TABLE plan_context_reads_rebuilt (id INTEGER PRIMARY KEY, environment_id INTEGER NOT NULL REFERENCES environments(id) ON DELETE RESTRICT,"
        " plan_id INTEGER NOT NULL REFERENCES plans(id) ON DELETE CASCADE, start_event_id INTEGER NOT NULL,"
        " session_agent_id INTEGER NOT NULL REFERENCES agents(id) ON DELETE CASCADE, creator_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT,"
        " version INTEGER NOT NULL DEFAULT 1, metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)), created_at TEXT NOT NULL, updated_at TEXT NOT NULL,"
        " UNIQUE (plan_id, start_event_id, session_agent_id)) STRICT",
        "INSERT INTO plan_context_reads_rebuilt (id, environment_id, plan_id, start_event_id, session_agent_id, creator_id, version, metadata, created_at, updated_at)"
        " SELECT id, environment_id, plan_id, start_event_id, session_agent_id, creator_id, version, metadata, created_at, updated_at FROM plan_context_reads",
        "DROP TABLE plan_context_reads",
        "ALTER TABLE plan_context_reads_rebuilt RENAME TO plan_context_reads",
        "CREATE INDEX plan_context_reads_environment ON plan_context_reads (environment_id, id)",
    )
