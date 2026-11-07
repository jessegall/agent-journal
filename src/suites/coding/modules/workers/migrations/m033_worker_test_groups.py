from core.base.database.migration import Migration


class WorkerTestGroupsMigration(Migration):
    """Keeps counted runs for either a phase or a batch."""

    number = 33
    statements = (
        "CREATE TABLE worker_test_runs (id INTEGER PRIMARY KEY, worker_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT,"
        " group_key TEXT NOT NULL, version INTEGER NOT NULL DEFAULT 1, metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)),"
        " created_at TEXT NOT NULL, updated_at TEXT NOT NULL) STRICT",
        "INSERT INTO worker_test_runs (id, worker_id, group_key, version, metadata, created_at, updated_at)"
        " SELECT id, worker_id, 'phase:' || phase_id, version, metadata, created_at, updated_at FROM worker_phase_test_runs",
        "DROP TABLE worker_phase_test_runs",
        "CREATE INDEX worker_test_runs_worker_group ON worker_test_runs (worker_id, group_key)",
    )
