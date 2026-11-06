from core.base.database.migration import Migration


class WorkerTestRequestsMigration(Migration):
    """Creates the requests of workers to run one test command once in the middle of a phase."""

    number = 22
    statements = (
        "CREATE TABLE worker_test_requests (id INTEGER PRIMARY KEY, worker_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT,"
        " task_id INTEGER NOT NULL REFERENCES tasks(id) ON DELETE RESTRICT, command TEXT NOT NULL, reason TEXT NOT NULL,"
        " state TEXT NOT NULL DEFAULT 'requested', version INTEGER NOT NULL DEFAULT 1,"
        " metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)), created_at TEXT NOT NULL, updated_at TEXT NOT NULL) STRICT",
        "CREATE INDEX worker_test_requests_worker_state ON worker_test_requests (worker_id, state)",
    )
