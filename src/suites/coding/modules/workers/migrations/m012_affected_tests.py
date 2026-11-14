from engine.database.migration import Migration


class AffectedTestsMigration(Migration):
    """Creates the records of tests selected for worker changes."""

    number = 12
    statements = (
        "CREATE TABLE affected_tests (id INTEGER PRIMARY KEY, worktree_id INTEGER NOT NULL REFERENCES worker_worktrees(id),"
        " task_id INTEGER NOT NULL REFERENCES tasks(id), picker_command TEXT NOT NULL, test_command TEXT NOT NULL,"
        " state TEXT NOT NULL, process_id INTEGER, version INTEGER NOT NULL DEFAULT 1,"
        " metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)), created_at TEXT NOT NULL, updated_at TEXT NOT NULL) STRICT",
    )
