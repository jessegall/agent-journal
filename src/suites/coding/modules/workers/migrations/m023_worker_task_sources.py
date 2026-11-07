from core.base.database.migration import Migration


class WorkerTaskSourcesMigration(Migration):
    """Keeps each assigned task's request separately from later follow-ups."""

    number = 23
    statements = [
        "CREATE TABLE worker_task_sources (id INTEGER PRIMARY KEY, version INTEGER NOT NULL DEFAULT 1,"
        " metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)), created_at TEXT NOT NULL, updated_at TEXT NOT NULL,"
        " creator_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT,"
        " worktree_id INTEGER NOT NULL REFERENCES worker_worktrees(id) ON DELETE CASCADE,"
        " task_id INTEGER NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,"
        " environment_id INTEGER NOT NULL REFERENCES environments(id) ON DELETE CASCADE,"
        " source_message_id INTEGER, source_version INTEGER NOT NULL DEFAULT 0, source_unavailable INTEGER NOT NULL DEFAULT 0,"
        " source_line_id INTEGER REFERENCES agent_lines(id) ON DELETE SET NULL, started_at TEXT) STRICT",
        "CREATE INDEX worker_task_sources_current ON worker_task_sources (worktree_id, task_id, id DESC) WHERE started_at IS NOT NULL",
        "CREATE INDEX worker_task_sources_line ON worker_task_sources (source_line_id)",
        "CREATE INDEX worker_task_sources_message ON worker_task_sources (source_message_id)",
    ]
