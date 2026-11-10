from engine.database.migration import Migration


class WorkerTestFailuresMigration(Migration):
    """Creates the record of each failed hand-in and each failed test a worker ran on a task."""

    number = 28
    statements = (
        "CREATE TABLE worker_test_failures (id INTEGER PRIMARY KEY, worker_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT,"
        " task_id INTEGER NOT NULL REFERENCES tasks(id) ON DELETE RESTRICT, source TEXT NOT NULL, test_name TEXT NOT NULL,"
        " version INTEGER NOT NULL DEFAULT 1, metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)),"
        " created_at TEXT NOT NULL, updated_at TEXT NOT NULL) STRICT",
        "CREATE INDEX worker_test_failures_task ON worker_test_failures (task_id, source, test_name)",
    )
