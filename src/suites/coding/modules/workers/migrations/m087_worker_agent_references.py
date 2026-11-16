from engine.database.rebuild_migration import RebuildMigration


class WorkerAgentReferencesMigration(RebuildMigration):
    """The worker of a test failure, a test run, a test command and a merger advice references agents, as every
    column that holds an agent's id does."""

    number = 87
    statements = (
        "CREATE TABLE worker_test_failures_rebuilt (id INTEGER PRIMARY KEY, worker_id INTEGER NOT NULL REFERENCES agents(id) ON DELETE RESTRICT, task_id INTEGER NOT NULL REFERENCES tasks(id) ON DELETE RESTRICT, source TEXT NOT NULL, test_name TEXT NOT NULL, version INTEGER NOT NULL DEFAULT 1, metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)), created_at TEXT NOT NULL, updated_at TEXT NOT NULL) STRICT",
        "INSERT INTO worker_test_failures_rebuilt (id, worker_id, task_id, source, test_name, version, metadata, created_at, updated_at) SELECT id, worker_id, task_id, source, test_name, version, metadata, created_at, updated_at FROM worker_test_failures",
        "DROP TABLE worker_test_failures",
        "ALTER TABLE worker_test_failures_rebuilt RENAME TO worker_test_failures",
        "CREATE INDEX worker_test_failures_task ON worker_test_failures (task_id, source, test_name)",
        "CREATE TABLE worker_test_runs_rebuilt (id INTEGER PRIMARY KEY, worker_id INTEGER NOT NULL REFERENCES agents(id) ON DELETE RESTRICT, group_key TEXT NOT NULL, version INTEGER NOT NULL DEFAULT 1, metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)), created_at TEXT NOT NULL, updated_at TEXT NOT NULL) STRICT",
        "INSERT INTO worker_test_runs_rebuilt (id, worker_id, group_key, version, metadata, created_at, updated_at) SELECT id, worker_id, group_key, version, metadata, created_at, updated_at FROM worker_test_runs",
        "DROP TABLE worker_test_runs",
        "ALTER TABLE worker_test_runs_rebuilt RENAME TO worker_test_runs",
        "CREATE INDEX worker_test_runs_worker_group ON worker_test_runs (worker_id, group_key)",
        "CREATE TABLE worker_test_commands_rebuilt (id INTEGER PRIMARY KEY, worker_id INTEGER NOT NULL REFERENCES agents(id) ON DELETE RESTRICT, name TEXT NOT NULL, command TEXT NOT NULL, version INTEGER NOT NULL DEFAULT 1, metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)), created_at TEXT NOT NULL, updated_at TEXT NOT NULL) STRICT",
        "INSERT INTO worker_test_commands_rebuilt (id, worker_id, name, command, version, metadata, created_at, updated_at) SELECT id, worker_id, name, command, version, metadata, created_at, updated_at FROM worker_test_commands",
        "DROP TABLE worker_test_commands",
        "ALTER TABLE worker_test_commands_rebuilt RENAME TO worker_test_commands",
        "CREATE UNIQUE INDEX worker_test_commands_worker_name ON worker_test_commands (worker_id, name)",
        "CREATE TABLE merger_advices_rebuilt (id INTEGER PRIMARY KEY, environment_id INTEGER NOT NULL REFERENCES environments(id) ON DELETE RESTRICT, worker_id INTEGER NOT NULL REFERENCES agents(id) ON DELETE RESTRICT, group_key TEXT NOT NULL, step TEXT NOT NULL, task_id INTEGER NOT NULL, visit_id INTEGER, text TEXT NOT NULL, version INTEGER NOT NULL DEFAULT 1, metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)), created_at TEXT NOT NULL, updated_at TEXT NOT NULL) STRICT",
        "INSERT INTO merger_advices_rebuilt (id, environment_id, worker_id, group_key, step, task_id, visit_id, text, version, metadata, created_at, updated_at) SELECT id, environment_id, worker_id, group_key, step, task_id, visit_id, text, version, metadata, created_at, updated_at FROM merger_advices",
        "DROP TABLE merger_advices",
        "ALTER TABLE merger_advices_rebuilt RENAME TO merger_advices",
        "CREATE INDEX merger_advices_worker_group ON merger_advices (worker_id, group_key)",
        "CREATE INDEX merger_advices_environment ON merger_advices (environment_id, id)",
    )
