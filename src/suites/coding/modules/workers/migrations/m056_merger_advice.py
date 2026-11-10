from engine.database.migration import Migration


class MergerAdviceMigration(Migration):
    """Keeps the merger's advice and its visits, and which worker and group a worker's question counts against."""

    number = 56
    statements = (
        "CREATE TABLE merger_advices (id INTEGER PRIMARY KEY, environment_id INTEGER NOT NULL REFERENCES environments(id) ON DELETE RESTRICT,"
        " worker_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT, group_key TEXT NOT NULL, step TEXT NOT NULL, task_id INTEGER NOT NULL,"
        " visit_id INTEGER, text TEXT NOT NULL, version INTEGER NOT NULL DEFAULT 1, metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)),"
        " created_at TEXT NOT NULL, updated_at TEXT NOT NULL) STRICT",
        "CREATE INDEX merger_advices_worker_group ON merger_advices (worker_id, group_key)",
        "CREATE TABLE merger_visits (id INTEGER PRIMARY KEY, environment_id INTEGER NOT NULL REFERENCES environments(id) ON DELETE RESTRICT,"
        " version INTEGER NOT NULL DEFAULT 1, metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)), created_at TEXT NOT NULL, updated_at TEXT NOT NULL) STRICT",
        "CREATE INDEX merger_visits_environment ON merger_visits (environment_id, id)",
        "ALTER TABLE merger_lines ADD COLUMN worker_id INTEGER",
        "ALTER TABLE merger_lines ADD COLUMN group_key TEXT",
        "CREATE INDEX merger_lines_worker_group ON merger_lines (worker_id, group_key)",
    )
