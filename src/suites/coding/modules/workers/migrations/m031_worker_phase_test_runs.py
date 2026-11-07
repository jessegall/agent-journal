from core.base.database.migration import Migration


class WorkerPhaseTestRunsMigration(Migration):
    """Records counted test commands by worker and phase."""

    number = 31
    statements = (
        "CREATE TABLE worker_phase_test_runs (id INTEGER PRIMARY KEY, worker_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT,"
        " phase_id INTEGER NOT NULL REFERENCES phases(id) ON DELETE RESTRICT, version INTEGER NOT NULL DEFAULT 1,"
        " metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)), created_at TEXT NOT NULL, updated_at TEXT NOT NULL) STRICT",
        "CREATE INDEX worker_phase_test_runs_worker_phase ON worker_phase_test_runs (worker_id, phase_id)",
    )
