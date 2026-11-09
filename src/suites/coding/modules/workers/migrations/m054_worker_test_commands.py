from core.base.database.migration import Migration


class WorkerTestCommandsMigration(Migration):
    """Keeps the test commands each worker may run, by name."""

    number = 54
    statements = (
        "CREATE TABLE worker_test_commands (id INTEGER PRIMARY KEY, worker_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT,"
        " name TEXT NOT NULL, command TEXT NOT NULL, version INTEGER NOT NULL DEFAULT 1, metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)),"
        " created_at TEXT NOT NULL, updated_at TEXT NOT NULL) STRICT",
        "CREATE UNIQUE INDEX worker_test_commands_worker_name ON worker_test_commands (worker_id, name)",
    )
