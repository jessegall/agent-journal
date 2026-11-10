from engine.database.migration import Migration


class TaskBlockRenewalsMigration(Migration):
    """Keeps the reasons written when a task is blocked or its block renewed."""

    number = 11
    statements = (
        "CREATE TABLE task_block_renewals (id INTEGER PRIMARY KEY, task_id INTEGER NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,"
        " creator_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT, task_version INTEGER NOT NULL, reason TEXT NOT NULL,"
        " version INTEGER NOT NULL DEFAULT 1, metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)),"
        " created_at TEXT NOT NULL, updated_at TEXT NOT NULL) STRICT",
        "CREATE INDEX task_block_renewals_task_version ON task_block_renewals (task_id, task_version)",
    )
