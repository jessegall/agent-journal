from engine.database.migration import Migration


class CheckpointTestsMigration(Migration):
    """Creates the tests a checkpoint run makes beside the proofs of its window."""

    number = 65
    statements = (
        "CREATE TABLE checkpoint_tests (id INTEGER PRIMARY KEY, reach_id INTEGER NOT NULL REFERENCES checkpoint_reaches(id) ON DELETE CASCADE,"
        " owner_agent_id INTEGER NOT NULL REFERENCES agents(id) ON DELETE RESTRICT, picker_command TEXT NOT NULL DEFAULT '', test_command TEXT NOT NULL,"
        " state TEXT NOT NULL, process_id INTEGER NOT NULL REFERENCES processes(id) ON DELETE CASCADE, version INTEGER NOT NULL DEFAULT 1,"
        " metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)), created_at TEXT NOT NULL, updated_at TEXT NOT NULL) STRICT",
        "CREATE INDEX checkpoint_tests_reach ON checkpoint_tests (reach_id)",
        "CREATE INDEX checkpoint_tests_process ON checkpoint_tests (process_id)",
        "CREATE INDEX checkpoint_tests_owner_agent ON checkpoint_tests (owner_agent_id)",
    )
