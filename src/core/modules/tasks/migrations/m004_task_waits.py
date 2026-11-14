from engine.database.migration import Migration


class TaskWaitsTableMigration(Migration):
    """Creates the table of what a blocked task waits on: a row that resolves or a command that passes."""

    number = 4
    statements = (
        "CREATE TABLE task_waits (id INTEGER PRIMARY KEY, task_id INTEGER NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,"
        " creator_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT, target TEXT NOT NULL DEFAULT '', command TEXT NOT NULL DEFAULT '',"
        " interval_minutes INTEGER NOT NULL DEFAULT 0 CHECK (interval_minutes >= 0), ended_at TEXT, version INTEGER NOT NULL DEFAULT 1,"
        " metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)), created_at TEXT NOT NULL, updated_at TEXT NOT NULL) STRICT",
        "CREATE INDEX task_waits_task ON task_waits (task_id, ended_at)",
        "CREATE INDEX task_waits_target ON task_waits (target, ended_at)",
    )
