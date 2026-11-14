from engine.database.migration import Migration


class TaskReadsTableMigration(Migration):
    """Creates the table of the tasks an agent read the brief of in its current context window."""

    number = 9
    statements = (
        "CREATE TABLE task_reads (id INTEGER PRIMARY KEY, task_id INTEGER NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,"
        " agent_id INTEGER NOT NULL REFERENCES agents(id) ON DELETE CASCADE, creator_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT,"
        " version INTEGER NOT NULL DEFAULT 1, metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)), created_at TEXT NOT NULL,"
        " updated_at TEXT NOT NULL) STRICT",
        "CREATE UNIQUE INDEX task_reads_agent_task ON task_reads (agent_id, task_id)",
    )
