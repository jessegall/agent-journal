from engine.database.migration import Migration


class PhaseTestDeferralsMigration(Migration):
    """Creates the test paths a merger leaves out of a checkpoint's own test until the next checkpoint."""

    number = 67
    statements = (
        "CREATE TABLE phase_test_deferrals (id INTEGER PRIMARY KEY, environment_id INTEGER NOT NULL REFERENCES environments(id) ON DELETE RESTRICT,"
        " creator_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT, phase_id INTEGER NOT NULL REFERENCES phases(id) ON DELETE CASCADE,"
        " due_phase_id INTEGER NOT NULL REFERENCES phases(id) ON DELETE CASCADE, paths TEXT NOT NULL,"
        " worker_id INTEGER NOT NULL REFERENCES agents(id) ON DELETE RESTRICT, reason TEXT NOT NULL, closed_at TEXT,"
        " version INTEGER NOT NULL DEFAULT 1, metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)),"
        " created_at TEXT NOT NULL, updated_at TEXT NOT NULL) STRICT",
        "CREATE INDEX phase_test_deferrals_environment ON phase_test_deferrals (environment_id, id)",
        "CREATE INDEX phase_test_deferrals_phase ON phase_test_deferrals (phase_id)",
        "CREATE INDEX phase_test_deferrals_due_phase ON phase_test_deferrals (due_phase_id)",
        "CREATE INDEX phase_test_deferrals_worker ON phase_test_deferrals (worker_id)",
        "CREATE INDEX phase_test_deferrals_creator ON phase_test_deferrals (creator_id)",
    )
